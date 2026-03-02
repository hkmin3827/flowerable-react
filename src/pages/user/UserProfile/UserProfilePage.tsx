import { useState, useEffect } from "react";
import { axiosInstance } from "@/shared/api/axios";
import { useAuthStore } from "@/features/auth/store";
import { AccountStatus } from "@/shared/types";
import { authApi } from "@/features/auth/api";
import { useNavigate } from "react-router-dom";
import { extractErrorMessage } from "@/shared/utils/errorHandler";
import {
  Container,
  ProfileCard,
  Header,
  Title,
  EditButton,
  InfoSection,
  InfoRow,
  Label,
  Value,
  Input,
  StatusBadge,
  AccountStatusBadge,
  ButtonGroup,
  CancelButton,
  SaveButton,
  LoadingText,
  ErrorText,
  WithdrawButton,
} from "./UserProfilePage.styles";

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
    } catch (error) {
      alert(extractErrorMessage(error));
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

      await authApi.withdraw(payload);

      alert("탈퇴가 완료되었습니다.");
      clearAuth(); // 토큰 제거 + 라우팅
      navigate("/login");
    } catch (error) {
      alert(extractErrorMessage(error));
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
