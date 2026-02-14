import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { axiosInstance } from "@/shared/api/axios";
import { colors, LoadingContainer, Card } from "@/shared/ui/CommonStyles";
import { User, Phone, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  telnum: string;
  createdAt: string;
}

const Container = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: ${colors.text};
  margin-bottom: 2rem;
`;

const ProfileCard = styled(Card)`
  padding: 2rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid ${colors.border};
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.primary};
  font-size: 2rem;
  font-weight: bold;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${colors.text};
  margin-bottom: 0.5rem;
`;

const ProfileEmail = styled.p`
  color: ${colors.textSecondary};
  font-size: 0.875rem;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${colors.background};
  border-radius: 0.5rem;
`;

const InfoIcon = styled.div`
  color: ${colors.primary};
  flex-shrink: 0;
`;

const InfoLabel = styled.span`
  flex: 1;
  color: ${colors.textSecondary};
  font-size: 0.875rem;
  min-width: 80px;
`;

const InfoValue = styled.span`
  font-weight: 500;
  color: ${colors.text};
`;

const UserProfileDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get<UserProfile>(`/users/${userId}`);
      setProfile(response.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>로딩 중...</LoadingContainer>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container>
        <LoadingContainer>사용자 정보를 찾을 수 없습니다</LoadingContainer>
      </Container>
    );
  }

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <Container>
      <PageTitle>사용자 프로필</PageTitle>

      <ProfileCard>
        <ProfileHeader>
          <Avatar>{getInitial(profile.name)}</Avatar>
          <ProfileInfo>
            <ProfileName>{profile.name}</ProfileName>
            <ProfileEmail>{profile.email}</ProfileEmail>
          </ProfileInfo>
        </ProfileHeader>

        <InfoSection>
          <InfoItem>
            <InfoIcon>
              <User size={20} />
            </InfoIcon>
            <InfoLabel>이름</InfoLabel>
            <InfoValue>{profile.name}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoIcon>
              <Mail size={20} />
            </InfoIcon>
            <InfoLabel>이메일</InfoLabel>
            <InfoValue>{profile.email}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoIcon>
              <Phone size={20} />
            </InfoIcon>
            <InfoLabel>전화번호</InfoLabel>
            <InfoValue>{profile.telnum}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoIcon>
              <Calendar size={20} />
            </InfoIcon>
            <InfoLabel>가입일</InfoLabel>
            <InfoValue>
              {format(new Date(profile.createdAt), "yyyy년 MM월 dd일")}
            </InfoValue>
          </InfoItem>
        </InfoSection>
      </ProfileCard>
    </Container>
  );
};

export default UserProfileDetail;
