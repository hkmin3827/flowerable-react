import React, { useState, useRef } from "react";
import { colors } from "@/shared/ui/CommonStyles";
import { Upload, X } from "lucide-react";
import { uploadImageToS3 } from "@/shared/utils/s3Upload";
import { extractErrorMessage } from "../utils/errorHandler";
import {
  UploadContainer,
  PreviewContainer,
  PreviewImage,
  RemoveButton,
  UploadButton,
  UploadingText,
} from "./ImageUpload.styles";

interface ImageUploadProps {
  currentImageUrl?: string;
  folder: string;
  onUploadSuccess: (imageUrl: string) => void;
  accept?: string;
}

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
      alert(extractErrorMessage(error));
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
