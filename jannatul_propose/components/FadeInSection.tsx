
import React, { useRef, ReactNode } from 'react';
import { useOnScreen } from '../hooks/useOnScreen';

interface FadeInSectionProps {
    children: ReactNode;
    className?: string;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({ children, className = '' }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref, "-100px");

    return (
        <div
            ref={ref}
            className={`transition-opacity duration-1000 ease-in transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            } ${className}`}
        >
            {children}
        </div>
    );
};

export default FadeInSection;
