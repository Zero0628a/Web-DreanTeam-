"use client"

import { useState } from "react"
import { Header } from "./header"
import { HomeTab } from "./home-tab"
import { SolveQuestionsTab } from "./solve-questions-tab"
import { ProfileTab } from "./profile-tab"
import { AuthModal } from "@/components/auth-modal"
import type { User, Question } from "@/lib/types"
import { CreateQuestionTab } from "./create-question-tab"

type Tab = "home" | "create" | "solve" | "profile"
const TAB_HOME: Tab = "home"
const TAB_CREATE: Tab = "create"
const TAB_SOLVE: Tab = "solve"
const TAB_PROFILE: Tab = "profile"

const RESULT_CORRECT = "Correcto"
const RESULT_INCORRECT = "Incorrecto"


export function MainApp() {
  const [activeTab, setActiveTab] = useState<Tab>(TAB_HOME)
  const [user, setUser] = useState<User | null>({
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
      { date: "2023-05-15", name: "Ordenar palabras", type: "Resolver", result: RESULT_CORRECT },
      { date: "2023-05-14", name: "Detectar incoherencias", type: "Resolver", result: RESULT_INCORRECT },
      { date: "2023-05-12", name: "Dibujar un paisaje", type: "Crear", result: RESULT_CORRECT },
      { date: "2023-05-10", name: "Ordenar figuras", type: "Resolver", result: RESULT_CORRECT },
      { date: "2023-05-08", name: "Ordenar palabras", type: "Crear", result: RESULT_CORRECT },
    ],
  })
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Usuario está logueado si user != null
  const isLoggedIn = user !== null

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
    setUser(prevUser => ({
      ...prevUser,
      name: userData.name,
      email: userData.email,
    }) as User) // aseguramos tipo
    setShowAuthModal(false)
  }

  const handleLogout = () => {
    setUser(null)
  }

  const handleSaveQuestion = (newQuestion: Question) => {
    setAvailableQuestions(prevQuestions => {
      if (prevQuestions.some(q => q.title === newQuestion.title)) {
        alert("Ya existe una pregunta con ese título")
        return prevQuestions
      }
      return [...prevQuestions, newQuestion]
    })

    setUser(prevUser => {
      if (!prevUser) return prevUser
      return {
        ...prevUser,
        stats: {
          ...prevUser.stats,
          created: prevUser.stats.created + 1,
        },
        activities: [
          {
            date: new Date().toISOString().split("T")[0],
            name: newQuestion.title,
            type: "Crear",
            result: RESULT_CORRECT,
          },
          ...prevUser.activities,
        ],
      }
    })
  }

  const handleQuestionSolved = (questionTitle: string, isCorrect: boolean) => {
  if (!isLoggedIn) return

  setUser(prevUser => {
    if (!prevUser) return prevUser
    return {
      ...prevUser,
      stats: {
        ...prevUser.stats,
        solved: isCorrect ? prevUser.stats.solved + 1 : prevUser.stats.solved,
        score: isCorrect ? prevUser.stats.score + 20 : prevUser.stats.score,
      },
      activities: [
        {
          date: new Date().toISOString().split("T")[0],
          name: questionTitle,
          type: "Resolver",
          result: isCorrect ? RESULT_CORRECT : RESULT_INCORRECT,
        },
        ...prevUser.activities,
      ],
    }
  })
}

const handleQuestionUpdated = (index: number, updatedQuestion: Question) => {
  const nuevas = [...availableQuestions]
  nuevas[index] = updatedQuestion
  setAvailableQuestions(nuevas)
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
      {activeTab === TAB_HOME && <HomeTab setActiveTab={setActiveTab} />}

      {activeTab === TAB_CREATE && <CreateQuestionTab onSaveQuestion={handleSaveQuestion} />}

      {activeTab === TAB_SOLVE && (
        <SolveQuestionsTab
          questions={availableQuestions}
          onQuestionSolved={handleQuestionSolved}
          onQuestionUpdated={handleQuestionUpdated} // 💥 ESTA LÍNEA SE AÑADE
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === TAB_PROFILE && (
        <ProfileTab isLoggedIn={isLoggedIn} user={user} onLogin={() => setShowAuthModal(true)} />
      )}
    </main>

    {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />}
  </div>
)
}