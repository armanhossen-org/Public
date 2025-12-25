
import React from 'react';
import FadeInSection from './FadeInSection';

const SpecialQuestion: React.FC = () => {
    return (
        <section className="h-[50vh] flex items-center justify-center text-center p-4">
            <FadeInSection>
                <h2 className="text-3xl md:text-5xl font-heading text-custom-dark animate-glow">
                    মাওয়া, একটা খুব বিশেষ প্রশ্ন আছে…
                </h2>
            </FadeInSection>
        </section>
    );
};

export default SpecialQuestion;
