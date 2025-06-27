import { useState } from "react";
import ProfileStep from "./ProfileStep";
import GreenButton from "../../../shared/ui/greenButton";

const questions = [
  {
    key: "age",
    question: "🤖 먼저 연령대를 여쭤봐도 될까요?",
    options: ["20대", "30대", "40대", "50대", "기타"],
  },
  {
    key: "region",
    question: "🗺️ 자주 등산하시는 지역이 어디신가요?",
    options: ["서울", "경기", "강원", "충청", "경상", "전라", "제주", "기타"],
  },
  {
    key: "level",
    question: "🥾 등산실력은 어느 정도라고 생각하시나요?",
    options: ["초보자", "중급자", "고수"],
  },
];

const OnboardingChat = ({ onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(-1); // -1이면 안내 멘트

  const handleAnswer = (value) => {
    const currentKey = questions[step].key;
    const newAnswers = { ...answers, [currentKey]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  if (step === -1) {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "1rem",
          margin: "0 auto",
        }}
      >
        <div
          style={{ textAlign: "center", maxWidth: "400px", padding: "1rem" }}
        >
          <p
            className="wave-text"
            style={{
              fontSize: "1.3rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            안녕하세요! 저는{" "}
            <span className="wave-group">
              <span className="wave-char" style={{ animationDelay: "0s" }}>
                오
              </span>
              <span className="wave-char" style={{ animationDelay: "0.15s" }}>
                르
              </span>
              <span className="wave-char" style={{ animationDelay: "0.3s" }}>
                미
              </span>
            </span>
            예요 🤖
          </p>

          <p style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
            등산을 사랑하는 여러분을 위한
            <br />
            작은 AI 친구예요.
          </p>
          <p style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
            궁금한 게 있을 때 언제든지 물어보세요! <br />
            <strong style={{ color: "#4b8161", backgroundColor: "#fff7c9" }}>
              날씨, 산 정보, 코스 추천, 난이도, 등산 팁
            </strong>
            <br />
            뭐든지 도와드릴게요.
          </p>
          <p style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
            먼저 여러분을 더 잘 알기 위해 <br />
            <strong style={{ color: "#4b8161", backgroundColor: "#fff7c9" }}>
              간단한 프로필
            </strong>
            을 설정할게요 🙂
          </p>
          <p style={{ fontSize: "1rem", marginBottom: "1.2rem" }}>
            아래 버튼을 눌러 시작해주세요!
          </p>
          <GreenButton onClick={() => setStep(0)}>시작하기</GreenButton>
        </div>
      </div>
    );
  }

  const current = questions[step];

  return (
    <ProfileStep
      step={step}
      question={current.question}
      options={current.options}
      onSelect={handleAnswer}
    />
  );
};

export default OnboardingChat;
