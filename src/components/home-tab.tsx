"use client"

import { PencilRuler, Puzzle, TextCursorInput, Shapes, Pencil, FileSearch, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HomeTabProps {
  setActiveTab: (tab: "home" | "create" | "solve" | "profile") => void
}

export function HomeTab({ setActiveTab }: HomeTabProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Aprende creando, resuelve jugando</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Una plataforma interactiva para crear y resolver preguntas didácticas visuales y lógicas.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-teal-600 dark:text-teal-400 mb-4">
            <PencilRuler size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Crea Preguntas</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Diseña tus propias preguntas didácticas con imágenes, tablas y diferentes tipos de interacción.
          </p>
          <button
            onClick={() => setActiveTab("create")}
            className="text-teal-600 dark:text-teal-400 font-medium hover:underline flex items-center"
          >
            Empezar a crear
            <ArrowRight size={20} className="ml-1" />
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="text-teal-600 dark:text-teal-400 mb-4">
            <Puzzle size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Resuelve Desafíos</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Pon a prueba tus habilidades resolviendo preguntas interactivas y recibe retroalimentación inmediata.
          </p>
          <button
            onClick={() => setActiveTab("solve")}
            className="text-teal-600 dark:text-teal-400 font-medium hover:underline flex items-center"
          >
            Comenzar a resolver
            <ArrowRight size={20} className="ml-1" />
          </button>
        </div>
      </div>

      <div className="bg-teal-50 dark:bg-slate-700 rounded-xl p-8 mb-12">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Tipos de Actividades</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
            <div className="text-teal-600 dark:text-teal-400 mb-2">
              <TextCursorInput size={24} />
            </div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-1">Ordenar Palabras</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Forma oraciones coherentes ordenando palabras.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
            <div className="text-teal-600 dark:text-teal-400 mb-2">
              <Shapes size={24} />
            </div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-1">Ordenar Figuras</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Organiza figuras según color, tamaño o forma.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
            <div className="text-teal-600 dark:text-teal-400 mb-2">
              <Pencil size={24} />
            </div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-1">Dibujar</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Expresa tus ideas a través del dibujo.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
            <div className="text-teal-600 dark:text-teal-400 mb-2">
              <FileSearch size={24} />
            </div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-1">Detectar Incoherencias</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Identifica y corrige errores en oraciones.</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">¿Listo para comenzar?</h3>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={() => setActiveTab("create")} className="px-6 py-3 bg-teal-600 hover:bg-teal-700">
            Crear una pregunta
          </Button>
          <Button
            onClick={() => setActiveTab("solve")}
            variant="outline"
            className="px-6 py-3 text-teal-600 dark:text-teal-400 border-teal-600 dark:border-teal-400"
          >
            Resolver preguntas
          </Button>
        </div>
      </div>
    </div>
  )
}
