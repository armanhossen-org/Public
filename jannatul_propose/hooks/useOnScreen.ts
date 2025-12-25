
import { useState, useEffect, RefObject, useMemo } from 'react';

export const useOnScreen = (ref: RefObject<HTMLElement>, rootMargin: string = '0px'): boolean => {
    const [isIntersecting, setIntersecting] = useState(false);

    const observer = useMemo(() => {
        if (typeof window !== 'undefined' && window.IntersectionObserver) {
            return new IntersectionObserver(
                ([entry]) => {
                    setIntersecting(entry.isIntersecting);
                },
                {
                    rootMargin,
                }
            );
        }
        return null;
    }, [rootMargin]);


    useEffect(() => {
        const currentRef = ref.current;
        if (observer && currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (observer && currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, observer]);

    return isIntersecting;
};
