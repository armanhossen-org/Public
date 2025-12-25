
import React from 'react';
import FloatingHearts from './FloatingHearts';
import FadeInSection from './FadeInSection';

const LoveLetter: React.FC = () => {
    return (
        <section className="min-h-screen py-20 px-4 flex items-center justify-center relative">
            <FloatingHearts />
            <FadeInSection className="max-w-3xl mx-auto text-center bg-white/50 backdrop-blur-md p-8 rounded-2xl shadow-xl z-10">
                <h2 className="text-4xl md:text-5xl font-heading text-custom-dark-rose mb-6">আমার প্রিয় মাওয়া,</h2>
                <p className="text-lg md:text-xl text-justify text-custom-dark leading-relaxed font-body">
                    যখনই তোমার কথা ভাবি, আমার পৃথিবীটা আরও সুন্দর হয়ে যায়। তোমার হাসি আমার দিনের আলো, আর তোমার কণ্ঠ আমার প্রিয় সুর। তোমার সাথে কাটানো প্রতিটি মুহূর্ত আমার কাছে এক একটি মূল্যবান স্মৃতি। আমি জানি না কীভাবে, কিন্তু তুমি আমার জীবনের সেই অংশ হয়ে গেছো যাকে ছাড়া আমি নিজেকে কল্পনাও করতে পারি না। যখন তুমি পাশে থাকো না, প্রতিটি সেকেন্ড মনে হয় অনন্তকাল। তোমাকে অনেক বেশি ভালোবাসি, আর প্রতিটি দিন এই ভালোবাসা আরও গভীর হয়। তুমি আমার জীবনের সবচেয়ে বড় সুখ।
                </p>
            </FadeInSection>
        </section>
    );
};

export default LoveLetter;
