import React, { useState, useEffect, useRef } from "react";

//CSS
import '../styles/logBot.css';

function LogBot(props) {

    const [text, setText] = useState([]);

    const [userText, setUserText] = useState([]);

    const [botText, setBotText] = useState([]);

    //스크롤 포커스
    const chatLogsRef = useRef(null);

    //INPUT 포커스
    const inputRef = useRef(null);

    function handleClick(event) {

        // 클릭 및 엔터 조건 생성
        if((event.type === "click" && text[0]) || (event.key === "Enter" && text[0])) {

            // 사용자가 입력한 질문을 채팅창에 출력
            setUserText(arrayUserTexts => [...arrayUserTexts, text])

            // 네이버 챗봇 AI 서비스😀😀😀
            fetch("https://beemil.site/bot/chat", {

                method: "POST",
                headers: {

                    "Content-Type": 'application/json',
                },
                body: text[0],

            }).then((response) => response.json())
            .then((data) => {

                // 챗봇 응답 JSON 에서 답변 만 parsing
                const parse = data.bubbles.map(bubble => bubble.data.description || bubble.data.cover.data.description);

                // 챗봇 응답 JSON 에서 URL 만 parsing
                const url = data.bubbles.map(url => url.data.url);

                console.log(parse);

                props.VTT(parse);

                console.log("URL:", url);
                console.log("URL 길이:", url.length);

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

                setBotText(arrayBotTexts => [...arrayBotTexts, ...parse]);

            }).catch((error) => {

                console.log(error.message);
            })

            //INPUT TEXT 초기화
            setText([""]);

            //INPUT TEXT 포커스
            inputRef.current.focus();

        } else { inputRef.current.focus(); }
    }

    useEffect(() => {

        if (props.stt) {

            setUserText(arrayUserTexts => [...arrayUserTexts, props.stt]);
        }
    }, [props.stt]);

    useEffect(() => {

        setUserText([null])

        if (props.welcomeButton) {

            setBotText((arrayBotTexts) => [...arrayBotTexts, props.welcomeButton]);
        }
    }, [props.welcomeButton]);

    useEffect(() => {

        if (props.BOText) {

            setBotText((arrayBotTexts) => [...arrayBotTexts, props.BOText]);
        }
    }, [props.BOText]);

    useEffect(() => {

        inputRef.current.focus();

        chatLogsRef.current.scrollTop = chatLogsRef.current.scrollHeight;

    },);

    return (

        <div className="chatLogUI">

            <div className="chatHeader">SAMANTHA</div>
            <div className="chatHeaderFoot">samantha V1 | powerpoopoo@naver.com</div>

            <div className="chatBody">

                <div className="chatLog" ref={chatLogsRef}>

                    {userText && userText.map((text, index) => (

                        <React.Fragment key={index}>

                            {text && <div className='userBubble'>{text}</div>}
                            {botText[index] && <div className='botBubble'>
                                                    <div>
                                                        <img src="https://beemil.site/images/samantha/smile.svg" alt="Samantha Logo" />
                                                    </div>

                                                    {botText[index]}
                                               </div>
                            }
                        </React.Fragment>
                    ))}
                </div>

                <div className="chatInput">

                    {/*ENTER 버튼*/}
                    <button onClick={handleClick}>ENTER</button>

                    {/*INPUT TEXT*/}
                    <input onChange={(event) => setText([event.target.value])}
                           type="text" onKeyDown={handleClick} ref={inputRef} value={text} placeholder="질문을 입력해주세요."/>
                </div>
            </div>
        </div>
    );
}
export default LogBot;