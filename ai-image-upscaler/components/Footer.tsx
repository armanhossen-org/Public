import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-8 mt-auto border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
        <p>
          Powered by{' '}
          <a
            href="https://ai.google.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground/90 hover:text-primary transition-colors"
          >
            Google Gemini
          </a>
          .
        </p>
        <p className="mt-2">
          Designed & Built by a World-Class Frontend Engineer.
        </p>
      </div>
    </footer>
  );
};
