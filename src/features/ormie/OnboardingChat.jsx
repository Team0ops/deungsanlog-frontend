import { useState } from "react";
import ProfileStep from "./ProfileStep";

const questions = [
  {
    key: "age",
    question: "나이가 어떻게 되세요?",
    options: ["20대", "30대", "40대", "50대", "기타"],
  },
  {
    key: "region",
    question: "주로 어디 지역에서 등산하시나요?",
    options: ["서울", "경기", "강원", "충청", "경상", "전라", "제주", "기타"],
  },
  {
    key: "level",
    question: "등산 경험은 어느 정도세요?",
    options: ["초보자", "중급자", "고수"],
  },
];

const OnboardingChat = ({ onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);

  const handleAnswer = (value) => {
    const currentKey = questions[step].key;
    const newAnswers = { ...answers, [currentKey]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(newAnswers); // 최종 프로필 수집 완료
    }
  };

  const current = questions[step];

  return (
    <ProfileStep
      question={current.question}
      options={current.options}
      onSelect={handleAnswer}
    />
  );
};

export default OnboardingChat;
