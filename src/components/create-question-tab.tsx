"use client"

import { useState } from "react"
import { TextCursorInput, Shapes, Pencil, FileSearch, ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Question } from "@/lib/types"

interface CreateQuestionTabProps {
  onSaveQuestion: (question: Question) => void
}

export function CreateQuestionTab({ onSaveQuestion }: CreateQuestionTabProps) {
  const [newQuestion, setNewQuestion] = useState<Question>({
    title: "",
    description: "",
    type: "order-words",
    words: [],
    correctOrder: "",
    incoherentText: "",
    correctText: "",
    image: null,
    feedbackCorrect: "¡Muy bien! Has respondido correctamente.",
    feedbackIncorrect: "Intenta de nuevo. Revisa tu respuesta.",
  })

  const [newWordInput, setNewWordInput] = useState("")

  const isQuestionValid = () => {
    if (!newQuestion.title || !newQuestion.description) return false

    if (newQuestion.type === "order-words") {
      return newQuestion.words.length >= 3 && newQuestion.correctOrder
    } else if (newQuestion.type === "incoherence") {
      return newQuestion.incoherentText && newQuestion.correctText
    }

    return true
  }

  const addWord = () => {
    if (newWordInput.trim()) {
      setNewQuestion({
        ...newQuestion,
        words: [...newQuestion.words, newWordInput.trim()],
      })
      setNewWordInput("")
    }
  }

  const removeWord = (index: number) => {
    const updatedWords = [...newQuestion.words]
    updatedWords.splice(index, 1)
    setNewQuestion({
      ...newQuestion,
      words: updatedWords,
    })
  }

  const saveQuestion = () => {
    onSaveQuestion(newQuestion)

    // Reiniciamos el formulario
    setNewQuestion({
      title: "",
      description: "",
      type: "order-words",
      words: [],
      correctOrder: "",
      incoherentText: "",
      correctText: "",
      image: null,
      feedbackCorrect: "¡Muy bien! Has respondido correctamente.",
      feedbackIncorrect: "Intenta de nuevo. Revisa tu respuesta.",
    })

    // Mostramos mensaje de éxito
    alert("Pregunta guardada correctamente")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Crear Nueva Pregunta</h2>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-8">
        <div className="mb-6">
          <label htmlFor="question-title" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Título de la Pregunta
          </label>
          <Input
            id="question-title"
            value={newQuestion.title}
            onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
            placeholder="Escribe un título descriptivo"
            className="dark:bg-slate-700"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="question-description" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Enunciado o Descripción
          </label>
          <Textarea
            id="question-description"
            value={newQuestion.description}
            onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
            rows={3}
            placeholder="Describe la pregunta o actividad"
            className="dark:bg-slate-700"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Tipo de Actividad</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setNewQuestion({ ...newQuestion, type: "order-words" })}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                newQuestion.type === "order-words"
                  ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <div className="flex items-center">
                <div className="text-teal-600 dark:text-teal-400 mr-3">
                  <TextCursorInput size={24} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Ordenar Palabras</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Los usuarios ordenarán palabras para formar una oración correcta
                  </p>
                </div>
              </div>
            </div>

            <div
              onClick={() => setNewQuestion({ ...newQuestion, type: "order-shapes" })}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                newQuestion.type === "order-shapes"
                  ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <div className="flex items-center">
                <div className="text-teal-600 dark:text-teal-400 mr-3">
                  <Shapes size={24} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Ordenar Figuras</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Los usuarios ordenarán figuras según un criterio específico
                  </p>
                </div>
              </div>
            </div>

            <div
              onClick={() => setNewQuestion({ ...newQuestion, type: "drawing" })}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                newQuestion.type === "drawing"
                  ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <div className="flex items-center">
                <div className="text-teal-600 dark:text-teal-400 mr-3">
                  <Pencil size={24} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Dibujar</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Los usuarios dibujarán algo según las instrucciones
                  </p>
                </div>
              </div>
            </div>

            <div
              onClick={() => setNewQuestion({ ...newQuestion, type: "incoherence" })}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                newQuestion.type === "incoherence"
                  ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <div className="flex items-center">
                <div className="text-teal-600 dark:text-teal-400 mr-3">
                  <FileSearch size={24} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Detectar Incoherencias</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Los usuarios identificarán y corregirán incoherencias en oraciones
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido específico según el tipo de pregunta */}
        {newQuestion.type === "order-words" && (
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Palabras para ordenar</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {newQuestion.words.map((word, index) => (
                <div
                  key={index}
                  className="bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 px-3 py-1 rounded-lg flex items-center"
                >
                  {word}
                  <button
                    onClick={() => removeWord(index)}
                    className="ml-2 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <Input
                value={newWordInput}
                onChange={(e) => setNewWordInput(e.target.value)}
                className="flex-1 rounded-r-none dark:bg-slate-700"
                placeholder="Añadir palabra"
                onKeyDown={(e) => e.key === "Enter" && addWord()}
              />
              <Button onClick={addWord} className="rounded-l-none bg-teal-600 hover:bg-teal-700">
                Añadir
              </Button>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Orden correcto</label>
              <Input
                value={newQuestion.correctOrder}
                onChange={(e) => setNewQuestion({ ...newQuestion, correctOrder: e.target.value })}
                className="dark:bg-slate-700"
                placeholder="Escribe la oración correcta"
              />
            </div>
          </div>
        )}

        {newQuestion.type === "incoherence" && (
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Oración con incoherencias</label>
            <Textarea
              value={newQuestion.incoherentText}
              onChange={(e) => setNewQuestion({ ...newQuestion, incoherentText: e.target.value })}
              rows={3}
              className="dark:bg-slate-700"
              placeholder="Escribe una oración con incoherencias (ej: 'El perro vuela el piano')"
            />
            <div className="mt-4">
              <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Versión correcta</label>
              <Textarea
                value={newQuestion.correctText}
                onChange={(e) => setNewQuestion({ ...newQuestion, correctText: e.target.value })}
                rows={3}
                className="dark:bg-slate-700"
                placeholder="Escribe la versión correcta de la oración"
              />
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Imagen (opcional)</label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            {!newQuestion.image ? (
              <div className="flex flex-col items-center">
                <ImageIcon size={40} className="text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">Arrastra una imagen o haz clic para seleccionar</p>
                <Button
                  variant="outline"
                  className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Seleccionar imagen
                </Button>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={newQuestion.image || "/placeholder.svg"}
                  alt="Imagen de la pregunta"
                  className="max-h-48 mx-auto"
                />
                <button
                  onClick={() => setNewQuestion({ ...newQuestion, image: null })}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Retroalimentación</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 dark:text-gray-300 text-sm mb-1">Respuesta correcta</label>
              <Textarea
                value={newQuestion.feedbackCorrect}
                onChange={(e) => setNewQuestion({ ...newQuestion, feedbackCorrect: e.target.value })}
                rows={2}
                className="dark:bg-slate-700"
                placeholder="Mensaje para respuesta correcta"
              />
            </div>
            <div>
              <label className="block text-gray-600 dark:text-gray-300 text-sm mb-1">Respuesta incorrecta</label>
              <Textarea
                value={newQuestion.feedbackIncorrect}
                onChange={(e) => setNewQuestion({ ...newQuestion, feedbackIncorrect: e.target.value })}
                rows={2}
                className="dark:bg-slate-700"
                placeholder="Mensaje para respuesta incorrecta"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={saveQuestion}
            disabled={!isQuestionValid()}
            className={`bg-teal-600 hover:bg-teal-700 ${!isQuestionValid() ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Guardar Pregunta
          </Button>
        </div>
      </div>
    </div>
  )
}
