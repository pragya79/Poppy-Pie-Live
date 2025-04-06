'use client'
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

const Preloader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [blink, setBlink] = useState(false);

    // Blinking animation
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setBlink(prev => !prev);
        }, 2000);

        return () => clearInterval(blinkInterval);
    }, []);

    // Loading progress
    useEffect(() => {
        // Start with higher progress to show faster initial loading
        setProgress(30);

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    // Shorter delay for completion
                    setTimeout(onComplete, 200);
                    return 100;
                }
                // Faster progress increments
                return prev + 2;
            });
        }, 20);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div style={styles.container}>
            <div style={styles.dogContainer}>
                <div className='object-cover'>
                    <Image
                        src="/logo.png"
                        alt="Poppy Pie Logo"
                        width={64}
                        height={64}
                        priority={true}
                        className="object-contain"
                    />
                </div>
                <svg
                    width="200"
                    height="200"
                    viewBox="0 0 760 760"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                    <rect
                        x="0.67749"
                        y="9.37289"
                        width="750"
                        height="750"
                        transform="rotate(-0.664295 0.67749 9.37289)"
                        fill="url(#pattern0_1_6)"
                    />
                    {/* Add blinking eyes overlay */}
                    <g style={{ opacity: blink ? 0 : 1, transition: 'opacity 0.2s' }}>
                        <rect x="280" y="220" width="40" height="60" fill="white" rx="20" />
                        <rect x="440" y="220" width="40" height="60" fill="white" rx="20" />
                    </g>
                    <defs>
                        <pattern
                            id="pattern0_1_6"
                            patternContentUnits="objectBoundingBox"
                            width="1"
                            height="1"
                        >
                            <use xlinkHref="#image0_1_6" transform="scale(0.002)" />
                        </pattern>
                    </defs>
                </svg>
                <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${progress}%` }} />
                </div>
                <p style={styles.percentage}>{progress}%</p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        zIndex: 9999,
        transition: 'opacity 0.5s',
    },
    dogContainer: {
        position: 'relative',
        textAlign: 'center',
    },
    progressBar: {
        width: '200px',
        height: '4px',
        backgroundColor: '#eee',
        borderRadius: '2px',
        margin: '20px auto',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#ff6b6b',
        transition: 'width 0.3s ease',
    },
    percentage: {
        fontSize: '1.5em',
        color: '#333',
        fontWeight: 'bold',
        marginTop: '10px',
    },
};

export default Preloader;