"use client"

import { useState } from "react"
import { BrainCircuit, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/types"

interface HeaderProps {
  activeTab: "home" | "create" | "solve" | "profile"
  setActiveTab: (tab: "home" | "create" | "solve" | "profile") => void
  isLoggedIn: boolean
  user: User
  onLogin: () => void
  onLogout: () => void
}

export function Header({ activeTab, setActiveTab, isLoggedIn, user, onLogin, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleTabChange = (tab: "home" | "create" | "solve" | "profile") => {
    setActiveTab(tab)
    setMobileMenuOpen(false)
  }

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-teal-600 dark:text-teal-400 mr-2">
            <BrainCircuit size={32} />
          </div>
          <h1 className="text-2xl font-bold text-teal-700 dark:text-teal-300">InteracQuiz</h1>
        </div>

        <nav className="hidden md:flex space-x-6">
          <button
            onClick={() => handleTabChange("home")}
            className={`text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium ${
              activeTab === "home" ? "text-teal-600 dark:text-teal-400" : ""
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => handleTabChange("create")}
            className={`text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium ${
              activeTab === "create" ? "text-teal-600 dark:text-teal-400" : ""
            }`}
          >
            Crear Pregunta
          </button>
          <button
            onClick={() => handleTabChange("solve")}
            className={`text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium ${
              activeTab === "solve" ? "text-teal-600 dark:text-teal-400" : ""
            }`}
          >
            Resolver
          </button>
          <button
            onClick={() => handleTabChange("profile")}
            className={`text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium ${
              activeTab === "profile" ? "text-teal-600 dark:text-teal-400" : ""
            }`}
          >
            Mi Perfil
          </button>
        </nav>

        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <Button onClick={onLogin} className="bg-teal-600 hover:bg-teal-700">
              Iniciar Sesión
            </Button>
          ) : (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-teal-200 flex items-center justify-center text-teal-700 font-bold">
                {user.name.charAt(0)}
              </div>
              <button
                onClick={onLogout}
                className="ml-2 text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400"
              >
                Salir
              </button>
            </div>
          )}

          <button onClick={toggleMobileMenu} className="md:hidden text-gray-600 dark:text-gray-300">
            <Menu />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-800 py-4 px-4 shadow-lg">
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => handleTabChange("home")}
              className={`text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium ${
                activeTab === "home" ? "text-teal-600 dark:text-teal-400" : ""
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => handleTabChange("create")}
              className={`text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium ${
                activeTab === "create" ? "text-teal-600 dark:text-teal-400" : ""
              }`}
            >
              Crear Pregunta
            </button>
            <button
              onClick={() => handleTabChange("solve")}
              className={`text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium ${
                activeTab === "solve" ? "text-teal-600 dark:text-teal-400" : ""
              }`}
            >
              Resolver
            </button>
            <button
              onClick={() => handleTabChange("profile")}
              className={`text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium ${
                activeTab === "profile" ? "text-teal-600 dark:text-teal-400" : ""
              }`}
            >
              Mi Perfil
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
