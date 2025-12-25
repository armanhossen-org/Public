import React from 'react';
import type { Progress } from '../types';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: Progress;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const { total, completed, currentFile } = progress;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // FIX: Rewrote JSX using React.createElement to be valid in a .ts file.
  return React.createElement(
    'div',
    { className: 'w-full bg-card border border-border/60 rounded-lg p-4 shadow-md dark:shadow-black/20' },
    React.createElement(
      'div',
      { className: 'flex justify-between items-center mb-2 text-sm' },
      React.createElement(
        'p',
        { className: 'text-muted-foreground' },
        'Processing: ',
        React.createElement(
          'span',
          { className: 'font-medium text-foreground truncate max-w-xs inline-block align-bottom' },
          currentFile
        )
      ),
      React.createElement(
        'p',
        { className: 'font-semibold text-foreground' },
        `${completed} / ${total}`
      )
    ),
    React.createElement(
      'div',
      { className: 'w-full bg-secondary rounded-full h-2.5' },
      React.createElement(motion.div, {
        className: 'bg-gradient-to-r from-purple-600 to-blue-500 h-2.5 rounded-full',
        initial: { width: 0 },
        animate: { width: `${percentage}%` },
        transition: { duration: 0.5, ease: 'easeInOut' },
      })
    )
  );
};
