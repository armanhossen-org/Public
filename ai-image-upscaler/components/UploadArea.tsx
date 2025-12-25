import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';
import { cn } from '../lib/utils';

interface UploadAreaProps {
  onFilesAdded: (files: File[]) => void;
  disabled: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onFilesAdded, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    // FIX: Explicitly type Array.from to ensure `file` is typed as File.
    const files = Array.from<File>(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      onFilesAdded(files);
    }
  }, [onFilesAdded, disabled]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // FIX: Explicitly type Array.from to ensure `file` is typed as File.
      const files = Array.from<File>(e.target.files).filter(file => file.type.startsWith('image/'));
      if (files.length > 0) {
        onFilesAdded(files);
      }
      e.target.value = ''; // Reset input to allow re-uploading the same file
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        'relative group p-8 border-2 border-dashed rounded-lg transition-all duration-300 text-center cursor-pointer shadow-lg',
        'border-border/60 hover:border-primary/80 hover:bg-card/80',
        isDragging && 'border-primary bg-primary/10',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={disabled}
      />
      <div className="flex flex-col items-center justify-center gap-4">
        <UploadIcon className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
        <p className="text-muted-foreground">
          <span className="font-semibold text-primary">Click to upload</span> or drag and drop
        </p>
        <p className="text-sm text-muted-foreground">Supports PNG, JPG, WEBP, etc. (Batch upload 100+ images)</p>
      </div>
    </div>
  );
};