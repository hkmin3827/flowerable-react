import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { adminFlowerAPI } from "@/features/admin/api";
import { AdminFlower, FlowerUpdateReq } from "@/features/admin/types";
import {
  colors,
  Container,
  PageTitle,
  Card,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Badge,
  Button,
  LoadingContainer,
  EmptyState,
  Pagination,
  PageButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  Select,
  Input,
  FormGroup,
  Label,
} from "@/shared/ui/CommonStyles";
import { X, Edit } from "lucide-react";

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  padding: 0.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${colors.textSecondary};
  transition: color 0.2s;

  &:hover {
    color: ${colors.text};
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const AdminFlowerManagePage: React.FC = () => {
  const [flowers, setFlowers] = useState<AdminFlower[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(
    undefined,
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState<AdminFlower | null>(
    null,
  );
  const [formData, setFormData] = useState<FlowerUpdateReq>({
    name: "",
    floralLang: "",
    category: "",
  });

  useEffect(() => {
    fetchFlowers();
  }, [page, activeFilter]);

  const fetchFlowers = async () => {
    setLoading(true);
    try {
      const response = await adminFlowerAPI.getFlowers(activeFilter, page, 20);
      setFlowers(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch flowers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFlowerStatus = async (
    flowerId: number,
    isActive: boolean,
  ) => {
    try {
      if (isActive) {
        await adminFlowerAPI.deactivateFlower(flowerId);
        alert("꽃을 비활성화했습니다.");
      } else {
        await adminFlowerAPI.activateFlower(flowerId);
        alert("꽃을 활성화했습니다.");
      }
      fetchFlowers();
    } catch (error) {
      console.error("Failed to toggle flower status:", error);
      alert("상태 변경에 실패했습니다.");
    }
  };

  const handleUpdateFlower = async () => {
    if (!selectedFlower) return;

    try {
      await adminFlowerAPI.updateFlower(
        selectedFlower.id,
        formData as FlowerUpdateReq,
      );
      alert("꽃 정보가 수정되었습니다.");
      setShowEditModal(false);
      setSelectedFlower(null);
      setFormData({ name: "", floralLang: "", category: "" });
      fetchFlowers();
    } catch (error) {
      console.error("Failed to update flower:", error);
      alert("꽃 정보 수정에 실패했습니다.");
    }
  };

  const handleOpenEditModal = (flower: AdminFlower) => {
    setSelectedFlower(flower);
    setFormData({
      name: flower.name,
      floralLang: flower.floralLang,
      category: flower.category,
    });
    setShowEditModal(true);
  };

  return (
    <Container>
      <PageTitle>꽃 컨텐츠 관리</PageTitle>

      <FilterBar>
        <Select
          value={
            activeFilter === undefined ? "" : activeFilter ? "true" : "false"
          }
          onChange={(e) => {
            const value = e.target.value;
            setActiveFilter(value === "" ? undefined : value === "true");
            setPage(0);
          }}
        >
          <option value="">전체</option>
          <option value="true">활성</option>
          <option value="false">비활성</option>
        </Select>
      </FilterBar>

      {loading ? (
        <LoadingContainer>로딩 중...</LoadingContainer>
      ) : flowers.length === 0 ? (
        <EmptyState>꽃 데이터가 없습니다</EmptyState>
      ) : (
        <>
          <Card>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>한글명</TableHeader>
                  <TableHeader>과</TableHeader>
                  <TableHeader>꽃말</TableHeader>
                  <TableHeader>계절</TableHeader>
                  <TableHeader>상태</TableHeader>
                  <TableHeader>액션</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {flowers.map((flower) => (
                  <TableRow key={flower.id}>
                    <TableCell>{flower.name}</TableCell>
                    <TableCell>{flower.floralLang}</TableCell>
                    <TableCell>{flower.category}</TableCell>
                    <TableCell>
                      <Badge variant={flower.active ? "success" : "secondary"}>
                        {flower.active ? "활성" : "비활성"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ActionButtons>
                        <Button
                          size="sm"
                          variant={flower.active ? "error" : "success"}
                          onClick={() =>
                            handleToggleFlowerStatus(flower.id, flower.active)
                          }
                        >
                          {flower.active ? "비활성" : "활성"}
                        </Button>
                      </ActionButtons>
                    </TableCell>
                    <TableCell>
                      <ActionButtons>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEditModal(flower)}
                        >
                          <Edit size={14} />
                          수정
                        </Button>
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {totalPages > 1 && (
            <Pagination>
              <PageButton
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                이전
              </PageButton>
              <span style={{ padding: "0.5rem 1rem" }}>
                {page + 1} / {totalPages}
              </span>
              <PageButton
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
              >
                다음
              </PageButton>
            </Pagination>
          )}
        </>
      )}

      {/* 꽃 수정 모달 */}
      {showEditModal && selectedFlower && (
        <ModalOverlay onClick={() => setShowEditModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>꽃 정보 수정</ModalTitle>
              <CloseButton onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label>꽃 이름</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label>꽃말</Label>
                <Input
                  value={formData.floralLang}
                  onChange={(e) =>
                    setFormData({ ...formData, floralLang: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label>계절</Label>
                <Input
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                취소
              </Button>
              <Button onClick={handleUpdateFlower}>수정</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default AdminFlowerManagePage;
