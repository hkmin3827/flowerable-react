import { useState, useEffect } from "react";
import { axiosInstance } from "@/shared/api/axios";
import { useAuthStore } from "@/features/auth/store";
import { useWithdraw } from "@/features/auth/hooks";
import { WithdrawReq } from "@/features/auth/types";
import {
  Container,
  ProfileCard,
  Header,
  Title,
  InfoBadge,
  InfoSection,
  InfoRow,
  Label,
  Value,
  ShopStatusBadge,
  AccountStatusBadge,
  Notice,
  NoticeTitle,
  NoticeText,
  LoadingText,
  ErrorText,
  WithdrawButton,
} from "./ShopProfilePage.styles";
import { ShopProfile } from "@/shared/types";

export const ShopProfilePage = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<ShopProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const withdrawMutation = useWithdraw();

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

    const payload: WithdrawReq = {
      confirmText: input,
      password,
    };

    withdrawMutation.mutate(payload);
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
