import React, { useState } from 'react';
import type { ImageFile, Settings } from '../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { Spinner } from './Spinner';
import { DownloadIcon, XIcon } from './icons';
import { processOutput } from '../services/geminiService';
import { cn } from '../lib/utils';


const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const ImageCard: React.FC<{ imageFile: ImageFile; onDelete: (id: string) => void; settings: Settings; }> = ({ imageFile, onDelete, settings }) => {
  const { id, status, originalSrc, upscaledSrc, name, error, dimensions, size } = imageFile;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!imageFile.upscaledBlob) return;
    setIsDownloading(true);
    try {
        const { blob, extension } = await processOutput(imageFile.upscaledBlob, settings, dimensions);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const originalName = name.split('.').slice(0, -1).join('.') || name;
        link.download = `${originalName}_${settings.scale}x_${settings.dpi}dpi.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (e) {
        console.error("Download failed", e);
    } finally {
        setIsDownloading(false);
    }
  };
  
  const StatusIndicator = () => {
      switch (status) {
          case 'processing':
            return (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                    <Spinner />
                    <p className="text-white text-sm mt-2 font-medium">Upscaling...</p>
                </div>
            );
          case 'queued':
              return (
                <div className="absolute top-2 left-2 bg-blue-500/90 text-white text-xs font-bold px-2 py-1 rounded-full z-20 shadow-lg">
                    Queued
                </div>
              );
          case 'error':
              return (
                 <div className="absolute inset-0 bg-red-800/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-20">
                    <p className="text-white text-sm font-semibold text-center max-w-full break-words">{error}</p>
                 </div>
              );
          default:
              return null;
      }
  }

  return (
    <div className="glass-card border border-border/60 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:border-border">
      <div className={cn("relative aspect-video bg-secondary overflow-hidden", status === 'processing' && 'shimmer-bg')}>
        <StatusIndicator/>
        {status === 'done' && upscaledSrc ? (
          <BeforeAfterSlider beforeSrc={originalSrc} afterSrc={upscaledSrc} />
        ) : (
          <img src={originalSrc} alt={name} className="w-full h-full object-contain" />
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-foreground" title={name}>{name}</p>
                <p className="text-xs text-muted-foreground">
                    {dimensions.width}x{dimensions.height} &middot; {formatBytes(size)}
                </p>
            </div>
            {status === 'done' && (
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="p-2 ml-2 rounded-full text-muted-foreground hover:bg-accent hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50 disabled:cursor-wait"
                aria-label="Download upscaled image"
              >
                {isDownloading ? <Spinner className="w-5 h-5" /> : <DownloadIcon className="w-5 h-5" />}
              </button>
            )}
        </div>
      </div>
      <button 
        onClick={() => onDelete(id)}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white/70 hover:bg-black/60 hover:text-white z-30 transition-colors"
        aria-label="Delete image"
        >
            <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};