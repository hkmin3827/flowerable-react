import { axiosInstance } from "@/shared/api/axios";

export interface PresignedUploadRes {
  presignedUrl: string;
  fileUrl: string;
}

export const s3API = {
  getUploadUrl: (
    folder: string,
    originalFileName: string,
    contentType: string = "image/jpeg",
  ) =>
    axiosInstance.get<PresignedUploadRes>("/s3/upload-url", {
      params: { folder, originalFileName, contentType },
    }),
};

export const uploadImageToS3 = async (
  file: File,
  folder: string,
): Promise<string> => {
  try {
    // 1. Presigned URL 받기
    const response = await s3API.getUploadUrl(folder, file.name, file.type);
    const { presignedUrl, fileUrl } = response.data;

    // 2. S3에 직접 업로드
    await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    // 3. 최종 파일 URL 반환
    return fileUrl;
  } catch (error) {
    console.error("Failed to upload image to S3:", error);
    throw new Error("이미지 업로드에 실패했습니다.");
  }
};
