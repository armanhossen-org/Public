
import React, { useMemo } from 'react';

const FloatingHearts: React.FC = () => {
    const hearts = useMemo(() => {
        return Array.from({ length: 20 }).map((_, i) => {
            const style = {
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 8}s`,
                animationDelay: `${Math.random() * 5}s`,
                transform: `scale(${Math.random() * 0.5 + 0.5})`,
            };
            return <div key={i} className="absolute bottom-0 text-red-300 text-2xl animate-float-up" style={style}>💕</div>;
        });
    }, []);

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            {hearts}
        </div>
    );
};

export default FloatingHearts;
