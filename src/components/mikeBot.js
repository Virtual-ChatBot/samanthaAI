import React, {useEffect, useState} from "react";

//CSS
import '../styles/mikeBot.css';

// URL
const mikeOff = 'https://beemil.site/images/samantha/mikeOff.gif';
const mikeOn = 'https://beemil.site/images/samantha/mikeOn.gif';

function MikeBot({ STT })  {

    const [stream, setStream] = useState();

    const [media, setMedia] = useState();

    const [recognition, setOnRecognition] = useState(true);

    const [source, setSource] = useState();

    const [analyser, setAnalyser] = useState();

    const [audioUrl, setAudioUrl] = useState();

    function startRecording(){

        // 음원정보를 담은 노드를 생성하거나 음원을 실행또는 디코딩 시키는 일을 한다
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // 자바스크립트를 통해 음원의 진행상태에 직접접근에 사용된다.
        const analyser = audioCtx.createScriptProcessor(0, 1, 1);

        setAnalyser(analyser);

        function makeSound(stream) {
          // 내 컴퓨터의 마이크나 다른 소스를 통해 발생한 오디오 스트림의 정보를 보여준다.
          const source = audioCtx.createMediaStreamSource(stream);
          setSource(source);
          source.connect(analyser);
          analyser.connect(audioCtx.destination);
        }

        // 마이크 사용 권한 획득
        console.warn('getUserMedia will be allowed.');
        const constraints = { audio: true };
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                handleMediaStream(stream);
            })
            .catch((error) => {
                console.error('Error accessing microphone:', error);
            });

        function handleMediaStream(stream) {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            setStream(stream);
            setMedia(mediaRecorder);
            makeSound(stream);

            analyser.onaudioprocess = function (e) {
                if (e.playbackTime > 10) {
                    stream.getAudioTracks().forEach(function (track) {
                        track.stop();
                    });
                    mediaRecorder.stop();
                    analyser.disconnect();
                    audioCtx.createMediaStreamSource(stream).disconnect();

                    mediaRecorder.ondataavailable = function (e) {
                        setAudioUrl(e.data);
                        setOnRecognition(true);
                    };
                } else {
                    setOnRecognition(false);
                }
            }
        }
    }

    // 사용자가 음성 녹음을 중지 했을 때
    // eslint-disable-next-line react-hooks/exhaustive-deps
    function stopRecording() {

        // dataAvailable 이벤트로 Blob 데이터에 대한 응답을 받을 수 있음
        media.ondataavailable = function (e) {

            setAudioUrl(e.data);
            setOnRecognition(true);

            //마이크에 입력된 사람의 음성을 바이너리 음성파일로 변환 시작
            const formData= new FormData();
            formData.append("audio", new Blob([e.data], { type: "audio/mpeg" }));

            // 네이버 STT OPEN API 😀😀😀
            fetch('https://beemil.site/bot/stt', {

              method: "POST",
              body: formData

            }).then((response) => response.json())
            .then((data) => {

              console.log(data)
              STT(data.text);

            }).catch((error) => {

              console.log(error.message)
            })
        };

        // 모든 트랙에서 stop()을 호출해 오디오 스트림을 정지
        stream.getAudioTracks().forEach(function (track) {

            track.stop();
        });

        // 미디어 캡처 중지
        media.stop();

        // 메서드가 호출 된 노드 연결 해제
        analyser.disconnect();
        source.disconnect();

        // 생성된 음성 파일 정보 출력
        const sound = new File([audioUrl], "soundBlob", {

            lastModified: new Date().getTime(),
            type: "audio",
        });
        console.log(sound);
    }

    useEffect(() => {

        if (!recognition) {

            const timer = setTimeout(stopRecording, 3000); // 3초 (5000ms)
            return () => clearTimeout(timer);
        }
    }, [recognition, stopRecording]);

    return (

        <div className="voiceButton">
            {recognition ? (
                <img className="mikeButton" src={mikeOff} alt="Microphone Off" onClick={startRecording} />
            ) : (
                <img className="mikeButton" src={mikeOn} alt="Microphone On" onClick={stopRecording} />
            )}
        </div>
    );
}
export default MikeBot;