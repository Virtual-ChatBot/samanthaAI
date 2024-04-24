import React, {useCallback, useEffect, useState} from "react";

//JS
import LogBot from "./logBot";
import MediaBot from "./mediaBot";
import MikeBot from "./mikeBot";
import VirtualBot from "./virtualBot"

//CSS
import '../styles/mainBot.css';
import {SpeechBot} from "./speechBot";

function MainBot() {

    //스마일 클릭 시 생성된 챗봇 응답을 스테이블 디퓨전에 전달
    const [welcomeText, setWelcomeText] = useState("");

    //입력 텍스트를 통해 생성된 챗봇 응답을 스테이블 디퓨전에 전달
    const [VTEXT, setVTEXT] = useState(null);

    //음성인식을 통해 생성된 챗봇 응답을 채팅 로그&챗봇 영상에 전달
    const [BOText, setBOText] = useState(null);

    //음성인식을 통해 변환된 텍스트를 채팅 로그에 전달
    const [stt, setStt] = useState(false);

    //스마일 클릭 시 siri-rotate 애니메이션 실행
    const [disabled, setDisabled] = useState(true);

    //스마일 클릭 시 채팅창 출력
    const [showLog, setShowLog] = useState(false);

    //스마일 클릭 시 웰컴 메시지 및 버튼을 채팅 로그에 출력
    const [welcomeButton, setWelcomeButton] = useState("");

    //음성인식 버튼을 통해 생성된 챗봇 음성 데이터를 음성 재생 기능으로 전달(요금 이슈로 현재 사용 안 함)
    //const [tts, setTts] = useState(null);

    //입력 텍스트를 통해 생성된 챗봇 음성 데이터를 음성 재생 기능으로 전달(요금 이슈로 현재 사용 안 함)
    //const [vTts, setVtts] = useState(null);

    function smileClick() {

        // 스마일 클릭 시 스마일 애니메이션 실행&멈춤
        setDisabled(!disabled);

        // 스마일 클릭 시 채팅창 출력
        setShowLog(!showLog);

        if (welcomeButton.length === 0) {

/////////////////////////////////스마일 애니메이션 클릭 시 웰컴 메시지 출력/////////////////////////////////
            fetch("https://beemil.site/bot/chat", {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body: "동영상 보여줘"
            }).then((response) => response.json())
                .then((data) => {

                    console.log(JSON.stringify(data));

                    // 챗봇 답변 파싱
                    const parse = data.bubbles.map(bubble => bubble.data.cover.data.description);

                    console.log(parse);

                    // 챗봇 답변을 스테이블 디퓨전으로 전송
                    setWelcomeText(parse);

                    // 챗봇 답변을 음성 합성으로 전송
                    SpeechBot(parse);

                    //웰컴 버튼 생성 시작
                    const welcomeButtons = (bubble) => {

                        const buttons = bubble.data.contentTable?.flat() ?? [];

                        return buttons.filter((button) => button.data.type === "button")
                        .map((button, index) => {

                            const { title } = button.data;
                            const { url } = button.data.data.action.data;

                            return (

                                <MediaBot key={index} url={url} title={title} />
                            );
                        });
                    };

                    const persistentButtons = () => {

                        const persistentMenu = data.persistentMenu?.data || {};
                        const contentTable = persistentMenu.contentTable || [];

                        const buttons = contentTable.flat().filter(button => button.data.type === 'button');

                        const handleClick = (url) => {
                            // URL로 이동하는 동작 구현
                            window.location.href = url;
                        };

                        return buttons.map((button, index) => {

                            const { url } = button.data.data.action.data;
                            const { iconUrl } = button.data.data;
                            const rowSpan = button.rowSpan;
                            const colSpan = button.colSpan;

                            return (

                                <a key={index} href={url} onClick={() => handleClick(url)}>
                                    <span className={`pButtons rowSpan-${rowSpan} colSpan-${colSpan}`}>
                                        <img src={iconUrl} alt="Button Icon"/>
                                    </span>
                                </a>
                            );
                        });
                    };

                    const welcomeMessages = parse.map((text, index) => {
                        const bubble = data.bubbles[index];
                        const wButtons = welcomeButtons(bubble);
                        const pButtons = persistentButtons();

                        return (

                            <div className="welcome-message-container" key={index}>

                                {text}

                                <div className="button-container">
                                    {wButtons}
                                    {pButtons}
                                </div>
                            </div>
                        );
                    });

                    //웰컴 버튼 채팅 로그창으로 전송
                    setWelcomeButton(arrayBotTexts => [...arrayBotTexts, ...welcomeMessages]);

                }).catch((error) => {

                    console.log(error.message);
                })
        }
    }

/////////////////////////////////마이크 버튼 클릭 시 챗봇 메시지 출력/////////////////////////////////
    function STT(STT) {

        //마이크 음성을 텍스트로 변환 시킨 데이터를 채팅 로그창에 출력하기 위해 발송
        setStt(STT)

        // 네이버 챗봇 AI 서비스😀😀😀
        fetch("https://beemil.site/bot/chat", {

            method: "POST",
            headers: {

                "Content-Type": 'application/json',
            },
            body: STT

        }).then((response) => response.json())
        .then((data) => {

            console.log(data);

            //음성인식 버튼을 통해 생성된 챗봇 응답 파싱
            const parse = data.bubbles.map(bubble => bubble.data.description);

            //채봇 응답을 채팅 로그창 및 스테이블 디퓨전 전송
            setBOText(parse);

            //챗봇 응답을 음성 합성으로 전송
            SpeechBot(parse);

            // 페이지 내비게이션 서비스를 위한 파싱
            const url = data.bubbles.map(url => url.data.url);

            if (url && url[0] && url[0].length !== 0) {

                // 페이지 내비게이션 서비스😀😀😀
                fetch("https://beemil.site/bot/navi", {

                    method: "POST",
                    headers: {

                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ url: url })

                }).then((response) => {

                    if (response.ok) {

                        return response.json();

                    } else {

                        throw new Error("Error: " + response.status);
                    }

                }).then((data) => {

                    console.log(data);
                    const url = data.url[0]; // 응답 데이터에서 첫 번째 URL 값을 추출

                    if (url) {

                        console.log(url);
                        window.location.href = url; // URL을 사용하여 페이지 이동

                    } else {

                        console.log("Error: Invalid URL received");
                    }

                }).catch((error) => {

                    console.log(error.message);
                });
            }

        //음성인식 버튼을 통해 생성된 챗봇 응답을 네이버 TTS API 로 전달(요금 이슈로 현재 사용 안 함)
        //
        //     fetch("https://beemil.site/bot/tts", {
        //
        //         method: "POST",
        //         headers: {
        //
        //             "Content-Type": "application/json",
        //         },
        //         body: parse,
        //     }).then((response) => {
        //
        //         if (!response.ok) {
        //
        //             throw new Error("Network response was not ok");
        //         }
        //
        //         return response.blob();
        //
        //     }).then((blob) => {
        //
        //         console.log(blob);
        //
        //         //TTS 음성 재생
        //         setTts(blob);
        //         playTTS();
        //
        //     }).catch((error) => {
        //
        //         console.error("There was a problem with the fetch operation:", error);
        //     });
        //
        // }).catch((error) => {
        //
        //     console.log(error.message);
        });
    }

    function VTT(VTT) {

        //입력 텍스트에 대한 챗봇 응답을 영상 출력으로 전송
        setVTEXT(VTT);

        // 챗봇 답변을 음성 합성으로 전송
        SpeechBot(VTT);

        // 입력 텍스트를 통해 네이버 TTS OPEN API 시작😀😀😀(요금 이슈로 현재 사용 안 함)
        // fetch("https://beemil.site/bot/tts", {
        //
        //     method: "POST",
        //     headers: {
        //
        //         "Content-Type": "application/json",
        //     },
        //     body: VTT,
        //
        // }).then((response) => {
        //
        //     if (!response.ok) {
        //
        //         throw new Error("Network response was not ok");
        //     }
        //
        //     return response.blob();
        //
        // }).then((blob) => {
        //
        //     //TTS 음성 재생
        //     setVtts(blob);
        //     playTTS();
        //
        // }).catch((error) => {
        //
        //     console.error("There was a problem with the fetch operation:", error);
        // });
    }

    // const audioRef = useRef(new Audio());
    //
    // const playTTS = useCallback(() => {
    //
    //     if (!vTts && !tts) return;
    //
    //     const audio = audioRef.current;
    //     const audioSource = vTts || tts;
    //
    //     audio.src = URL.createObjectURL(audioSource);
    //     audio.currentTime = 0;
    //     audio.loop = false;
    //     audio.volume = 1;
    //
    //     const cleanUp = () => {
    //
    //         URL.revokeObjectURL(audio);
    //         audio.removeEventListener("ended", cleanUp);
    //         audio.currentTime = 0;
    //     };
    //
    //     audio.addEventListener("ended", cleanUp);
    //
    //     // 로드 중인 경우에만 재생 요청 처리
    //     if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
    //
    //         audio.play();
    //
    //     } else {
    //
    //         audio.addEventListener("canplaythrough", () => {
    //
    //             audio.play();
    //
    //         }, { once: true });
    //     }
    //
    //     if (vTts) {
    //
    //         setVtts(null); // vTts 데이터 초기화
    //
    //     } else {
    //
    //         setTts(null); // tts 데이터 초기화
    //     }
    //
    //     return cleanUp;
    //
    // }, [vTts, tts]);

    //음성인식 데이터 초기화
    // useEffect(() => {
    //
    //     const cleanUp = playTTS();
    //
    //     return () => {
    //
    //         if (cleanUp) cleanUp();
    //     };
    // }, [playTTS, audioRef]);

    //ESC 채팅 로그창 닫기 및 스마일 애니메이션 정지
    const handleKeyPress = useCallback((event) => {
        if (event.keyCode === 27) {
            setShowLog(false);
            setDisabled(true);
        }
    }, []);

    useEffect(() => {

        window.addEventListener('keydown', handleKeyPress);

        return () => {

            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return (

        <div className="chatBot">

            {!showLog && (

                <div>
                    {/* 음성챗봇 버튼 */}
                    <button className="botShow" onClick={smileClick}>음성챗봇</button>
                </div>
            )}

            {showLog && (

                <div>
                    {/* 음성 인식 버튼 */}
                    <MikeBot STT={STT} />
                </div>
            )}

            <div hidden={!showLog}>

                {/* 스테이블 디퓨전 */}
                <VirtualBot VTEXT={VTEXT} BOText={BOText} welcomeText={welcomeText}/>
            </div>

            <div>
                {/* 스마일 애니메이션 버튼 */}
                <button className={`smileButton ${disabled ? "offSmile" : "onSmile"}`} onClick={smileClick}></button>
            </div>

            <div hidden={!showLog}>

                {/* 채팅 로그창 */}
                <LogBot stt={stt} BOText={BOText} welcomeButton={welcomeButton} VTT={VTT}/>
            </div>

        </div>
    );
}
export default MainBot;