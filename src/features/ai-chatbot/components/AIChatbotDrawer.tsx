import { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Markdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { useAIChatbotStore } from "../store";
import { useAuthStore } from "@/features/auth/store";
import { sendAiRecommend } from "../api";
import type { ChatMessage } from "../types";
import logo from "@/images/logos/flowerable로고배경제거.png";

export const AIChatbotDrawer = () => {
  const { isOpen, close } = useAIChatbotStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await sendAiRecommend(trimmed);
      const content = res.recommendation || res.message || "";
      const assistantMsg: ChatMessage = {
        id: `${Date.now()}-ai`,
        role: "assistant",
        content,
        shops: res.shops ?? undefined,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-err`,
          role: "assistant",
          content: "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleShopClick = (shopId: number) => {
    if (!isAuthenticated) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }
    navigate(`/shops/${shopId}`);
  };

  return (
    <DrawerPanel $open={isOpen}>
      <DrawerHeader>
        <TitleRow>
          <RobotIcon>🌼</RobotIcon>
          <DrawerTitle>플라워러블 꽃 추천 챗봇</DrawerTitle>
        </TitleRow>
        <CloseBtn onClick={close} aria-label="닫기">
          ✕
        </CloseBtn>
      </DrawerHeader>

      <MessagesArea>
        {messages.length === 0 && (
          <WelcomeCard>
            <WelcomeEmoji>
              <img src={logo} alt="로고" />
            </WelcomeEmoji>
            <WelcomeHeading>안녕하세요!</WelcomeHeading>
            <WelcomeBody>
              AI 꽃 추천 도우미입니다.
              <br />
              어떤 상황을 위한 꽃을 찾고 계신가요?
              <br />
              지역 정보도 함께 알려주시면 근처 꽃집도 찾아드려요.
            </WelcomeBody>
            <ExampleChips>
              <ExampleChip
                onClick={() =>
                  setInput("어머니 생신 선물로 드릴 꽃다발 추천해줘")
                }
              >
                어머니 생신 선물
              </ExampleChip>
              <ExampleChip
                onClick={() => setInput("졸업식 축하 꽃다발 추천해줘")}
              >
                졸업 축하 꽃다발
              </ExampleChip>
              <ExampleChip
                onClick={() =>
                  setInput("여자친구 또는 남자친구와의 기념일 꽃다발 추천해줘")
                }
              >
                연인 기념일 꽃다발
              </ExampleChip>
            </ExampleChips>
          </WelcomeCard>
        )}

        {messages.map((msg) => (
          <MessageRow key={msg.id} $isUser={msg.role === "user"}>
            {msg.role === "assistant" && (
              <BotAvatar>
                {" "}
                <img src={logo} alt="로고" />
              </BotAvatar>
            )}
            <BubbleWrapper $isUser={msg.role === "user"}>
              <Bubble $isUser={msg.role === "user"}>
                {msg.role === "assistant" ? (
                  <MarkdownWrapper className="prose prose-sm max-w-none">
                    <Markdown>{msg.content}</Markdown>
                  </MarkdownWrapper>
                ) : (
                  <UserText>{msg.content}</UserText>
                )}
              </Bubble>
              {msg.shops && msg.shops.length > 0 && (
                <ShopLinksContainer>
                  <ShopLinksLabel>📍 추천 꽃집</ShopLinksLabel>
                  {msg.shops.map((shop) => (
                    <ShopLinkBtn
                      key={shop.shopId}
                      onClick={() => handleShopClick(shop.shopId)}
                    >
                      <ShopLinkIcon>🏪</ShopLinkIcon>
                      <ShopLinkText>
                        <ShopLinkName>{shop.shopName}</ShopLinkName>
                        <ShopLinkSub>꽃집 상세페이지 이동 →</ShopLinkSub>
                      </ShopLinkText>
                    </ShopLinkBtn>
                  ))}
                </ShopLinksContainer>
              )}
            </BubbleWrapper>
          </MessageRow>
        ))}

        {isLoading && (
          <MessageRow $isUser={false}>
            <BotAvatar>
              <img src={logo} alt="로고" />
            </BotAvatar>
            <BubbleWrapper $isUser={false}>
              <Bubble $isUser={false}>
                <LoadingDots>
                  <Dot $delay="0s" />
                  <Dot $delay="0.15s" />
                  <Dot $delay="0.3s" />
                </LoadingDots>
              </Bubble>
            </BubbleWrapper>
          </MessageRow>
        )}

        <div ref={messagesEndRef} />
      </MessagesArea>

      <InputArea>
        <StyledTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="꽃이 필요한 상황을 알려주세요... (Enter 전송 / Shift+Enter 줄바꿈)"
          rows={2}
          disabled={isLoading}
        />
        <SendBtn onClick={handleSend} disabled={!input.trim() || isLoading}>
          전송
        </SendBtn>
      </InputArea>
    </DrawerPanel>
  );
};

const DrawerPanel = styled.div<{ $open: boolean }>`
  width: ${({ $open }) => ($open ? "500px" : "0")};
  min-width: ${({ $open }) => ($open ? "400px" : "0")};
  height: 100vh;
  overflow: hidden;
  transition:
    width 0.3s ease,
    min-width 0.3s ease;
  border-left: ${({ $open }) => ($open ? "1px solid #e5e7eb" : "none")};
  background: #fafafa;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    width: ${({ $open }) => ($open ? "100vw" : "0")};
    min-width: ${({ $open }) => ($open ? "100vw" : "0")};
    z-index: 300;
    border-left: none;
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RobotIcon = styled.span`
  font-size: 1.4rem;
`;

const DrawerTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.1rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }
`;

const WelcomeCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  margin: 0.5rem 0;
`;

const WelcomeEmoji = styled.div`
  font-size: 2.5rem;
  width: 100px;
  margin: 0 auto;
  margin-bottom: 20px;
`;

const WelcomeHeading = styled.p`
  font-weight: 700;
  font-size: 1rem;
  color: #111827;
  margin: 0 0 0.5rem;
`;

const WelcomeBody = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.75;
  margin: 0 0 1rem;
`;

const ExampleChips = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const ExampleChip = styled.button`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1d4ed8;
  font-size: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;

  &:hover {
    background: #dbeafe;
  }
`;

const MessageRow = styled.div<{ $isUser: boolean }>`
  display: flex;
  flex-direction: ${({ $isUser }) => ($isUser ? "row-reverse" : "row")};
  align-items: flex-end;
  gap: 0.5rem;
`;

const BotAvatar = styled.span`
  font-size: 1.25rem;
  flex-shrink: 0;
  width: 30px;
  margin-bottom: 0.25rem;
`;

const BubbleWrapper = styled.div<{ $isUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $isUser }) => ($isUser ? "flex-end" : "flex-start")};
  gap: 0.5rem;
  max-width: 85%;
`;

const Bubble = styled.div<{ $isUser: boolean }>`
  background: ${({ $isUser }) => ($isUser ? "#3b82f6" : "white")};
  color: ${({ $isUser }) => ($isUser ? "white" : "#111827")};
  border: ${({ $isUser }) => ($isUser ? "none" : "1px solid #e5e7eb")};
  border-radius: ${({ $isUser }) =>
    $isUser ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem"};
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  line-height: 1.6;
  word-break: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
`;

const UserText = styled.span`
  white-space: pre-wrap;
`;

const MarkdownWrapper = styled.div`
  & p {
    margin: 0.25rem 0;
  }
  & p:first-child {
    margin-top: 0;
  }
  & p:last-child {
    margin-bottom: 0;
  }
  & h1,
  & h2,
  & h3,
  & h4 {
    color: #111827;
    font-weight: 700;
    margin: 0.5rem 0 0.25rem;
  }
  & h3 {
    font-size: 0.9375rem;
  }
  & ul,
  & ol {
    padding-left: 1.25rem;
    margin: 0.25rem 0;
  }
  & li {
    margin: 0.125rem 0;
  }
  & strong {
    font-weight: 600;
  }
  & code {
    background: #f3f4f6;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.8125rem;
  }
  & blockquote {
    border-left: 3px solid #3b82f6;
    padding-left: 0.75rem;
    margin: 0.5rem 0;
    color: #6b7280;
  }
`;

const ShopLinksContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  width: 100%;
`;

const ShopLinksLabel = styled.div`
  padding: 0.5rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const ShopLinkBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 0.875rem;
  background: white;
  border: none;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #eff6ff;
  }
`;

const ShopLinkIcon = styled.span`
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const ShopLinkText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const ShopLinkName = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
`;

const ShopLinkSub = styled.span`
  font-size: 0.75rem;
  color: #3b82f6;
`;

const dotBounce = keyframes`
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-6px); opacity: 1; }
`;

const LoadingDots = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.125rem 0;
`;

const Dot = styled.span<{ $delay: string }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #9ca3af;
  animation: ${dotBounce} 1.2s infinite ease-in-out;
  animation-delay: ${({ $delay }) => $delay};
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: white;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-family: inherit;
  resize: none;
  outline: none;
  line-height: 1.5;
  color: #111827;
  background: #f9fafb;
  transition:
    border-color 0.15s,
    background 0.15s;
  box-sizing: border-box;

  &:focus {
    border-color: #3b82f6;
    background: white;
  }

  &::placeholder {
    color: #9ca3af;
    font-size: 0.8125rem;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SendBtn = styled.button`
  align-self: flex-end;
  padding: 0.5rem 1.25rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    background: #bfdbfe;
    cursor: not-allowed;
  }
`;
