"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Question } from "@/lib/types"

interface SolveQuestionsTabProps {
  questions: Question[]
  onQuestionSolved: (questionTitle: string, isCorrect: boolean) => void
  setActiveTab: (tab: "home" | "create" | "solve" | "profile") => void
}

export function SolveQuestionsTab({ questions, onQuestionSolved, setActiveTab }: SolveQuestionsTabProps) {
  const [shuffledWords, setShuffledWords] = useState<string[][]>([])
  const [selectedWords, setSelectedWords] = useState<number[][]>([])
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [questionFeedback, setQuestionFeedback] = useState<{ correct: boolean; message: string }[]>([])

  useEffect(() => {
    initializeQuestionState()
  }, [questions])

  const initializeQuestionState = () => {
    const newShuffledWords: string[][] = []
    const newSelectedWords: number[][] = []
    const newUserAnswers: string[] = []
    const newQuestionFeedback: { correct: boolean; message: string }[] = []

    questions.forEach((question, index) => {
      if (question.type === "order-words") {
        // Creamos una copia desordenada de las palabras
        newShuffledWords[index] = [...question.words].sort(() => Math.random() - 0.5)
        newSelectedWords[index] = []
      } else {
        newUserAnswers[index] = ""
      }
      newQuestionFeedback[index] = null
    })

    setShuffledWords(newShuffledWords)
    setSelectedWords(newSelectedWords)
    setUserAnswers(newUserAnswers)
    setQuestionFeedback(newQuestionFeedback)
  }

  const selectWord = (questionIndex: number, wordIndex: number) => {
    const newSelectedWords = [...selectedWords]
    const selectedIndex = newSelectedWords[questionIndex]?.indexOf(wordIndex)

    if (selectedIndex === -1) {
      // Si la palabra no está seleccionada, la añadimos
      newSelectedWords[questionIndex] = [...(newSelectedWords[questionIndex] || []), wordIndex]
    } else {
      // Si ya está seleccionada, la quitamos
      newSelectedWords[questionIndex].splice(selectedIndex, 1)
    }

    setSelectedWords(newSelectedWords)
  }

  const handleUserAnswerChange = (questionIndex: number, value: string) => {
    const newUserAnswers = [...userAnswers]
    newUserAnswers[questionIndex] = value
    setUserAnswers(newUserAnswers)
  }

  const checkAnswer = (questionIndex: number) => {
    const question = questions[questionIndex]

    if (question.type === "order-words") {
      // Construimos la respuesta del usuario
      const userAnswer = selectedWords[questionIndex].map((index) => shuffledWords[questionIndex][index]).join(" ")

      // Comparamos con la respuesta correcta
      const isCorrect = userAnswer.toLowerCase() === question.correctOrder.toLowerCase()

      const newQuestionFeedback = [...questionFeedback]
      newQuestionFeedback[questionIndex] = {
        correct: isCorrect,
        message: isCorrect ? question.feedbackCorrect : question.feedbackIncorrect,
      }
      setQuestionFeedback(newQuestionFeedback)

      // Notificamos al componente padre
      onQuestionSolved(question.title, isCorrect)
    } else if (question.type === "incoherence") {
      // Comparamos la respuesta del usuario con la correcta
      // Aquí podríamos usar un algoritmo más sofisticado para comparar textos
      const isCorrect =
        userAnswers[questionIndex].toLowerCase().includes("salta") &&
        userAnswers[questionIndex].toLowerCase().includes("suena")

      const newQuestionFeedback = [...questionFeedback]
      newQuestionFeedback[questionIndex] = {
        correct: isCorrect,
        message: isCorrect ? question.feedbackCorrect : question.feedbackIncorrect,
      }
      setQuestionFeedback(newQuestionFeedback)

      // Notificamos al componente padre
      onQuestionSolved(question.title, isCorrect)
    }
  }

  const clearCanvas = () => {
    const canvas = document.querySelector("canvas")
    if (canvas) {
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Resolver Preguntas</h2>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-8 text-center">
          <div className="text-teal-600 dark:text-teal-400 mb-4 flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-search-x"
            >
              <path d="m13.5 8.5-5 5" />
              <path d="m8.5 8.5 5 5" />
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No hay preguntas disponibles</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Aún no se han creado preguntas para resolver.</p>
          <Button onClick={() => setActiveTab("create")} className="bg-teal-600 hover:bg-teal-700">
            Crear una pregunta
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Resolver Preguntas</h2>

      <div className="grid gap-6">
        {questions.map((question, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{question.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{question.description}</p>

              {question.image && (
                <div className="mb-4">
                  <img
                    src={question.image || "/placeholder.svg"}
                    alt="Imagen de la pregunta"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                </div>
              )}

              {/* Componente para ordenar palabras */}
              {question.type === "order-words" && (
                <div className="mb-6">
                  <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-lg mb-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {shuffledWords[index]?.map((word, wordIndex) => (
                        <div
                          key={wordIndex}
                          onClick={() => selectWord(index, wordIndex)}
                          className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                            selectedWords[index]?.includes(wordIndex)
                              ? "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
                              : "bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200"
                          }`}
                        >
                          {word}
                        </div>
                      ))}
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-300 dark:border-gray-600 min-h-12">
                      <div className="flex flex-wrap gap-2">
                        {selectedWords[index]?.map((wordIndex) => (
                          <div
                            key={wordIndex}
                            className="bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 px-3 py-1 rounded-lg"
                          >
                            {shuffledWords[index][wordIndex]}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Componente para detectar incoherencias */}
              {question.type === "incoherence" && (
                <div className="mb-6">
                  <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-lg mb-4">
                    <p className="text-gray-800 dark:text-gray-200 mb-3">{question.incoherentText}</p>
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                      Corrige la oración:
                    </label>
                    <Textarea
                      value={userAnswers[index] || ""}
                      onChange={(e) => handleUserAnswerChange(index, e.target.value)}
                      rows={3}
                      className="dark:bg-slate-700"
                      placeholder="Escribe la versión corregida"
                    />
                  </div>
                </div>
              )}

              {/* Componente para dibujar */}
              {question.type === "drawing" && (
                <div className="mb-6">
                  <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-lg mb-4">
                    <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg h-64 mb-3 relative">
                      <canvas className="w-full h-full rounded-lg"></canvas>
                      <button
                        onClick={clearCanvas}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button className="px-3 py-1 bg-black text-white rounded-lg">Negro</button>
                      <button className="px-3 py-1 bg-red-500 text-white rounded-lg">Rojo</button>
                      <button className="px-3 py-1 bg-blue-500 text-white rounded-lg">Azul</button>
                      <button className="px-3 py-1 bg-green-500 text-white rounded-lg">Verde</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={() => checkAnswer(index)} className="bg-teal-600 hover:bg-teal-700">
                  Comprobar Respuesta
                </Button>
              </div>
            </div>

            {/* Feedback */}
            {questionFeedback[index] && (
              <div
                className={`p-4 border-t border-gray-200 dark:border-gray-700 ${
                  questionFeedback[index].correct ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
                }`}
              >
                <div className="flex items-start">
                  <div className={`${questionFeedback[index].correct ? "text-green-500" : "text-red-500"} mr-3 mt-1`}>
                    {questionFeedback[index].correct ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  </div>
                  <div>
                    <h4
                      className={`font-medium ${
                        questionFeedback[index].correct
                          ? "text-green-800 dark:text-green-200"
                          : "text-red-800 dark:text-red-200"
                      }`}
                    >
                      {questionFeedback[index].correct ? "¡Correcto!" : "Incorrecto"}
                    </h4>
                    <p
                      className={`${
                        questionFeedback[index].correct
                          ? "text-green-700 dark:text-green-300"
                          : "text-red-700 dark:text-red-300"
                      }`}
                    >
                      {questionFeedback[index].message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
