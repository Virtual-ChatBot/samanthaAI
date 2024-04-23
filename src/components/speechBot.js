export function SpeechBot(text, volume = 1, rate = 1, pitch = 1) {
    console.log("음성 합성: " + text);

    // 음성 합성 API 지원 여부 확인
    if (!("speechSynthesis" in window)) {
        console.log("음성 합성 API가 지원되지 않습니다.");
        return;
    }

    let voices = [];

    // 음성 합성 API의 음성 목록을 가져오는 콜백 기능
    const setVoiceList = () => {
        voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            speech(text); // 음성 목록을 가져온 후 음성 합성 시도
        }
    };

    if (window.speechSynthesis.onvoiceschanged !== undefined) {

        // voice list에 변경됐을 때, voice를 다시 가져옴
        window.speechSynthesis.onvoiceschanged = setVoiceList;
    }

    // 음성 합성 함수 선언
    const speech = (txt) => {

        const lang = "ko-KR";
        const utterThis = new SpeechSynthesisUtterance(txt);

        utterThis.lang = lang;
        utterThis.volume = volume; // 볼륨 설정
        utterThis.rate = rate; // 속도 설정
        utterThis.pitch = pitch; // 음높이 설정

        // 한국어 voice 찾기
        const kor_voice = voices.find(
            (elem) => elem.lang === lang || elem.lang === lang.replace("-", "_")
        );

        // 한국어 voice가 있다면 설정
        if (kor_voice) {
            utterThis.voice = kor_voice;
        } else {
            console.log("한국어 음성을 찾을 수 없습니다.");
            return;
        }

        // utterance를 재생(speak)함
        window.speechSynthesis.speak(utterThis);
    };

    // 음성 합성 API의 음성 목록을 가져옴
    setVoiceList();
}