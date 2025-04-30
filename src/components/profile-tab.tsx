"use client"

import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { User as UserType } from "@/lib/types"

interface ProfileTabProps {
  isLoggedIn: boolean
  user: UserType
  onLogin: () => void
}

export function ProfileTab({ isLoggedIn, user, onLogin }: ProfileTabProps) {
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
              <div className="text-teal-600 dark:text-teal-400 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check-circle-2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800 dark:text-white mb-1">Preguntas Resueltas</h4>
              <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">{user.stats.solved}</p>
            </div>

            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
              <div className="text-teal-600 dark:text-teal-400 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-pencil-ruler"
                >
                  <path d="m15 5 4 4" />
                  <path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13" />
                  <path d="m8 6 2-2" />
                  <path d="m2 22 5.5-1.5L21.17 6.83a2.82 2.82 0 0 0-4-4L3.5 16.5Z" />
                  <path d="m18 16 2-2" />
                  <path d="m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800 dark:text-white mb-1">Preguntas Creadas</h4>
              <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">{user.stats.created}</p>
            </div>

            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
              <div className="text-teal-600 dark:text-teal-400 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-trophy"
                >
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
              </div>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actividad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Resultado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {user.activities.map((activity, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{activity.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{activity.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{activity.type}</td>
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
