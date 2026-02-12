import { useState, useEffect } from "react";
import styled from "styled-components";
import { axiosInstance } from "@/shared/api/axios";
import { useAuthStore } from "@/features/auth/store";

interface ShopProfile {
  id: number;
  email: string;
  name: string;
  telnum: string;
  provider: string;
  createdAt: string;
  active: boolean;
}

export const ShopProfilePage = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<ShopProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
            <Label>담당자명</Label>
            <Value>{profile.name}</Value>
          </InfoRow>

          <InfoRow>
            <Label>전화번호</Label>
            <Value>{profile.telnum}</Value>
          </InfoRow>

          <InfoRow>
            <Label>로그인 방식</Label>
            <Value>
              {profile.provider === "LOCAL" ? "일반" : profile.provider}
            </Value>
          </InfoRow>

          <InfoRow>
            <Label>가입일</Label>
            <Value>{new Date(profile.createdAt).toLocaleDateString()}</Value>
          </InfoRow>

          <InfoRow>
            <Label>계정 상태</Label>
            <StatusBadge $active={profile.active}>
              {profile.active ? "활성" : "비활성"}
            </StatusBadge>
          </InfoRow>

          {user?.shopStatus && (
            <InfoRow>
              <Label>샵 승인 상태</Label>
              <ShopStatusBadge $status={user.shopStatus}>
                {user.shopStatus === "PENDING" && "승인 대기"}
                {user.shopStatus === "ACTIVE" && "승인 완료"}
                {user.shopStatus === "SUSPENDED" && "승인 거부"}
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

const StatusBadge = styled.span<{ $active: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ $active }) => ($active ? "#d1fae5" : "#fee2e2")};
  color: ${({ $active }) => ($active ? "#065f46" : "#991b1b")};
`;

const ShopStatusBadge = styled.span<{ $status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ $status }) => {
    if ($status === "APPROVED") return "#d1fae5";
    if ($status === "REJECTED") return "#fee2e2";
    return "#fef3c7";
  }};
  color: ${({ $status }) => {
    if ($status === "APPROVED") return "#065f46";
    if ($status === "REJECTED") return "#991b1b";
    return "#92400e";
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
