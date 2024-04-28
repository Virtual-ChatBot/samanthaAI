import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

// CSS
import '../styles/logBot.css';

function VirtualBot({ VTEXT, BOText, welcomeText }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const playerRef = useRef(null);
    const [videoLoaded, setVideoLoaded] = useState(false);

    const [inputLength, setInputLength] = useState(0);
    const [soundLength, setSoundLength] = useState(0);
    const [welcomeLength, setWelcomeLength] = useState(0);
    const [videoUrl, setVideoUrl] = useState('https://beemil.site/media/samantha/samantha11.mp4');

    useEffect(() => {
        // 텍스트 길이
        const newInputLength = VTEXT ? JSON.stringify(VTEXT).split(' ').join('').length : 0;
        setInputLength(newInputLength);

        console.log(`챗봇 영상의 입 모양 움직임 횟수 초기화 결과 - 텍스트 길이: ${newInputLength}`);

        if (newInputLength !== 0) {
            setSoundLength(0);
        }
    }, [VTEXT, setSoundLength]);

    useEffect(() => {
        // 음성 길이
        const newSoundLength = BOText ? JSON.stringify(BOText).split(' ').join('').length : 0;
        setSoundLength(newSoundLength);

        console.log(`챗봇 영상의 입 모양 움직임 횟수 초기화 결과 - 음성 길이: ${newSoundLength}`);

        if (newSoundLength !== 0) {
            setInputLength(0);
        }
    }, [BOText, setInputLength]);

    useEffect(() => {
        // 음성 길이
        const newWelcomeLength = welcomeText ? JSON.stringify(welcomeText).split(' ').join('').length : 0;
        setWelcomeLength(newWelcomeLength);

        console.log(`챗봇 영상의 입 모양 움직임 횟수 초기화 결과 - 웰컴 메시지 길이: ${newWelcomeLength}`);

        if (newWelcomeLength !== 17) {
            setSoundLength(0);
            setInputLength(0);
        }
    }, [welcomeText, setSoundLength, setInputLength]);

    useEffect(() => {
            if (inputLength === 7 || soundLength === 7 ) {
                setVideoUrl('https://beemil.site/media/samantha/samantha3.mp4');

            } else if (inputLength === 8 || soundLength === 8 ) {
                setVideoUrl('https://beemil.site/media/samantha/samantha4.mp4');

            } else if (inputLength === 9 || soundLength === 9 ) {
                setVideoUrl('https://beemil.site/media/samantha/samantha5.mp4');

            } else if (inputLength === 10 || soundLength === 10 ) {
                setVideoUrl('https://beemil.site/media/samantha/samantha6.mp4');

            } else if (inputLength === 11 || soundLength === 11 ) {
                setVideoUrl('https://beemil.site/media/samantha/samantha7.mp4');

            } else if (inputLength === 12 || soundLength === 12 ) {
                setVideoUrl('https://beemil.site/media/samantha/samantha8.mp4');

            } else if (inputLength === 13 || soundLength === 13 ) {
                setVideoUrl('https://beemil.site/media/samantha/samantha9.mp4');

            } else if (inputLength === 14 || soundLength === 14 ) {
                setVideoUrl('https://beemil.site/media/samantha/samantha10.mp4');

            } else if (inputLength === 15 || soundLength === 15 || welcomeLength === 15 ) {
                setVideoUrl('https://beemil.site/media/samantha/samantha11.mp4');

            } else if (inputLength === 16 || soundLength === 16 ) {
                setVideoUrl('https://beemil.site/media/samantha/samantha12.mp4');

            } else if (inputLength === 17 || soundLength === 17 ) {
                setVideoUrl('https://beemil.site/media/samantha/samantha13.mp4');

            } else if (inputLength === 18 || soundLength === 18 ) {
                setVideoUrl('https://beemil.site/media/samantha/samantha14.mp4');

            } else if (inputLength === 19 || soundLength === 19 ) {
                setVideoUrl('https://beemil.site/media/samantha/samantha15.mp4');

            } else if (inputLength === 20 || soundLength === 20 ) {
                setVideoUrl('https://beemil.site/media/samantha/samantha16.mp4');
            }
    }, [inputLength, soundLength, welcomeLength]);

    useEffect(() => {
        console.log(`챗봇 영상의 입 모양 움직임 횟수 초기화 결과 - URL: ${videoUrl}`);
    }, [videoUrl]);

    const restartPlayer = () => {
        const internalPlayer = playerRef.current?.getInternalPlayer();

        if (internalPlayer?.pause && internalPlayer?.play) {
            internalPlayer.pause();

            setTimeout(() => {
                internalPlayer.play();
            }, 0);
        }
    };

    useEffect(() => {
        setIsPlaying(VTEXT && VTEXT.length > 0);
        restartPlayer();

    }, [VTEXT, BOText, welcomeText]);

    const handleVideoLoad = () => {
        setVideoLoaded(true);
    };

    useEffect(() => {
        const videoElement = document.createElement('video');

        videoElement.src = videoUrl;
        videoElement.preload = 'auto';
        videoElement.addEventListener('loadeddata', handleVideoLoad);

        return () => {
            videoElement.removeEventListener('loadeddata', handleVideoLoad);
        };
    }, [videoUrl]);

    return (
        <div className="virtualBot">
            {videoLoaded && (
                <ReactPlayer
                    ref={playerRef}
                    playing={isPlaying}
                    controls={false}
                    loop={false}
                    muted={false}
                    volume={0}
                    width="100%"
                    height="100%"
                    url={videoUrl}
                    preload="auto"
                />
            )}
        </div>
    );
}
export default VirtualBot;