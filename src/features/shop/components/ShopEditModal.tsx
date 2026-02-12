import { useState, useEffect } from "react";
import styled from "styled-components";
import { ShopDetailResponse, ShopUpdateRequest } from "@/features/shop/types";
import { flowerApi } from "@/features/search/api";
import { Region, District } from "@/features/search/types";

interface ShopEditModalProps {
  shop: ShopDetailResponse;
  onClose: () => void;
  onSave: (data: ShopUpdateRequest) => Promise<void>;
}

export const ShopEditModal = ({
  shop,
  onClose,
  onSave,
}: ShopEditModalProps) => {
  const [formData, setFormData] = useState<ShopUpdateRequest>({
    shopName: shop.shopName,
    description: shop.description,
    telnum: shop.telnum,
    address: shop.address,
    regionCode: shop.region,
    districtCode: shop.district,
  });

  const [regions, setRegions] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      fetchDistricts(selectedRegion);
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (shop) {
      setFormData({
        shopName: shop.shopName,
        description: shop.description,
        telnum: shop.telnum,
        address: shop.address,
        regionCode: shop.region,
        districtCode: shop.district,
      });

      setSelectedRegion(shop.region);
    }
  }, [shop]);

  const fetchRegions = async () => {
    try {
      const response = await flowerApi.getRegions();
      setRegions(response);
    } catch (error) {
      console.error("지역 목록 조회 실패:", error);
    }
  };

  const fetchDistricts = async (region: string) => {
    try {
      const response = await flowerApi.getDistricts(region);
      setDistricts(response);
    } catch (error) {
      console.error("구/군 목록 조회 실패:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    setSelectedRegion(selectedCode);
    const selectedRegionData = regions.find((r) => r.code === selectedCode);
    if (selectedRegionData) {
      setFormData((prev) => ({
        ...prev,
        regionCode: selectedCode,
        regionDesc: selectedRegionData.description,
        districtDesc: "",
      }));
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;

    setFormData((prev) => ({
      ...prev,
      districtCode: selectedCode,
    }));
  };
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("샵 정보 수정 실패:", error);
      alert("샵 정보 수정에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>샵 정보 수정</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>샵 이름</Label>
            <Input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>설명</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </FormGroup>

          <FormGroup>
            <Label>전화번호</Label>
            <Input
              type="tel"
              name="telnum"
              value={formData.telnum}
              onChange={handleChange}
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label>시/도</Label>
              <Select onChange={handleRegionChange} value={selectedRegion}>
                <option value="">시/도 선택</option>
                {regions.map((region) => (
                  <option key={region.code} value={region.code}>
                    {region.description}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>구/군</Label>
              <Select
                onChange={handleDistrictChange}
                disabled={!selectedRegion}
                value={formData.districtCode}
              >
                <option value="">구/군 선택</option>
                {districts.map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.description}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </FormRow>
          <FormGroup>
            <Label>상세 주소</Label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </FormGroup>

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              취소
            </CancelButton>
            <SubmitButton type="submit" disabled={isSaving}>
              {isSaving ? "저장 중..." : "저장"}
            </SubmitButton>
          </ButtonGroup>
        </Form>
      </Modal>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #111827;
  }
`;

const Form = styled.form`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const CancelButton = styled.button`
  padding: 0.625rem 1.5rem;
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const SubmitButton = styled.button`
  padding: 0.625rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;
