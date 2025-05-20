"use client"

import { useState, useCallback, ChangeEvent } from "react"
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

  // Validación para habilitar el botón guardar
  const isQuestionValid = (() => {
    if (!newQuestion.title.trim() || !newQuestion.description.trim()) return false

    if (newQuestion.type === "order-words") {
      return newQuestion.words.length >= 3 && newQuestion.correctOrder.trim().length > 0
    }
    if (newQuestion.type === "incoherence") {
      return newQuestion.incoherentText.trim().length > 0 && newQuestion.correctText.trim().length > 0
    }

    // Para otros tipos (order-shapes, drawing), solo título y descripción por ahora
    return true
  })()

  // Agregar palabra validando
  const addWord = useCallback(() => {
    const trimmed = newWordInput.trim()
    if (trimmed) {
      setNewQuestion((prev) => ({
        ...prev,
        words: [...prev.words, trimmed],
      }))
      setNewWordInput("")
    }
  }, [newWordInput])

  // Quitar palabra
  const removeWord = useCallback((index: number) => {
    setNewQuestion((prev) => {
      const updatedWords = [...prev.words]
      updatedWords.splice(index, 1)
      return { ...prev, words: updatedWords }
    })
  }, [])

  // Guardar pregunta
  const saveQuestion = () => {
    if (!isQuestionValid) return

    onSaveQuestion(newQuestion)

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
    setNewWordInput("")

    alert("Pregunta guardada correctamente")
  }

  // Manejar carga de imagen (input file)
  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setNewQuestion((prev) => ({
        ...prev,
        image: reader.result as string,
      }))
    }
    reader.readAsDataURL(file)
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
            onChange={(e) => setNewQuestion((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Escribe un título descriptivo"
            className="dark:bg-slate-700"
            aria-required="true"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="question-description" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Enunciado o Descripción
          </label>
          <Textarea
            id="question-description"
            value={newQuestion.description}
            onChange={(e) => setNewQuestion((prev) => ({ ...prev, description: e.target.value }))}
            rows={3}
            placeholder="Describe la pregunta o actividad"
            className="dark:bg-slate-700"
            aria-required="true"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Tipo de Actividad</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "order-words", icon: <TextCursorInput size={24} />, title: "Ordenar Palabras", desc: "Los usuarios ordenarán palabras para formar una oración correcta" },
              { key: "order-shapes", icon: <Shapes size={24} />, title: "Ordenar Figuras", desc: "Los usuarios ordenarán figuras según un criterio específico" },
              { key: "drawing", icon: <Pencil size={24} />, title: "Dibujar", desc: "Los usuarios dibujarán algo según las instrucciones" },
              { key: "incoherence", icon: <FileSearch size={24} />, title: "Detectar Incoherencias", desc: "Los usuarios identificarán y corregirán incoherencias en oraciones" },
            ].map(({ key, icon, title, desc }) => (
              <div
                key={key}
                onClick={() => setNewQuestion((prev) => ({ ...prev, type: key as Question["type"] }))}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  newQuestion.type === key
                    ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setNewQuestion((prev) => ({ ...prev, type: key as Question["type"] }))
                  }
                }}
                aria-pressed={newQuestion.type === key}
                aria-label={`Seleccionar tipo de actividad: ${title}`}
              >
                <div className="flex items-center">
                  <div className="text-teal-600 dark:text-teal-400 mr-3">{icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">{title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contenido específico según el tipo */}
        {newQuestion.type === "order-words" && (
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Palabras para ordenar</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {newQuestion.words.map((word, index) => (
                <div
                  key={`${word}-${index}`}
                  className="bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 px-3 py-1 rounded-lg flex items-center"
                >
                  {word}
                  <button
                    onClick={() => removeWord(index)}
                    className="ml-2 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200"
                    aria-label={`Eliminar palabra ${word}`}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addWord()
                  }
                }}
                aria-label="Campo para añadir palabra"
              />
              <Button onClick={addWord} className="rounded-l-none bg-teal-600 hover:bg-teal-700" aria-label="Añadir palabra">
                Añadir
              </Button>
            </div>
            <div className="mt-4">
              <label htmlFor="correct-order" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                Orden correcto
              </label>
              <Input
                id="correct-order"
                value={newQuestion.correctOrder}
                onChange={(e) => setNewQuestion((prev) => ({ ...prev, correctOrder: e.target.value }))}
                className="dark:bg-slate-700"
                placeholder="Escribe la oración correcta"
                aria-required="true"
              />
            </div>
          </div>
        )}

        {newQuestion.type === "incoherence" && (
          <div className="mb-6">
            <label htmlFor="incoherent-text" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
              Oración con incoherencias
            </label>
            <Textarea
              id="incoherent-text"
              value={newQuestion.incoherentText}
              onChange={(e) => setNewQuestion((prev) => ({ ...prev, incoherentText: e.target.value }))}
              rows={3}
              className="dark:bg-slate-700"
              placeholder="Escribe una oración con incoherencias (ej: 'El perro vuela el piano')"
              aria-required="true"
            />
            <div className="mt-4">
              <label htmlFor="correct-text" className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                Versión correcta
              </label>
              <Textarea
                id="correct-text"
                value={newQuestion.correctText}
                onChange={(e) => setNewQuestion((prev) => ({ ...prev, correctText: e.target.value }))}
                rows={3}
                className="dark:bg-slate-700"
                placeholder="Escribe la versión correcta de la oración"
                aria-required="true"
              />
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">Imagen (opcional)</label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer">
            {!newQuestion.image ? (
              <>
                <div className="flex flex-col items-center">
                  <ImageIcon size={40} className="text-gray-400 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">Arrastra una imagen o haz clic para seleccionar</p>
                  <label
                    htmlFor="image-upload"
                    className="inline-block cursor-pointer rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Seleccionar Imagen
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    className="hidden"
                  />
                </div>
              </>
            ) : (
              <div className="relative inline-block">
                <img
                  src={newQuestion.image}
                  alt="Previsualización de imagen"
                  className="max-h-40 rounded-md mx-auto"
                />
                <button
                  onClick={() => setNewQuestion((prev) => ({ ...prev, image: null }))}
                  className="absolute top-1 right-1 bg-red-600 rounded-full p-1 text-white hover:bg-red-700"
                  aria-label="Eliminar imagen seleccionada"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={saveQuestion}
          disabled={!isQuestionValid}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed"
          aria-disabled={!isQuestionValid}
        >
          Guardar Pregunta
        </Button>
      </div>
    </div>
  )
}
