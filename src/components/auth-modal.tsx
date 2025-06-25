"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AuthModalProps {
  onClose: () => void
  onLogin: (userData: { name: string; email: string }) => void
}

export function AuthModal({ onClose, onLogin }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    name: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setAuthForm({
      ...authForm,
      [id]: value,
    })
  }

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleAuth = () => {
    const { email, password, name } = authForm

    // Validaciones básicas
    if (!email || !password || (authMode === "register" && !name)) {
      setError("Todos los campos son obligatorios.")
      return
    }

    if (!validateEmail(email)) {
      setError("El correo no es válido.")
      return
    }

    setLoading(true)
    setError(null)

    setTimeout(() => {
      onLogin({
        name: name || "Usuario Demo",
        email,
      })
      setLoading(false)
    }, 1000)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if ((e.target as Element).id === "auth-modal-backdrop") {
      onClose()
    }
  }

  return (
    <div
      id="auth-modal-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            {authMode === "login" ? "Iniciar Sesión" : "Registrarse"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
              Correo Electrónico
            </label>
            <Input
              type="email"
              id="email"
              value={authForm.email}
              onChange={handleInputChange}
              className="dark:bg-slate-700"
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
              Contraseña
            </label>
            <Input
              type="password"
              id="password"
              value={authForm.password}
              onChange={handleInputChange}
              className="dark:bg-slate-700"
              placeholder="********"
              disabled={loading}
            />
          </div>

          {authMode === "register" && (
            <div>
              <label htmlFor="name" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                Nombre
              </label>
              <Input
                type="text"
                id="name"
                value={authForm.name}
                onChange={handleInputChange}
                className="dark:bg-slate-700"
                placeholder="Tu nombre"
                disabled={loading}
              />
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="mt-6">
          <Button
            onClick={handleAuth}
            className="w-full bg-teal-600 hover:bg-teal-700"
            disabled={loading}
          >
            {loading
              ? "Procesando..."
              : authMode === "login"
              ? "Iniciar Sesión"
              : "Registrarse"}
          </Button>

          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            {authMode === "login" ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
            <button
              onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
              className="text-teal-600 dark:text-teal-400 font-medium hover:underline ml-1"
              disabled={loading}
            >
              {authMode === "login" ? "Regístrate" : "Inicia sesión"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
