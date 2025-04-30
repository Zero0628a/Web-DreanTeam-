"use client"

import { useState } from "react"
import { Header } from "./header"
import { HomeTab } from "./home-tab"
import { SolveQuestionsTab } from "./solve-questions-tab"
import { ProfileTab } from "./profile-tab"
import { AuthModal } from "@/components/auth-modal"
import type { User, Question } from "@/lib/types"
import { CreateQuestionTab } from "./create-question-tab"

export function MainApp() {
  const [activeTab, setActiveTab] = useState<"home" | "create" | "solve" | "profile">("home")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Usuario simulado
  const [user, setUser] = useState<User>({
    name: "Usuario Demo",
    email: "usuario@demo.com",
    stats: {
      solved: 12,
      created: 5,
      score: 240,
    },
    skills: [
      { name: "Comprensión Lectora", progress: 75 },
      { name: "Razonamiento Lógico", progress: 60 },
      { name: "Expresión Artística", progress: 45 },
      { name: "Detección de Incoherencias", progress: 80 },
    ],
    activities: [
      { date: "2023-05-15", name: "Ordenar palabras", type: "Resolver", result: "Correcto" },
      { date: "2023-05-14", name: "Detectar incoherencias", type: "Resolver", result: "Incorrecto" },
      { date: "2023-05-12", name: "Dibujar un paisaje", type: "Crear", result: "Correcto" },
      { date: "2023-05-10", name: "Ordenar figuras", type: "Resolver", result: "Correcto" },
      { date: "2023-05-08", name: "Ordenar palabras", type: "Crear", result: "Correcto" },
    ],
  })

  // Preguntas disponibles (simuladas)
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([
    {
      title: "Ordena las palabras para formar una oración",
      description: "Arrastra las palabras para formar una oración coherente sobre el clima.",
      type: "order-words",
      words: ["El", "cielo", "está", "despejado", "hoy"],
      correctOrder: "El cielo está despejado hoy",
      image: null,
      feedbackCorrect: "¡Excelente! Has formado la oración correctamente.",
      feedbackIncorrect: "La oración no es correcta. Intenta ordenar las palabras de otra manera.",
    },
    {
      title: "Corrige la incoherencia",
      description: "Identifica y corrige la incoherencia en la siguiente oración.",
      type: "incoherence",
      incoherentText: "El perro vuela sobre el piano mientras toca una melodía.",
      correctText: "El perro salta sobre el piano mientras suena una melodía.",
      image: null,
      feedbackCorrect: "¡Muy bien! Has identificado y corregido la incoherencia.",
      feedbackIncorrect: "Hay elementos incoherentes que no has corregido correctamente.",
    },
  ])

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser({
      ...user,
      name: userData.name,
      email: userData.email,
    })
    setIsLoggedIn(true)
    setShowAuthModal(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const handleSaveQuestion = (newQuestion: Question) => {
    setAvailableQuestions([...availableQuestions, newQuestion])

    // Incrementamos el contador de preguntas creadas
    setUser({
      ...user,
      stats: {
        ...user.stats,
        created: user.stats.created + 1,
      },
      activities: [
        {
          date: new Date().toISOString().split("T")[0],
          name: newQuestion.title,
          type: "Crear",
          result: "Correcto",
        },
        ...user.activities,
      ],
    })
  }

  const handleQuestionSolved = (questionTitle: string, isCorrect: boolean) => {
    if (isLoggedIn) {
      setUser({
        ...user,
        stats: {
          ...user.stats,
          solved: isCorrect ? user.stats.solved + 1 : user.stats.solved,
          score: isCorrect ? user.stats.score + 20 : user.stats.score,
        },
        activities: [
          {
            date: new Date().toISOString().split("T")[0],
            name: questionTitle,
            type: "Resolver",
            result: isCorrect ? "Correcto" : "Incorrecto",
          },
          ...user.activities,
        ],
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100 dark:from-slate-900 dark:to-slate-800">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-4 py-8">
        {activeTab === "home" && <HomeTab setActiveTab={setActiveTab} />}

        {activeTab === "create" && <CreateQuestionTab onSaveQuestion={handleSaveQuestion} />}

        {activeTab === "solve" && (
          <SolveQuestionsTab
            questions={availableQuestions}
            onQuestionSolved={handleQuestionSolved}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "profile" && (
          <ProfileTab isLoggedIn={isLoggedIn} user={user} onLogin={() => setShowAuthModal(true)} />
        )}
      </main>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />}
    </div>
  )
}
