import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageMetadata(file: File): Promise<{ dimensions: { width: number; height: number; }, size: number }> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    dimensions: { width: img.width, height: img.height },
                    size: file.size,
                });
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
}

export function resizeImage(file: File, maxDimension: number): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      if (width <= maxDimension && height <= maxDimension) {
        return resolve(file); // No resizing needed
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      let newWidth = width;
      let newHeight = height;

      if (width > height) {
        newWidth = maxDimension;
        newHeight = (height * maxDimension) / width;
      } else {
        newHeight = maxDimension;
        newWidth = (width * maxDimension) / height;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);

      canvas.toBlob((blob) => {
        if (blob) {
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(resizedFile);
        } else {
          resolve(file); // Fallback to original file on error
        }
      }, file.type);
    };
    img.src = URL.createObjectURL(file);
  });
}
