import { useState, useEffect } from "react";
import styled from "styled-components";
import { axiosInstance } from "@/shared/api/axios";
import { useAuthStore } from "@/features/auth/store";
import { authApi } from "@/features/auth/api";
import { AccountStatus, ShopProfile } from "@/shared/types";
import { useNavigate } from "react-router-dom";

export const ShopProfilePage = () => {
  const { user, clearAuth } = useAuthStore();
  const [profile, setProfile] = useState<ShopProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axiosInstance.get("/shops/me");
      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const WITHDRAW_CONFIRM_TEXT = "영구탈퇴임을 확인했습니다";

  const handleWithdraw = async () => {
    const confirmed = window.confirm(
      "계정을 탈퇴하면 다시 복구 불가능합니다. 계속하시겠습니까?",
    );
    if (!confirmed) return;

    const input = window.prompt(
      `계정을 탈퇴하려면 아래 문구를 정확히 입력하세요.\n\n"${WITHDRAW_CONFIRM_TEXT}"`,
    );

    if (input === null) return;
    if (input !== WITHDRAW_CONFIRM_TEXT) {
      alert("탈퇴 확인 문구가 일치하지 않습니다.");
      return;
    }

    let password: string | undefined;

    if (user?.provider === "LOCAL") {
      const pw = window.prompt("비밀번호를 입력하세요.");
      if (pw === null || pw.trim() === "") {
        alert("비밀번호를 입력해야 합니다.");
        return;
      }
      password = pw;
    }

    try {
      const payload = { confirmText: input, password: password! };

      await authApi.withdraw(payload as any);

      alert("탈퇴가 완료되었습니다.");
      clearAuth();
      navigate("/login");
    } catch (error: any) {
      const status = error.response.status;
      const message = error?.response?.data?.message;

      if (status === 400) {
        // confirmText 틀림 / validation 등
        alert(message ?? "요청이 올바르지 않습니다.");
        return;
      }

      if (status === 401) {
        alert(message ?? "비밀번호가 올바르지 않습니다.");
        return;
      }

      if (status === 403) {
        alert(message ?? "탈퇴 권한이 없습니다.");
        return;
      }

      alert(message ?? "탈퇴 처리 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingText>로딩 중...</LoadingText>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container>
        <ErrorText>프로필 정보를 불러올 수 없습니다.</ErrorText>
      </Container>
    );
  }

  return (
    <Container>
      <ProfileCard>
        <Header>
          <Title>계정 정보</Title>
          <InfoBadge>샵 관련 정보는 "샵 관리"에서 확인하세요</InfoBadge>
        </Header>

        <InfoSection>
          <InfoRow>
            <Label>이메일</Label>
            <Value>{profile.email}</Value>
          </InfoRow>

          <InfoRow>
            <Label>매장명</Label>
            <Value>{profile.shopName}</Value>
          </InfoRow>

          <InfoRow>
            <Label>전화번호</Label>
            <Value>{profile.telnum}</Value>
          </InfoRow>

          <InfoRow>
            <Label>가입일</Label>
            <Value>{new Date(profile.registerAt).toLocaleDateString()}</Value>
          </InfoRow>

          <InfoRow>
            <Label>계정 상태</Label>
            <AccountStatusBadge $status={profile.accountStatus}>
              {profile.accountStatus === "ACTIVE" && "활성"}
              {profile.accountStatus === "SUSPENDED" && "비활성"}
              {profile.accountStatus === "DELETED" && "탈퇴"}
            </AccountStatusBadge>
          </InfoRow>

          {user?.shopStatus && (
            <InfoRow>
              <Label>샵 승인 상태</Label>
              <ShopStatusBadge $status={profile.status}>
                {profile.status === "PENDING" && "승인 대기"}
                {profile.status === "ACTIVE" && "승인 완료"}
                {profile.status === "REJECTED" && "승인 거부"}
                {profile.status === "SUSPENDED" && "활동 정지"}
              </ShopStatusBadge>
            </InfoRow>
          )}
        </InfoSection>

        <Notice>
          <NoticeTitle>📌 안내</NoticeTitle>
          <NoticeText>
            • 계정 정보는 고객센터를 통해서만 변경 가능합니다.
          </NoticeText>
          <NoticeText>
            • 샵 정보(이름, 주소, 운영시간 등)는 "샵 관리" 메뉴에서 수정할 수
            있습니다.
          </NoticeText>
        </Notice>
        <WithdrawButton onClick={handleWithdraw}>탈퇴하기</WithdrawButton>
      </ProfileCard>
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const InfoBadge = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #eff6ff;
  color: #1e40af;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Label = styled.div`
  font-weight: 600;
  color: #6b7280;
  min-width: 120px;
`;

const Value = styled.div`
  color: #111827;
  flex: 1;
`;

const ShopStatusBadge = styled.span<{ $status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ $status }) => {
    if ($status === "ACTIVE") return "#d1fae5";
    if ($status === "REJECTED") return "#fee2e2";
    return "#fef3c7";
  }};
  color: ${({ $status }) => {
    if ($status === "ACTIVE") return "#065f46";
    if ($status === "REJECTED") return "#991b1b";
    return "#92400e";
  }};
`;

const AccountStatusBadge = styled.span<{ $status: AccountStatus }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;

  background-color: ${({ $status }) => {
    switch ($status) {
      case "ACTIVE":
        return "#d1fae5"; // 기존 활성 배경
      case "SUSPENDED":
        return "#fee2e2"; // 기존 제한 배경
      case "DELETED":
        return "#e5e7eb"; // 회색 배경
      default:
        return "#f3f4f6";
    }
  }};

  color: ${({ $status }) => {
    switch ($status) {
      case "ACTIVE":
        return "#065f46"; // 기존 활성 글자
      case "SUSPENDED":
        return "#991b1b"; // 기존 제한 글자
      case "DELETED":
        return "#4b5563"; // 회색 글자
      default:
        return "#374151";
    }
  }};
`;

const Notice = styled.div`
  background-color: #f9fafb;
  border-left: 4px solid #3b82f6;
  padding: 1rem;
  border-radius: 0.375rem;
`;

const NoticeTitle = styled.div`
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const NoticeText = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.125rem;
  color: #6b7280;
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.125rem;
  color: #ef4444;
`;

const WithdrawButton = styled.button`
  padding: 5px 0;
  margin-top: 50px;
  width: 100%;
  border-radius: 999px;
  cursor: pointer;
  border: none;
  background-color: #eeeeee;
  color: #666;

  &:hover {
    color: #fff;
    background-color: #e11111;
  }
`;
