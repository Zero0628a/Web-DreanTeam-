"use client";

import React, { useState, useEffect } from "react";

type Question = {
  id: number;
  question: string;
  imageUrl: string;
  audioUrl: string;
  correctOrders: string[];
};

const questions: Question[] = [
  {
    id: 1,
    question: "Pregunta 1",
    imageUrl: "/image1.jpg",
    audioUrl: "/audio1.mp3",
    correctOrders: ["respuesta1", "respuesta uno"]
  },
  {
    id: 2,
    question: "Pregunta 2",
    imageUrl: "/image2.jpg",
    audioUrl: "/audio2.mp3",
    correctOrders: ["respuesta2"]
  },
  {
    id: 3,
    question: "Pregunta 3",
    imageUrl: "/image3.jpg",
    audioUrl: "/audio3.mp3",
    correctOrders: ["respuesta3"]
  },
];

const QuestionComponent: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (audio) {
      audio.pause();
    }
    const newAudio = new Audio(currentQuestion.audioUrl);
    setAudio(newAudio);
    newAudio.play();
    return () => {
      newAudio.pause();
      newAudio.currentTime = 0;
    };
  }, [currentQuestion]);

  const handleAnswer = () => {
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const isCorrect = currentQuestion.correctOrders.some(order =>
      normalizedUserAnswer === order.trim().toLowerCase()
    );

    if (isCorrect) {
      setFeedback("✅ ¡Respuesta correcta!");
    } else {
      setFeedback("❌ Respuesta incorrecta. Intenta de nuevo.");
    }
  };

  const handleNextQuestion = () => {
    setFeedback("");
    setUserAnswer("");
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert("🎉 Has completado todas las preguntas.");
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">{currentQuestion.question}</h2>
      <img src={currentQuestion.imageUrl} alt="Imagen de la pregunta" className="mb-4 w-full rounded" />
      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Escribe tu respuesta"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <button
        onClick={handleAnswer}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-2"
      >
        Responder
      </button>

      {feedback && (
        <div className={`mb-4 text-lg ${feedback.includes("correcta") ? "text-green-600" : "text-red-600"}`}>
          {feedback}
        </div>
      )}

      <button
        onClick={handleNextQuestion}
        className="bg-gray-500 text-white px-4 py-2 rounded"
      >
        Siguiente
      </button>
    </div>
  );
};

export default QuestionComponent;
