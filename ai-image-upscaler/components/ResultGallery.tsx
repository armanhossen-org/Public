import React from 'react';
import type { ImageFile, Settings } from '../types';
import { ImageCard } from './ImageCard';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultGalleryProps {
  images: ImageFile[];
  onDelete: (id: string) => void;
  settings: Settings;
}

export const ResultGallery: React.FC<ResultGalleryProps> = ({ images, onDelete, settings }) => {
  if (images.length === 0) {
    return (
      <div className="text-center py-24 border-2 border-dashed border-border/40 rounded-lg">
        <h3 className="text-lg font-medium text-foreground">Your upscaled images will appear here</h3>
        <p className="text-muted-foreground mt-2">Upload some images to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <AnimatePresence>
        {images.map(file => (
            <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
            >
                <ImageCard imageFile={file} onDelete={onDelete} settings={settings} />
            </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};