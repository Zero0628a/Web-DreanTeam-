"use client"

import {
  PencilRuler,
  Puzzle,
  TextCursorInput,
  Shapes,
  Pencil,
  FileSearch,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface HomeTabProps {
  setActiveTab: (tab: "home" | "create" | "solve" | "profile") => void
}

interface ActivityCardProps {
  Icon: React.ComponentType<{ size?: number }>
  title: string
  description: string
}

function ActivityCard({ Icon, title, description }: ActivityCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="text-teal-600 dark:text-teal-400 mb-2">
        <Icon size={24} />
      </div>
      <h4 className="font-bold text-gray-800 dark:text-white mb-1">{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

export function HomeTab({ setActiveTab }: HomeTabProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Aprende creando, resuelve jugando
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Una plataforma interactiva para crear y resolver preguntas didácticas visuales y
          lógicas.
        </p>
      </div>

      {/* Crear y Resolver */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-teal-600 dark:text-teal-400 mb-4">
            <PencilRuler size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Crea Preguntas</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Diseña tus propias preguntas didácticas con imágenes, tablas y diferentes tipos de
            interacción.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            aria-label="Empezar a crear preguntas"
            className="text-teal-600 dark:text-teal-400 font-medium hover:underline flex items-center transition-colors"
          >
            Empezar a crear <ArrowRight size={20} className="ml-1" />
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-teal-600 dark:text-teal-400 mb-4">
            <Puzzle size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Resuelve Desafíos</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Pon a prueba tus habilidades resolviendo preguntas interactivas y recibe
            retroalimentación inmediata.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab("solve")}
            aria-label="Comenzar a resolver preguntas"
            className="text-teal-600 dark:text-teal-400 font-medium hover:underline flex items-center transition-colors"
          >
            Comenzar a resolver <ArrowRight size={20} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Tipos de Actividades */}
      <div className="bg-teal-50 dark:bg-slate-700 rounded-xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Tipos de Actividades</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ActivityCard
            Icon={TextCursorInput}
            title="Ordenar Palabras"
            description="Forma oraciones coherentes ordenando palabras."
          />
          <ActivityCard
            Icon={Shapes}
            title="Ordenar Figuras"
            description="Organiza figuras según color, tamaño o forma."
          />
          <ActivityCard
            Icon={Pencil}
            title="Dibujar"
            description="Expresa tus ideas a través del dibujo."
          />
          <ActivityCard
            Icon={FileSearch}
            title="Detectar Incoherencias"
            description="Identifica y corrige errores en oraciones."
          />
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">¿Listo para comenzar?</h3>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            type="button"
            onClick={() => setActiveTab("create")}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 transition-colors"
          >
            Crear una pregunta
          </Button>
          <Button
            type="button"
            onClick={() => setActiveTab("solve")}
            variant="outline"
            className="px-6 py-3 text-teal-600 dark:text-teal-400 border-teal-600 dark:border-teal-400 transition-colors"
          >
            Resolver preguntas
          </Button>
        </div>
      </div>
    </div>
  )
}
