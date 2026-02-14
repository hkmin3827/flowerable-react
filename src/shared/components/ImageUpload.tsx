import React, { useState, useRef } from "react";
import styled from "styled-components";
import { colors } from "@/shared/ui/CommonStyles";
import { Upload, X } from "lucide-react";
import { uploadImageToS3 } from "@/shared/utils/s3Upload";

interface ImageUploadProps {
  currentImageUrl?: string;
  folder: string;
  onUploadSuccess: (imageUrl: string) => void;
  accept?: string;
}

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PreviewContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border: 2px dashed ${colors.border};
  border-radius: 0.5rem;
  overflow: hidden;
  background: ${colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.5rem;
  background: ${colors.error};
  color: ${colors.white};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #dc2626;
  }
`;

const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${colors.primary};
  color: ${colors.white};
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: ${colors.primaryHover};
  }

  input {
    display: none;
  }
`;

const UploadingText = styled.p`
  color: ${colors.textSecondary};
  font-size: 0.875rem;
`;

export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  folder,
  onUploadSuccess,
  accept = "image/*",
}) => {
  const [preview, setPreview] = useState<string | undefined>(currentImageUrl);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 이미지 미리보기
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // S3 업로드
    setUploading(true);
    try {
      const fileUrl = await uploadImageToS3(file, folder);
      onUploadSuccess(fileUrl);
      alert("이미지 업로드 완료!");
    } catch (error) {
      alert("이미지 업로드에 실패했습니다.");
      setPreview(currentImageUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    onUploadSuccess("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <UploadContainer>
      <PreviewContainer>
        {preview ? (
          <>
            <PreviewImage src={preview} alt="Preview" />
            <RemoveButton onClick={handleRemove} type="button">
              <X size={16} />
            </RemoveButton>
          </>
        ) : (
          <Upload size={40} color={colors.textSecondary} />
        )}
      </PreviewContainer>

      <UploadButton>
        <Upload size={20} />
        {uploading ? "업로드 중..." : "이미지 선택"}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
        />
      </UploadButton>

      {uploading && <UploadingText>이미지를 업로드하는 중...</UploadingText>}
    </UploadContainer>
  );
};
