
import React from 'react';
import FadeInSection from './FadeInSection';

const images = [
    'https://picsum.photos/400/600?random=1',
    'https://picsum.photos/400/600?random=2',
    'https://picsum.photos/400/600?random=3',
    'https://picsum.photos/400/600?random=4',
    'https://picsum.photos/400/600?random=5',
    'https://picsum.photos/400/600?random=6',
];

const Memories: React.FC = () => {
    return (
        <section className="py-20 px-4 bg-white/30">
            <div className="max-w-5xl mx-auto">
                <FadeInSection>
                    <h2 className="text-4xl md:text-5xl font-heading text-custom-dark-rose text-center mb-12">আমাদের প্রিয় স্মৃতিগুলো 💖</h2>
                </FadeInSection>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((src, index) => (
                        <FadeInSection key={index}>
                            <div className="overflow-hidden rounded-lg shadow-lg aspect-w-2 aspect-h-3">
                                <img 
                                    src={src} 
                                    alt={`Memory ${index + 1}`} 
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </FadeInSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Memories;
