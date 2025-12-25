import { GoogleGenAI, Modality } from '@google/genai';
import type { ImageFile, Settings } from '../types';
import { resizeImage } from '../lib/utils';
import JSZip from "jszip";
import { jsPDF } from "jspdf";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to convert blob to base64 string.'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const upscaleImage = async (
  imageFile: File,
  settings: Settings,
): Promise<Blob> => {
  const resizedFile = await resizeImage(imageFile, 2048);
  const base64Data = await blobToBase64(resizedFile);

  const imagePart = { inlineData: { data: base64Data, mimeType: resizedFile.type } };

  const { scale, dpi, enhancements } = settings;
  let prompt = `Upscale this image to ${scale}x its original size. The final image should be optimized for ${dpi} DPI.`;
  if (enhancements.sharpness) prompt += " Apply a sharpening filter to enhance details and edges.";
  if (enhancements.noiseReduction) prompt += " Apply noise reduction to clean up grain and artifacts.";
  if (enhancements.faceRestore) prompt += " Restore and enhance any faces in the image with high fidelity.";
  if (enhancements.textureBoost) prompt += " Boost the micro-textures to add more clarity and realism.";
  prompt += " Maintain the original aspect ratio and content faithfully.";
  
  const textPart = { text: prompt };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, textPart] },
      config: { responseModalities: [Modality.IMAGE] },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        const byteCharacters = atob(base64ImageBytes);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
      }
    }
    throw new Error('No upscaled image was returned from the API.');
  } catch (err) {
    console.error('Gemini API error:', err);
    throw new Error('⚠️ Upscale failed, please try again or use a smaller image.');
  }
};

export const processOutput = async (blob: Blob, settings: Settings, dimensions: {width: number, height: number}): Promise<{blob: Blob, extension: string}> => {
    const { outputFormat, jpegQuality, dpi, scale } = settings;
    const extension = outputFormat.toLowerCase();

    if (outputFormat === 'JPEG') {
        const image = new Image();
        const imageUrl = URL.createObjectURL(blob);
        
        return new Promise((resolve, reject) => {
            image.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Could not get canvas context'));
                ctx.drawImage(image, 0, 0);
                canvas.toBlob((jpegBlob) => {
                    URL.revokeObjectURL(imageUrl);
                    if (jpegBlob) {
                        resolve({ blob: jpegBlob, extension });
                    } else {
                        reject(new Error('Failed to convert to JPEG'));
                    }
                }, 'image/jpeg', jpegQuality);
            };
            image.src = imageUrl;
        });

    } else if (outputFormat === 'PDF') {
        const doc = new jsPDF({ orientation: dimensions.width > dimensions.height ? 'l' : 'p', unit: 'pt' });
        const dataUrl = await blobToDataURL(blob);
        const upscaledWidth = dimensions.width * scale;
        const upscaledHeight = dimensions.height * scale;
        
        const widthInPoints = (upscaledWidth / dpi) * 72;
        const heightInPoints = (upscaledHeight / dpi) * 72;
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        if (widthInPoints > pageWidth || heightInPoints > pageHeight) {
            const widthRatio = pageWidth / widthInPoints;
            const heightRatio = pageHeight / heightInPoints;
            const ratio = Math.min(widthRatio, heightRatio);
            const newWidth = widthInPoints * ratio;
            const newHeight = heightInPoints * ratio;
            doc.addImage(dataUrl, 'PNG', (pageWidth - newWidth) / 2, (pageHeight - newHeight) / 2, newWidth, newHeight);
        } else {
            doc.addImage(dataUrl, 'PNG', (pageWidth - widthInPoints)/2, (pageHeight - heightInPoints)/2, widthInPoints, heightInPoints);
        }
        
        const pdfBlob = doc.output('blob');
        return { blob: pdfBlob, extension };
    }
    
    return { blob, extension: 'png' };
};

// --- Download Logic ---

function saveAs(blob: Blob, filename: string) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

export const downloadAllAsZip = async (images: ImageFile[], settings: Settings) => {
  const zip = new JSZip();
  const completedFiles = images.filter(f => f.status === 'done' && f.upscaledBlob);

  for (const [index, file] of completedFiles.entries()) {
    if (file.upscaledBlob) {
        const { blob: processedBlob, extension } = await processOutput(file.upscaledBlob, settings, file.dimensions);
        const originalName = file.name.split('.').slice(0, -1).join('.') || file.name;
        const filename = `${originalName}_${settings.scale}x_${settings.dpi}dpi_${index + 1}.${extension}`;
        zip.file(filename, processedBlob);
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `topazx_upscaled_batch_${Date.now()}.zip`);
};