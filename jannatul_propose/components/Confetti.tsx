
import React, { useEffect, useState, useMemo } from 'react';

interface ConfettiPiece {
    id: number;
    style: React.CSSProperties;
}

const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#ffcad4', '#f4acb7', '#fff', '#ffd700'];

const Confetti: React.FC = () => {
    const pieces = useMemo(() => {
        return Array.from({ length: 200 }).map((_, i) => {
             const style: React.CSSProperties = {
                position: 'absolute',
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 6 + 4}px`,
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                top: `${-20}px`,
                left: `${Math.random() * 100}%`,
                opacity: 1,
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `fall ${Math.random() * 2 + 3}s linear ${Math.random() * 2}s forwards`,
            };
            return { id: i, style };
        });
    }, []);

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-50">
            {pieces.map(piece => <div key={piece.id} style={piece.style} />)}
        </div>
    );
};

export default Confetti;
