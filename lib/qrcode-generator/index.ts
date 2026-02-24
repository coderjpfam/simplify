import QRCode from "qrcode";
import jsQR from "jsqr";

export type ErrorLevel = "L" | "M" | "Q" | "H";

export const ERROR_LEVELS: Record<ErrorLevel, { label: string; resistance: string }> = {
  L: { label: "Low", resistance: "~7%" },
  M: { label: "Medium", resistance: "~15%" },
  Q: { label: "Quartile", resistance: "~25%" },
  H: { label: "High", resistance: "~30%" },
};

export interface GenerateOptions {
  text: string;
  size?: number;
  errorCorrectionLevel?: ErrorLevel;
  fgColor?: string;
  bgColor?: string;
  margin?: number;
}

export async function generateQRCode(options: GenerateOptions): Promise<string> {
  const {
    text,
    size = 256,
    errorCorrectionLevel = "M",
    fgColor = "#000000",
    bgColor = "#ffffff",
    margin = 4,
  } = options;

  const dataUrl = await QRCode.toDataURL(text, {
    errorCorrectionLevel,
    width: size,
    margin,
    color: {
      dark: fgColor,
      light: bgColor,
    },
  });

  return dataUrl;
}

/**
 * Decode QR code from image file.
 * Returns the decoded string or null if no QR code found.
 */
export async function decodeQRCode(file: File): Promise<string | null> {
  const imageData = await fileToImageData(file);
  if (!imageData) return null;

  const result = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "attemptBoth",
  });

  return result?.data ?? null;
}

async function fileToImageData(
  file: File
): Promise<{ data: Uint8ClampedArray; width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve({
        data: imageData.data,
        width: imageData.width,
        height: imageData.height,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };

    img.src = url;
  });
}
