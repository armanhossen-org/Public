import React, { useState, useEffect, useCallback, useMemo } from 'react';
import localforage from 'localforage';
import { Header } from './components/Header';
import { UploadArea } from './components/UploadArea';
import { SettingsPanel } from './components/Controls';
import { ResultGallery } from './components/ResultGallery';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import type { ImageFile, Settings, Progress, Toast } from './types';
import { upscaleImage, downloadAllAsZip } from './services/geminiService';
import { getImageMetadata } from './lib/utils';

const MAX_CONCURRENT_UPLOADS = 3;
const CACHE_KEY = 'topazx-images-v2';
const MAX_FILE_SIZE_MB = 15;

export default function App() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [settings, setSettings] = useState<Settings>({
    scale: 4,
    dpi: 300,
    enhancements: {
      sharpness: true,
      noiseReduction: false,
      faceRestore: true,
      textureBoost: false,
    },
    outputFormat: 'PNG',
    jpegQuality: 0.9,
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<Progress>({ total: 0, completed: 0, currentFile: '' });
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const loadFromCache = async () => {
      try {
        const cachedImages = await localforage.getItem<ImageFile[]>(CACHE_KEY);
        if (cachedImages) {
          for (const image of cachedImages) {
              if (image.originalBlob) image.originalSrc = URL.createObjectURL(image.originalBlob);
              if (image.upscaledBlob) image.upscaledSrc = URL.createObjectURL(image.upscaledBlob);
          }
          setImages(cachedImages);
        }
      } catch (error) {
        console.error("Failed to load images from cache:", error);
      }
    };
    loadFromCache();
  }, []);
  
  const addToast = (message: string, type: 'success' | 'error') => {
    setToasts(prev => [...prev, { id: Date.now(), message, type }]);
  };

  const updateAndCacheImages = (updater: (prevImages: ImageFile[]) => ImageFile[]) => {
    setImages(prevImages => {
      const newImages = updater(prevImages);
      localforage.setItem(CACHE_KEY, newImages).catch(error => {
        console.error("Failed to save images to cache:", error);
      });
      return newImages;
    });
  };

  const handleFilesAdded = async (files: File[]) => {
    const newImageFiles: ImageFile[] = [];
    for (const file of files) {
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            addToast(`File "${file.name}" is too large (max ${MAX_FILE_SIZE_MB}MB).`, 'error');
            continue;
        }
        const metadata = await getImageMetadata(file);
        newImageFiles.push({
          id: `${file.name}-${Date.now()}`,
          file,
          name: file.name,
          originalSrc: URL.createObjectURL(file),
          ...metadata,
          upscaledSrc: null,
          status: 'queued',
          error: null,
          originalBlob: file,
          upscaledBlob: null,
        });
    }
    updateAndCacheImages(prev => [...prev, ...newImageFiles]);
  };

  const processQueue = useCallback(async () => {
    setIsProcessing(true);
    const queue = images.filter(f => f.status === 'queued');
    setProgress({ total: queue.length, completed: 0, currentFile: '' });

    const processFile = async (image: ImageFile) => {
      setProgress(p => ({ ...p, currentFile: image.name }));
      updateAndCacheImages(prev => prev.map(f => f.id === image.id ? { ...f, status: 'processing' } : f));
      try {
        const upscaledBlob = await upscaleImage(image.file, settings);
        const upscaledSrc = URL.createObjectURL(upscaledBlob);
        updateAndCacheImages(prev => prev.map(f => f.id === image.id ? { ...f, status: 'done', upscaledSrc, upscaledBlob } : f));
        addToast(`Successfully upscaled "${image.name}"!`, 'success');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error(`Failed to upscale ${image.name}:`, err);
        updateAndCacheImages(prev => prev.map(f => f.id === image.id ? { ...f, status: 'error', error: "⚠️ Upscale failed, please try again or use a smaller image." } : f));
        addToast(`Failed to upscale "${image.name}".`, 'error');
      } finally {
        setProgress(p => ({ ...p, completed: p.completed + 1 }));
      }
    };
    
    for (let i = 0; i < queue.length; i += MAX_CONCURRENT_UPLOADS) {
      const chunk = queue.slice(i, i + MAX_CONCURRENT_UPLOADS);
      await Promise.all(chunk.map(processFile));
    }

    setIsProcessing(false);
    setProgress({ total: 0, completed: 0, currentFile: '' });
  }, [images, settings]);

  const handleClear = () => {
    updateAndCacheImages(() => []);
  };

  const handleDeleteImage = (id: string) => {
    updateAndCacheImages(prev => prev.filter(image => image.id !== id));
  };
  
  const handleDownloadAll = async () => {
    addToast('Preparing ZIP file...', 'success');
    await downloadAllAsZip(images.filter(img => img.status === 'done' && img.upscaledBlob), settings);
  };

  const queueCount = useMemo(() => images.filter(f => f.status === 'queued').length, [images]);
  const canUpscale = queueCount > 0 && !isProcessing;
  const canClear = images.length > 0 && !isProcessing;
  const canDownloadAll = images.some(f => f.status === 'done') && !isProcessing;

  return (
    <div className="min-h-screen font-sans bg-background text-foreground">
        <ToastContainer toasts={toasts} setToasts={setToasts} />
        <Header />
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
                <SettingsPanel
                    settings={settings}
                    setSettings={setSettings}
                    onUpscale={processQueue}
                    onClear={handleClear}
                    onDownloadAll={handleDownloadAll}
                    canUpscale={canUpscale}
                    canClear={canClear}
                    canDownloadAll={canDownloadAll}
                    isProcessing={isProcessing}
                    queueCount={queueCount}
                    progress={progress}
                />
                <main className="flex flex-col gap-8">
                    <UploadArea onFilesAdded={handleFilesAdded} disabled={isProcessing} />
                    <ResultGallery images={images} onDelete={handleDeleteImage} settings={settings}/>
                </main>
            </div>
        </div>
        <Footer />
    </div>
  );
}