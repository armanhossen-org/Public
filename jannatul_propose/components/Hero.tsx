
import React from 'react';

interface HeroProps {
    onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
    return (
        <section className="h-screen flex flex-col items-center justify-center text-center p-4 relative">
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
             <div className="z-10">
                <h1 className="text-5xl md:text-8xl font-heading text-custom-dark animate-glow">জান্নাতুল মাওয়া, তোমার জন্য…</h1>
                <p className="mt-6 text-xl md:text-2xl text-custom-dark-rose font-body">ভালোবাসাসহ, আরমান 💕</p>
                <button 
                    onClick={onStart}
                    className="mt-12 px-8 py-3 bg-custom-dark-rose text-white font-bold rounded-full shadow-lg hover:bg-custom-dark-rose/80 transition-all duration-300 transform hover:scale-105"
                >
                    চল শুরু করি
                </button>
            </div>
        </section>
    );
};

export default Hero;
