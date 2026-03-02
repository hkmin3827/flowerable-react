import { useState, useEffect } from "react";
import { ShopDetailResponse, ShopUpdateRequest } from "@/features/shop/types";
import { flowerApi } from "@/features/search/api";
import { Region, District } from "@/features/search/types";
import { extractErrorMessage } from "@/shared/utils/errorHandler";
import {
  Overlay,
  Modal,
  ModalHeader,
  ModalTitle,
  CloseButton,
  Form,
  FormGroup,
  FormRow,
  Label,
  Input,
  Textarea,
  Select,
  ButtonGroup,
  CancelButton,
  SubmitButton,
} from "./ShopEditModal.styles";

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
      alert(extractErrorMessage(error));
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
