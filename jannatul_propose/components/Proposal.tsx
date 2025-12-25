
import React from 'react';

interface ProposalProps {
    isAccepted: boolean;
    onAccept: () => void;
}

const Proposal: React.FC<ProposalProps> = ({ isAccepted, onAccept }) => {
    return (
        <section className="min-h-screen flex flex-col items-center justify-center text-center p-4">
            {!isAccepted ? (
                <div className="transition-opacity duration-1000 ease-in">
                    <h2 className="text-4xl md:text-7xl font-heading text-custom-dark-rose animate-glow leading-tight">
                        তুমি কি আমার হবে চিরদিনের জন্য?
                    </h2>
                    <button
                        onClick={onAccept}
                        className="mt-12 px-10 py-4 bg-gradient-to-r from-red-400 to-custom-dark-rose text-white text-2xl font-bold rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse-heart"
                    >
                        হ্যাঁ 💕
                    </button>
                </div>
            ) : (
                <div className="transition-opacity duration-1000 ease-in opacity-100">
                    <h2 className="text-5xl md:text-8xl font-heading text-red-500 animate-glow">
                        I Love You, Jannatul Maowa ❤️
                    </h2>
                    <p className="mt-4 text-2xl text-custom-dark">চিরদিনের জন্য, একসাথে।</p>
                </div>
            )}
        </section>
    );
};

export default Proposal;
