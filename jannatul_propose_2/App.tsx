import React, { useState } from 'react';

// TypeScript declaration for the EmailJS global object
declare global {
  interface Window {
    emailjs: {
      send: (
        serviceID: string,
        templateID: string,
        templateParams: Record<string, unknown>,
        publicKey: string
      ) => Promise<{ status: number; text: string }>;
    };
  }
}

type ResponseState = 'initial' | 'no_clicked' | 'sending' | 'sent' | 'error';

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const ProposalContent: React.FC<{ onYes: () => void; onNo: () => void }> = ({ onYes, onNo }) => (
  <div className="text-center animate-fade-in">
    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
      হাই Jannatul Maowa 💖,
    </h1>
    <p className="text-xl md:text-2xl text-gray-700 mb-8">
      তোমার জন্য আমার কিছু কথা আছে...
    </p>

    <div className="text-lg text-gray-600 space-y-4 max-w-2xl mx-auto mb-10 text-left md:text-center">
      <p>
        প্রথম যেদিন তোমায় দেখেছিলাম, সেদিনই আমার পৃথিবীটা যেন বদলে গিয়েছিল। তোমার ঐ হাসি, তোমার চোখের গভীরতা, সবকিছুতেই আমি নিজেকে হারিয়ে ফেলেছিলাম।
      </p>
      <p>
        তোমার সাথে কাটানো প্রতিটি মুহূর্ত আমার কাছে এক একটি স্বপ্নের মতো। তোমার পাশে থাকলে মনে হয়, জীবনের সবটুকু সুখ যেন আমার। তুমি আমার শক্তি, আমার প্রেরণা।
      </p>
      <p>
        আমি জানি না ভবিষ্যতে কী লেখা আছে, কিন্তু আমি এটা জানি যে আমার বাকিটা জীবন আমি তোমার সাথেই কাটাতে চাই। তোমার হাত ধরে বাকি পথটা চলতে চাই।
      </p>
    </div>

    <div className="my-12">
        <h2 className="text-5xl md:text-7xl font-bold text-love animate-pulse-heart flex items-center justify-center gap-4">
            I Love You <span className="text-5xl">💞</span>
        </h2>
    </div>


    <div className="flex justify-center items-center gap-4 md:gap-8">
      <button
        onClick={onYes}
        className="bg-love text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-300 flex items-center gap-2"
      >
        Yes <HeartIcon className="w-6 h-6" />
      </button>
      <button
        onClick={onNo}
        className="bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-400"
      >
        No 😢
      </button>
    </div>
  </div>
);

const AnimatedMessage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex flex-col items-center justify-center text-center animate-fade-in p-8">
        {children}
    </div>
);

const FallingHearts: React.FC = () => {
  const heartCount = 20;
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" aria-hidden="true">
      {Array.from({ length: heartCount }).map((_, i) => {
        const style: React.CSSProperties = {
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 3 + 4}s`, // 4s to 7s
          animationDelay: `${Math.random() * 5}s`,
          fontSize: `${Math.random() * 0.75 + 0.5}rem`, // Vary size
        };
        return (
          <span key={i} className="absolute text-love animate-fall" style={style}>
            💖
          </span>
        );
      })}
    </div>
  );
};

const App: React.FC = () => {
  const [responseState, setResponseState] = useState<ResponseState>('initial');

  const handleYesClick = async () => {
    setResponseState('sending');

    const serviceID = "YOUR_SERVICE_ID";
    const templateID = "YOUR_TEMPLATE_ID";
    const publicKey = "YOUR_PUBLIC_KEY";

    const templateParams = {
      to_name: 'Arman',
      from_name: 'Jannatul Maowa',
      message: 'Jannatul Maowa just said YES! 💍 From Arman ❤️'
    };

    try {
      await window.emailjs.send(serviceID, templateID, templateParams, publicKey);
      setResponseState('sent');
    } catch (error) {
      console.error('Failed to send email:', error);
      setResponseState('error');
    }
  };

  const handleNoClick = () => {
    setResponseState('no_clicked');
  };
  
  const resetState = () => {
      setResponseState('initial');
  }

  const renderContent = () => {
    // A shared component for all "Yes" responses
    const YesResponseScreen = ({ children }: { children: React.ReactNode }) => (
      <AnimatedMessage>
        <h2 className="text-5xl md:text-7xl font-bold text-love animate-pulse-heart flex items-center justify-center gap-4">
            I Love You <span className="text-5xl">💞</span>
        </h2>
        <div className="mt-6 min-h-[60px] flex flex-col items-center justify-center text-lg text-gray-600">
            {children}
        </div>
      </AnimatedMessage>
    );

    switch (responseState) {
      case 'sending':
        return (
            <YesResponseScreen>
                <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-gray-500"></div>
                    <span>তোমার উত্তর পাঠানো হচ্ছে...</span>
                </div>
            </YesResponseScreen>
        );
      case 'sent':
        return (
            <YesResponseScreen>
                <p className="text-green-600 font-semibold">মেইল সফলভাবে পাঠানো হয়েছে!</p>
            </YesResponseScreen>
        );
      case 'no_clicked':
        return (
            <AnimatedMessage>
                <p className="text-5xl mb-4">😢</p>
                <h2 className="text-3xl font-bold text-gray-700">Maybe next time...</h2>
                <button onClick={resetState} className="mt-6 bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-full hover:bg-gray-300 transition-colors">ফিরে যাও</button>
            </AnimatedMessage>
        );
      case 'error':
        return (
            <YesResponseScreen>
                <p className="text-red-600 font-semibold">মেইল পাঠানো যায়নি।</p>
                <button onClick={handleYesClick} className="mt-4 bg-love text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 transition-colors">
                    আবার চেষ্টা করুন
                </button>
            </YesResponseScreen>
        );
      case 'initial':
      default:
        return <ProposalContent onYes={handleYesClick} onNo={handleNoClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-rosewater flex items-center justify-center p-4 font-bengali">
      <div className="relative w-full max-w-4xl bg-light-pink rounded-2xl shadow-2xl p-6 md:p-12 overflow-hidden">
        {(responseState === 'sending' || responseState === 'sent' || responseState === 'error') && <FallingHearts />}
        <div className="relative z-10">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default App;
