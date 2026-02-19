import { useState, useEffect } from "react";
import styled from "styled-components";
import { axiosInstance } from "@/shared/api/axios";
import { useAuthStore } from "@/features/auth/store";
import { AccountStatus } from "@/shared/types";
import { authApi } from "@/features/auth/api";
import { useNavigate } from "react-router-dom";

interface UserDetail {
  id: number;
  email: string;
  name: string;
  telnum: string;
  provider: string;
  createdAt: string;
  active: boolean;
  accountStatus: AccountStatus;
}

export const UserProfilePage = () => {
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", telnum: "" });
  const [loading, setLoading] = useState(true);
  const updateUser = useAuthStore((s) => s.updateUser);
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetail();
  }, []);

  const fetchUserDetail = async () => {
    try {
      const { data } = await axiosInstance.get("/users/me");
      setUserDetail(data);
      setEditForm({ name: data.name, telnum: data.telnum });
    } catch (error) {
      console.error("Failed to fetch user detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInfo = async () => {
    if (!editForm.name.trim() || !editForm.telnum.trim()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      await axiosInstance.patch("/users/me", editForm);

      setUserDetail((prev) =>
        prev
          ? {
              ...prev,
              name: editForm.name,
              telnum: editForm.telnum,
            }
          : prev,
      );

      updateUser({
        name: editForm.name,
      });
      alert("프로필이 수정되었습니다.");

      setIsEditing(false);
    } catch (error: any) {
      if (error.response?.data) {
        const serverError = error.response.data;

        if (serverError.message) {
          alert(serverError.message);
          return;
        }

        if (
          Array.isArray(serverError.errors) &&
          serverError.errors.length > 0
        ) {
          alert(serverError.errors[0].message);
          return;
        }
        alert("프로필 수정 실패 : " + error.response?.data?.message);
      }
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
      const payload =
        user?.provider === "LOCAL"
          ? { confirmText: input, password: password! }
          : { confirmText: input };

      await authApi.withdraw(payload as any);

      alert("탈퇴가 완료되었습니다.");
      clearAuth(); // 토큰 제거 + 라우팅
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

  if (!userDetail) {
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
          <Title>내 프로필</Title>
          {!isEditing && (
            <EditButton onClick={() => setIsEditing(true)}>수정</EditButton>
          )}
        </Header>

        <InfoSection>
          <InfoRow>
            <Label>이메일</Label>
            <Value>{userDetail.email}</Value>
          </InfoRow>

          <InfoRow>
            <Label>이름</Label>
            {isEditing ? (
              <Input
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            ) : (
              <Value>{userDetail.name}</Value>
            )}
          </InfoRow>

          <InfoRow>
            <Label>전화번호</Label>
            {isEditing ? (
              <Input
                type="tel"
                value={editForm.telnum}
                onChange={(e) =>
                  setEditForm({ ...editForm, telnum: e.target.value })
                }
              />
            ) : (
              <Value>{userDetail.telnum}</Value>
            )}
          </InfoRow>

          <InfoRow>
            <Label>계정 연동</Label>
            <Value>
              {userDetail.provider === "LOCAL" ? "X" : userDetail.provider}
            </Value>
          </InfoRow>

          <InfoRow>
            <Label>가입일</Label>
            <Value>{new Date(userDetail.createdAt).toLocaleDateString()}</Value>
          </InfoRow>

          <InfoRow>
            <Label>계정 상태</Label>
            <AccountStatusBadge $status={userDetail.accountStatus}>
              {userDetail.accountStatus === "ACTIVE" && "활성"}
              {userDetail.accountStatus === "SUSPENDED" && "정지"}
              {userDetail.accountStatus === "DELETED" && "탈퇴"}
            </AccountStatusBadge>
          </InfoRow>
          <InfoRow>
            <Label>활동 가능 여부</Label>
            <StatusBadge $active={userDetail.active}>
              {userDetail.active ? "활성" : "제한"}
            </StatusBadge>
          </InfoRow>
        </InfoSection>

        {isEditing && (
          <ButtonGroup>
            <CancelButton
              onClick={() => {
                setIsEditing(false);
                setEditForm({
                  name: userDetail.name,
                  telnum: userDetail.telnum,
                });
              }}
            >
              취소
            </CancelButton>
            <SaveButton onClick={handleUpdateInfo}>저장</SaveButton>
          </ButtonGroup>
        )}
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ $active }) => ($active ? "#d1fae5" : "#fee2e2")};
  color: ${({ $active }) => ($active ? "#065f46" : "#991b1b")};
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const SaveButton = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2563eb;
  }
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
