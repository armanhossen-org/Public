
import React, { useState, useRef, useEffect } from 'react';
import Hero from './components/Hero';
import LoveLetter from './components/LoveLetter';
import Memories from './components/Memories';
import SpecialQuestion from './components/SpecialQuestion';
import Proposal from './components/Proposal';
import Confetti from './components/Confetti';
import { useOnScreen } from './hooks/useOnScreen';

const App: React.FC = () => {
    const [isAccepted, setIsAccepted] = useState(false);
    const [playMusic, setPlayMusic] = useState(false);

    const loveLetterRef = useRef<HTMLDivElement>(null);
    const memoriesRef = useRef<HTMLDivElement>(null);
    const specialQuestionRef = useRef<HTMLDivElement>(null);
    const proposalRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const isSpecialQuestionVisible = useOnScreen(specialQuestionRef, '-50%');
    const isProposalVisible = useOnScreen(proposalRef, '-50%');

    useEffect(() => {
        if ((isSpecialQuestionVisible || isProposalVisible) && !isAccepted) {
            setPlayMusic(true);
        } else if (isAccepted) {
            setPlayMusic(true); // Keep music playing after acceptance
        } else {
            setPlayMusic(false);
        }
    }, [isSpecialQuestionVisible, isProposalVisible, isAccepted]);

    useEffect(() => {
        if (audioRef.current) {
            if (playMusic) {
                audioRef.current.volume = 0.3;
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [playMusic]);
    
    useEffect(() => {
        if (isAccepted && audioRef.current) {
             audioRef.current.volume = 0.5;
             audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
    }, [isAccepted]);

    const handleStart = () => {
        loveLetterRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleAccept = () => {
        setIsAccepted(true);
    };

    return (
        <div className="bg-gradient-to-b from-custom-pink via-custom-rose to-white min-h-screen text-custom-dark font-body relative overflow-x-hidden">
            {isAccepted && <Confetti />}
            <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" loop>
                Your browser does not support the audio element.
            </audio>

            <Hero onStart={handleStart} />

            <div ref={loveLetterRef}>
                <LoveLetter />
            </div>
            <div ref={memoriesRef}>
                <Memories />
            </div>
            <div ref={specialQuestionRef}>
                <SpecialQuestion />
            </div>
            <div ref={proposalRef}>
                <Proposal isAccepted={isAccepted} onAccept={handleAccept} />
            </div>
            
            <footer className="text-center p-8 text-custom-dark/70">
                <p>Made with endless love for Jannatul Maowa</p>
                <p>From your Arman ❤️</p>
            </footer>
        </div>
    );
};

export default App;
