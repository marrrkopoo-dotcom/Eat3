import React, { useState, useEffect, useRef } from 'react';

export const SmartImage = ({ src, fallbackSrc, alt, className, style, onFinalError, onLoad }) => {
    const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
    const [isLoaded, setIsLoaded] = useState(false);
    const [failedLocal, setFailedLocal] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        setCurrentSrc(src || fallbackSrc);
        setIsLoaded(false);
        setFailedLocal(false);
    }, [src, fallbackSrc]);

    // Handle cached images immediately
    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setIsLoaded(true);
            if (typeof onLoad === 'function') onLoad();
        }
    }, [currentSrc, onLoad]);

    const handleError = () => {
        if (!failedLocal && src && fallbackSrc) {
            setFailedLocal(true);
            setCurrentSrc(fallbackSrc);
        } else if (typeof onFinalError === 'function') {
            onFinalError();
        }
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img 
                ref={imgRef}
                src={currentSrc} 
                alt={alt} 
                className={`${className || ''} ${!isLoaded ? 'blur-md scale-110 opacity-50' : 'blur-0 scale-100 opacity-100'} transition-all duration-700 ease-in-out w-full h-full object-contain`} 
                style={style} 
                onLoad={() => {
                    setIsLoaded(true);
                    if (typeof onLoad === 'function') onLoad();
                }}
                onError={handleError} 
            />
        </div>
    );
};
