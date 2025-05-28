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
  const [mensaje, setMensaje] = useState("")

  const isQuestionValid = (() => {
    if (!newQuestion.title.trim() || !newQuestion.description.trim()) return false
    if (newQuestion.type === "order-words") {
      return newQuestion.words.length >= 3 && newQuestion.correctOrder.trim().length > 0
    }
    if (newQuestion.type === "incoherence") {
      return newQuestion.incoherentText.trim().length > 0 && newQuestion.correctText.trim().length > 0
    }
    return true
  })()

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

  const removeWord = useCallback((index: number) => {
    setNewQuestion((prev) => {
      const updatedWords = [...prev.words]
      updatedWords.splice(index, 1)
      return { ...prev, words: updatedWords }
    })
  }, [])

  const saveQuestion = () => {
    if (!isQuestionValid) {
      setMensaje("Por favor, completa todos los campos requeridos.")
      return
    }

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
    setMensaje("✅ Pregunta guardada correctamente")
    setTimeout(() => setMensaje(""), 3000)
  }

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
          <label className="block mb-2 font-medium">Título de la Pregunta</label>
          <Input
            value={newQuestion.title}
            onChange={(e) => setNewQuestion((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Escribe un título descriptivo"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">Enunciado o Descripción</label>
          <Textarea
            value={newQuestion.description}
            onChange={(e) => setNewQuestion((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Describe la pregunta o actividad"
            rows={3}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">Tipo de Actividad</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "order-words", icon: <TextCursorInput size={24} />, title: "Ordenar Palabras" },
              { key: "order-shapes", icon: <Shapes size={24} />, title: "Ordenar Figuras" },
              { key: "drawing", icon: <Pencil size={24} />, title: "Dibujar" },
              { key: "incoherence", icon: <FileSearch size={24} />, title: "Detectar Incoherencias" },
            ].map(({ key, icon, title }) => (
              <div
                key={key}
                onClick={() => setNewQuestion((prev) => ({ ...prev, type: key as Question["type"] }))}
                className={`border rounded-lg p-4 cursor-pointer ${
                  newQuestion.type === key ? "border-teal-500 bg-teal-50" : "border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">{icon} <span>{title}</span></div>
              </div>
            ))}
          </div>
        </div>

        {newQuestion.type === "order-words" && (
          <>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Palabras para ordenar</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {newQuestion.words.map((word, i) => (
                  <div key={i} className="bg-teal-100 px-3 py-1 rounded flex items-center">
                    {word}
                    <button onClick={() => removeWord(i)} className="ml-2 text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <Input
                  value={newWordInput}
                  onChange={(e) => setNewWordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addWord()
                    }
                  }}
                  placeholder="Añadir palabra"
                  className="rounded-r-none"
                />
                <Button onClick={addWord} className="rounded-l-none bg-teal-600 hover:bg-teal-700">
                  Añadir
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium">Orden correcto</label>
              <Input
                value={newQuestion.correctOrder}
                onChange={(e) => setNewQuestion((prev) => ({ ...prev, correctOrder: e.target.value }))}
                placeholder="Escribe la oración correcta"
              />
            </div>
          </>
        )}

        <div className="mb-6">
          <label className="block font-medium mb-2">Imagen (opcional)</label>
          {!newQuestion.image ? (
            <div className="border-2 border-dashed p-4 text-center">
              <ImageIcon className="mx-auto mb-2" />
              <label className="cursor-pointer text-blue-600">
                Seleccionar Imagen
                <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
              </label>
            </div>
          ) : (
            <div className="relative">
              <img src={newQuestion.image} className="max-h-40 mx-auto rounded-md" />
              <button
                onClick={() => setNewQuestion((prev) => ({ ...prev, image: null }))}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <Button
          onClick={saveQuestion}
          disabled={!isQuestionValid}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60"
        >
          Guardar Pregunta
        </Button>

        {mensaje && (
          <p className="text-center mt-4 text-sm font-medium text-teal-700">{mensaje}</p>
        )}
      </div>
    </div>
  )
}