import { axiosInstance } from "@/shared/api/axios";

export interface PresignedUploadRes {
  uploadUrl: string;
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
    const response = await s3API.getUploadUrl(folder, file.name, file.type);
    const { uploadUrl, fileUrl } = response.data;

    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    return fileUrl;
  } catch (error) {
    console.error("Failed to upload image to S3:", error);
    throw new Error("S3 이미지 업로드에 실패했습니다.");
  }
};
