"use client"

import { useEffect, useState } from "react"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { User as UserType } from "@/lib/types"

interface ProfileTabProps {
  isLoggedIn: boolean
  user: UserType
  onLogin: () => void
}

export function ProfileTab({ isLoggedIn, user, onLogin }: ProfileTabProps) {
  const [respuestasFirestore, setRespuestasFirestore] = useState([])

  useEffect(() => {
    const fetchRespuestas = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/respuestas/${user.email}`)
        const data = await res.json()
        setRespuestasFirestore(data)
      } catch (error) {
        console.error("Error al obtener respuestas:", error)
      }
    }

    if (user?.email) {
      fetchRespuestas()
    }
  }, [user])

  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Mi Perfil</h2>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-8 text-center">
          <div className="text-teal-600 dark:text-teal-400 mb-4 flex justify-center">
            <User size={64} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Inicia sesión para ver tu perfil</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Necesitas iniciar sesión para acceder a tu perfil y estadísticas.
          </p>
          <Button onClick={onLogin} className="bg-teal-600 hover:bg-teal-700">
            Iniciar Sesión
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Mi Perfil</h2>

      <div className="grid gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-teal-200 flex items-center justify-center text-teal-700 font-bold text-2xl">
              {user.name.charAt(0)}
            </div>
            <div className="ml-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{user.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 dark:text-white mb-1">Preguntas Resueltas</h4>
              <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">{user.stats.solved}</p>
            </div>
            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 dark:text-white mb-1">Preguntas Creadas</h4>
              <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">{user.stats.created}</p>
            </div>
            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 dark:text-white mb-1">Puntuación</h4>
              <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">{user.stats.score}</p>
            </div>
          </div>

          <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Progreso por Habilidad</h4>
          <div className="space-y-4">
            {user.skills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{skill.name}</span>
                  <span className="text-gray-600 dark:text-gray-400">{skill.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: `${skill.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Historial de Actividad</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pregunta</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {respuestasFirestore.map((activity: any, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{activity.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{activity.questionTitle}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{activity.questionType}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          activity.result === "Correcto"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                        }`}
                      >
                        {activity.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
