"use client"

import { useState, useCallback, ChangeEvent, useMemo } from "react"
import { TextCursorInput, Shapes, Image, X, Plus, Circle, Square, Triangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"


// Tipos de figuras disponibles
const SHAPE_TYPES = [
  { id: 'circle', name: 'Círculo', icon: Circle, color: '#3B82F6' },
  { id: 'square', name: 'Cuadrado', icon: Square, color: '#EF4444' },
  { id: 'triangle', name: 'Triángulo', icon: Triangle, color: '#10B981' },
  { id: 'rectangle', name: 'Rectángulo', color: '#F59E0B' },
  { id: 'diamond', name: 'Rombo', color: '#8B5CF6' },
  { id: 'pentagon', name: 'Pentágono', color: '#EC4899' },
  { id: 'hexagon', name: 'Hexágono', color: '#06B6D4' },
  { id: 'star', name: 'Estrella', color: '#F97316' }
]

// Componente para renderizar figuras SVG
const ShapeRenderer = ({ shapeId, size = 40, color }: { shapeId: string, size?: number, color?: string }) => {
  const shapeColor = color || SHAPE_TYPES.find(s => s.id === shapeId)?.color || '#6B7280'
  
  const shapes = {
    circle: (
      <circle cx={size/2} cy={size/2} r={size/2 - 2} fill={shapeColor} stroke="white" strokeWidth="2" />
    ),
    square: (
      <rect x="2" y="2" width={size-4} height={size-4} fill={shapeColor} stroke="white" strokeWidth="2" />
    ),
    triangle: (
      <polygon points={`${size/2},4 ${size-4},${size-4} 4,${size-4}`} fill={shapeColor} stroke="white" strokeWidth="2" />
    ),
    rectangle: (
      <rect x="2" y="8" width={size-4} height={size-16} fill={shapeColor} stroke="white" strokeWidth="2" />
    ),
    diamond: (
      <polygon points={`${size/2},4 ${size-4},${size/2} ${size/2},${size-4} 4,${size/2}`} fill={shapeColor} stroke="white" strokeWidth="2" />
    ),
    pentagon: (
      <polygon points={`${size/2},4 ${size-4},${size/3} ${size-8},${size-4} 8,${size-4} 4,${size/3}`} fill={shapeColor} stroke="white" strokeWidth="2" />
    ),
    hexagon: (
      <polygon points={`${size/4},6 ${size*3/4},6 ${size-4},${size/2} ${size*3/4},${size-6} ${size/4},${size-6} 4,${size/2}`} fill={shapeColor} stroke="white" strokeWidth="2" />
    ),
    star: (
      <polygon points={`${size/2},4 ${size*0.6},${size*0.35} ${size-4},${size*0.35} ${size*0.7},${size*0.6} ${size*0.8},${size-4} ${size/2},${size*0.75} ${size*0.2},${size-4} ${size*0.3},${size*0.6} 4,${size*0.35} ${size*0.4},${size*0.35}`} fill={shapeColor} stroke="white" strokeWidth="2" />
    )
  }
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {shapes[shapeId as keyof typeof shapes]}
    </svg>
  )
}

// Tipo actualizado para soportar múltiples respuestas
interface Question {
  title: string
  description: string
  type: "order-words" | "order-shapes" | "drawing" | "incoherence"
  words: string[]
  shapes: { id: string, name: string, color: string }[] // Nueva propiedad para figuras
  correctOrders: string[] // Cambio: ahora es un array de respuestas correctas
  incoherentText: string
  correctText: string
  image: string | null
  feedbackCorrect: string
  feedbackIncorrect: string
}

interface CreateQuestionTabProps {
  onSaveQuestion: (question: Question) => void
}

export function CreateQuestionTab({ onSaveQuestion }: CreateQuestionTabProps) {
  const [newQuestion, setNewQuestion] = useState<Question>({
    title: "",
    description: "",
    type: "order-words",
    words: [],
    shapes: [], // Nueva propiedad inicializada
    correctOrders: [""], // Cambio: inicializar con un array con una respuesta vacía
    incoherentText: "",
    correctText: "",
    image: null,
    feedbackCorrect: "¡Muy bien! Has respondido correctamente.",
    feedbackIncorrect: "Intenta de nuevo. Revisa tu respuesta.",
  })

  const [newWordInput, setNewWordInput] = useState("")
  const [selectedShapeType, setSelectedShapeType] = useState(SHAPE_TYPES[0])
  const [mensaje, setMensaje] = useState("")

  // Corregir la validación usando useMemo para mejor rendimiento
  const isQuestionValid = useMemo(() => {
    console.log('Validando pregunta:', newQuestion) // Para debug
    
    // Validaciones básicas comunes
    if (!newQuestion.title.trim() || !newQuestion.description.trim()) {
      console.log('Falta título o descripción')
      return false
    }
    
    if (newQuestion.type === "order-words") {
      // Validar que hay al menos 3 palabras
      if (newQuestion.words.length < 3) {
        console.log('Faltan palabras, actual:', newQuestion.words.length)
        return false
      }
      
      // Validar que hay al menos una respuesta correcta válida (no vacía)
      const hasValidOrder = newQuestion.correctOrders.some(order => order.trim().length > 0)
      console.log('Tiene orden válido:', hasValidOrder, newQuestion.correctOrders)
      return hasValidOrder
    }
    
    if (newQuestion.type === "order-shapes") {
      // Validar que hay al menos 3 figuras
      if (newQuestion.shapes.length < 3) {
        console.log('Faltan figuras, actual:', newQuestion.shapes.length)
        return false
      }
      
      // Validar que hay al menos una respuesta correcta válida (no vacía)
      const hasValidOrder = newQuestion.correctOrders.some(order => order.trim().length > 0)
      console.log('Tiene orden válido:', hasValidOrder, newQuestion.correctOrders)
      return hasValidOrder
    }
    
    if (newQuestion.type === "incoherence") {
      const isValid = newQuestion.incoherentText.trim().length > 0 && newQuestion.correctText.trim().length > 0
      console.log('Validación incoherence:', isValid)
      return isValid
    }
    
    if (newQuestion.type === "drawing") {
      // Para estos tipos, solo validamos título y descripción
      return true
    }
    
    return false
  }, [newQuestion])

  const addWord = useCallback(() => {
    const trimmed = newWordInput.trim()
    if (trimmed && !newQuestion.words.includes(trimmed)) { // Evitar duplicados
      setNewQuestion((prev) => ({
        ...prev,
        words: [...prev.words, trimmed],
      }))
      setNewWordInput("")
    }
  }, [newWordInput, newQuestion.words])

  const removeWord = useCallback((index: number) => {
    setNewQuestion((prev) => {
      const updatedWords = [...prev.words]
      updatedWords.splice(index, 1)
      return { ...prev, words: updatedWords }
    })
  }, [])

  // Nuevas funciones para manejar figuras
  const addShape = useCallback(() => {
    // Removemos la validación de duplicados para permitir figuras repetidas
    setNewQuestion((prev) => ({
      ...prev,
      shapes: [...prev.shapes, { 
        id: selectedShapeType.id, 
        name: selectedShapeType.name, 
        color: selectedShapeType.color 
      }],
    }))
  }, [selectedShapeType])

  const removeShape = useCallback((index: number) => {
    setNewQuestion((prev) => {
      const updatedShapes = [...prev.shapes]
      updatedShapes.splice(index, 1)
      return { ...prev, shapes: updatedShapes }
    })
  }, [])

  // Nueva función para agregar una respuesta correcta adicional
  const addCorrectOrder = useCallback(() => {
    setNewQuestion((prev) => ({
      ...prev,
      correctOrders: [...prev.correctOrders, ""],
    }))
  }, [])

  // Nueva función para actualizar una respuesta correcta específica
  const updateCorrectOrder = useCallback((index: number, value: string) => {
    setNewQuestion((prev) => {
      const updatedOrders = [...prev.correctOrders]
      updatedOrders[index] = value
      return { ...prev, correctOrders: updatedOrders }
    })
  }, [])

  // Nueva función para eliminar una respuesta correcta
  const removeCorrectOrder = useCallback((index: number) => {
    setNewQuestion((prev) => {
      if (prev.correctOrders.length <= 1) return prev // Mantener al menos una respuesta
      
      const updatedOrders = [...prev.correctOrders]
      updatedOrders.splice(index, 1)
      return { ...prev, correctOrders: updatedOrders }
    })
  }, [])

  const saveQuestion = useCallback(() => {
    console.log('Intentando guardar pregunta, válida:', isQuestionValid)
    
    if (!isQuestionValid) {
      let errorMessage = "Por favor, completa todos los campos requeridos."
      
      if (!newQuestion.title.trim()) {
        errorMessage = "El título es requerido."
      } else if (!newQuestion.description.trim()) {
        errorMessage = "La descripción es requerida."
      } else if (newQuestion.type === "order-words") {
        if (newQuestion.words.length < 3) {
          errorMessage = "Se necesitan al menos 3 palabras para ordenar."
        } else if (!newQuestion.correctOrders.some(order => order.trim().length > 0)) {
          errorMessage = "Se necesita al menos una respuesta correcta."
        }
      } else if (newQuestion.type === "order-shapes") {
        if (newQuestion.shapes.length < 3) {
          errorMessage = "Se necesitan al menos 3 figuras para ordenar."
        } else if (!newQuestion.correctOrders.some(order => order.trim().length > 0)) {
          errorMessage = "Se necesita al menos una respuesta correcta."
        }
      } else if (newQuestion.type === "incoherence") {
        if (!newQuestion.incoherentText.trim()) {
          errorMessage = "El texto con incoherencias es requerido."
        } else if (!newQuestion.correctText.trim()) {
          errorMessage = "El texto correcto es requerido."
        }
      }
      
      setMensaje(errorMessage)
      setTimeout(() => setMensaje(""), 5000)
      return
    }

    try {
      // Filtrar respuestas vacías antes de guardar
      const filteredQuestion = {
        ...newQuestion,
        correctOrders: newQuestion.correctOrders.filter(order => order.trim().length > 0)
      }

      console.log('Guardando pregunta:', filteredQuestion)
      onSaveQuestion(filteredQuestion)

      // Resetear el formulario
      setNewQuestion({
        title: "",
        description: "",
        type: "order-words",
        words: [],
        shapes: [],
        correctOrders: [""],
        incoherentText: "",
        correctText: "",
        image: null,
        feedbackCorrect: "¡Muy bien! Has respondido correctamente.",
        feedbackIncorrect: "Intenta de nuevo. Revisa tu respuesta.",
      })
      setNewWordInput("")
      setMensaje("✅ Pregunta guardada correctamente")
      setTimeout(() => setMensaje(""), 3000)
    } catch (error) {
      console.error('Error al guardar pregunta:', error)
      setMensaje("❌ Error al guardar la pregunta. Inténtalo de nuevo.")
      setTimeout(() => setMensaje(""), 5000)
    }
  }, [isQuestionValid, newQuestion, onSaveQuestion])

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamaño del archivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMensaje("❌ La imagen debe ser menor a 5MB")
      setTimeout(() => setMensaje(""), 3000)
      return
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setMensaje("❌ Solo se permiten archivos de imagen")
      setTimeout(() => setMensaje(""), 3000)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setNewQuestion((prev) => ({
        ...prev,
        image: reader.result as string,
      }))
    }
    reader.onerror = () => {
      setMensaje("❌ Error al cargar la imagen")
      setTimeout(() => setMensaje(""), 3000)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Crear Nueva Pregunta</h2>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-8">
        <div className="mb-6">
          <label className="block mb-2 font-medium">Título de la Pregunta *</label>
          <Input
            value={newQuestion.title}
            onChange={(e) => setNewQuestion((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Escribe un título descriptivo"
            className={!newQuestion.title.trim() ? "border-red-300" : ""}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">Enunciado o Descripción *</label>
          <Textarea
            value={newQuestion.description}
            onChange={(e) => setNewQuestion((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Describe la pregunta o actividad"
            rows={3}
            className={!newQuestion.description.trim() ? "border-red-300" : ""}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">Tipo de Actividad</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "order-words", icon: <TextCursorInput size={24} />, title: "Ordenar Palabras" },
              { key: "order-shapes", icon: <Shapes size={24} />, title: "Ordenar Figuras" },
            ].map(({ key, icon, title }) => (
              <div
                key={key}
                onClick={() => {
                  setNewQuestion((prev) => ({ 
                    ...prev, 
                    type: key as Question["type"],
                    // Limpiar campos específicos cuando cambie el tipo
                    words: key === "order-words" ? prev.words : [],
                    shapes: key === "order-shapes" ? prev.shapes : [],
                    correctOrders: [""],
                    incoherentText: key === "incoherence" ? prev.incoherentText : "",
                    correctText: key === "incoherence" ? prev.correctText : ""
                  }))
                }}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  newQuestion.type === key 
                    ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20" 
                    : "border-gray-300 dark:border-gray-600 hover:border-teal-300"
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
              <label className="block mb-2 font-medium">
                Palabras para ordenar * 
                <span className="text-sm text-gray-500">(mínimo 3 palabras)</span>
              </label>
              <div className="flex gap-2 flex-wrap mb-2">
                {newQuestion.words.map((word, i) => (
                  <div key={i} className="bg-teal-100 dark:bg-teal-800 px-3 py-1 rounded flex items-center">
                    {word}
                    <button onClick={() => removeWord(i)} className="ml-2 text-red-500 hover:text-red-700">
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
                <Button 
                  onClick={addWord} 
                  disabled={!newWordInput.trim()}
                  className="rounded-l-none bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
                >
                  Añadir
                </Button>
              </div>
              {newQuestion.words.length < 3 && (
                <p className="text-sm text-orange-600 mt-1">
                  Palabras agregadas: {newQuestion.words.length}/3 (mínimo)
                </p>
              )}
            </div>

            {/* Sección actualizada para múltiples respuestas correctas */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block font-medium">
                  Respuestas Correctas *
                  <span className="text-sm text-gray-500">(al menos una)</span>
                </label>
                <Button
                  type="button"
                  onClick={addCorrectOrder}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Plus size={16} />
                  Agregar Respuesta
                </Button>
              </div>
              
              <div className="space-y-3">
                {newQuestion.correctOrders.map((order, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <Input
                        value={order}
                        onChange={(e) => updateCorrectOrder(index, e.target.value)}
                        placeholder={`Respuesta correcta ${index + 1}`}
                        className={!order.trim() && index === 0 ? "border-red-300" : ""}
                      />
                    </div>
                    {newQuestion.correctOrders.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeCorrectOrder(index)}
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Puedes agregar múltiples respuestas correctas. El estudiante puede responder con cualquiera de ellas.
              </p>
            </div>
          </>
        )}

        {newQuestion.type === "order-shapes" && (
          <>
            <div className="mb-4">
              <label className="block mb-2 font-medium">
                Figuras para ordenar * 
                <span className="text-sm text-gray-500">(mínimo 3 figuras)</span>
              </label>
              
              {/* Selector de tipo de figura */}
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Seleccionar figura:</label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-3">
                  {SHAPE_TYPES.map((shapeType) => (
                <div
                  key={shapeType.id}
                  onClick={() => setSelectedShapeType(shapeType)}
                  className={`border rounded-lg p-2 cursor-pointer transition-colors flex flex-col items-center gap-1 ${
                    selectedShapeType.id === shapeType.id
                      ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-teal-300"
                  }`}
                >
                  <ShapeRenderer shapeId={shapeType.id} size={24} color={shapeType.color} />
                  <span className="text-xs text-center">{shapeType.name}</span>
                </div>
              ))}

                </div>
                
                <Button 
                  onClick={addShape}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Añadir {selectedShapeType.name}
                </Button>
              </div>

              {/* Figuras añadidas */}
              <div className="flex gap-2 flex-wrap mb-2">
                {newQuestion.shapes.map((shape, i) => (
                  <div key={i} className="bg-teal-100 dark:bg-teal-800 px-3 py-2 rounded flex items-center gap-2">
                    <ShapeRenderer shapeId={shape.id} size={20} />
                    <span className="text-sm">{shape.name}</span>
                    <button onClick={() => removeShape(i)} className="ml-1 text-red-500 hover:text-red-700">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              
              {newQuestion.shapes.length < 3 && (
                <p className="text-sm text-orange-600 mt-1">
                  Figuras agregadas: {newQuestion.shapes.length}/3 (mínimo)
                </p>
              )}
            </div>

            {/* Sección para múltiples respuestas correctas de figuras */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block font-medium">
                  Respuestas Correctas *
                  <span className="text-sm text-gray-500">(al menos una)</span>
                </label>
                <Button
                  type="button"
                  onClick={addCorrectOrder}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Plus size={16} />
                  Agregar Respuesta
                </Button>
              </div>
              
              <div className="space-y-3">
                {newQuestion.correctOrders.map((order, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <Input
                        value={order}
                        onChange={(e) => updateCorrectOrder(index, e.target.value)}
                        placeholder={`Ej: Círculo, Cuadrado, Triángulo (respuesta ${index + 1})`}
                        className={!order.trim() && index === 0 ? "border-red-300" : ""}
                      />
                    </div>
                    {newQuestion.correctOrders.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeCorrectOrder(index)}
                        size="sm"
                        variant="outline"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Especifica el orden correcto usando los nombres de las figuras. Puedes agregar múltiples respuestas correctas.
              </p>
            </div>
          </>
        )}

        {newQuestion.type === "incoherence" && (
          <>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Texto con Incoherencias *</label>
              <Textarea
                value={newQuestion.incoherentText}
                onChange={(e) => setNewQuestion((prev) => ({ ...prev, incoherentText: e.target.value }))}
                placeholder="Escribe el texto que contiene incoherencias"
                rows={4}
                className={!newQuestion.incoherentText.trim() ? "border-red-300" : ""}
              />
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 font-medium">Texto Correcto *</label>
              <Textarea
                value={newQuestion.correctText}
                onChange={(e) => setNewQuestion((prev) => ({ ...prev, correctText: e.target.value }))}
                placeholder="Escribe el texto corregido"
                rows={4}
                className={!newQuestion.correctText.trim() ? "border-red-300" : ""}
              />
            </div>
          </>
        )}

        <div className="mb-6">
          <label className="block font-medium mb-2">Imagen (opcional)</label>
          {!newQuestion.image ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 text-center rounded-lg hover:border-teal-400 transition-colors">
              <Image className="mx-auto mb-2 text-gray-400" />
              <label className="cursor-pointer text-blue-600 hover:text-blue-800">
                Seleccionar Imagen
                <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
              </label>
            </div>
          ) : (
            <div className="relative inline-block">
              <img src={newQuestion.image} className="max-h-40 mx-auto rounded-md" alt="Imagen de la pregunta" />
              <button
                onClick={() => setNewQuestion((prev) => ({ ...prev, image: null }))}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-2 font-medium">Mensaje de Respuesta Correcta</label>
            <Textarea
              value={newQuestion.feedbackCorrect}
              onChange={(e) => setNewQuestion((prev) => ({ ...prev, feedbackCorrect: e.target.value }))}
              placeholder="Mensaje cuando la respuesta es correcta"
              rows={2}
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Mensaje de Respuesta Incorrecta</label>
            <Textarea
              value={newQuestion.feedbackIncorrect}
              onChange={(e) => setNewQuestion((prev) => ({ ...prev, feedbackIncorrect: e.target.value }))}
              placeholder="Mensaje cuando la respuesta es incorrecta"
              rows={2}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={saveQuestion}
            disabled={!isQuestionValid}
            className={`w-full font-medium py-3 transition-all ${
              isQuestionValid 
                ? "bg-teal-600 hover:bg-teal-700 text-white" 
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
          >
            {isQuestionValid ? "Guardar Pregunta" : "Completar campos requeridos"}
          </Button>

          {/* Debug info - remover en producción */}
          <div className="text-xs text-gray-500 p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <p>Estado de validación: {isQuestionValid ? "✅ Válido" : "❌ Inválido"}</p>
            <p>Título: {newQuestion.title.trim() ? "✅" : "❌"}</p>
            <p>Descripción: {newQuestion.description.trim() ? "✅" : "❌"}</p>
            {newQuestion.type === "order-words" && (
              <>
                <p>Palabras: {newQuestion.words.length}/3 {newQuestion.words.length >= 3 ? "✅" : "❌"}</p>
                <p>Respuestas: {newQuestion.correctOrders.filter(o => o.trim()).length > 0 ? "✅" : "❌"}</p>
              </>
            )}
            {newQuestion.type === "order-shapes" && (
              <>
                <p>Figuras: {newQuestion.shapes.length}/3 {newQuestion.shapes.length >= 3 ? "✅" : "❌"}</p>
                <p>Respuestas: {newQuestion.correctOrders.filter(o => o.trim()).length > 0 ? "✅" : "❌"}</p>
              </>
            )}
          </div>
        </div>

        {mensaje && (
          <div className={`text-center mt-4 p-3 rounded-md ${
            mensaje.includes('✅') 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
              : mensaje.includes('❌')
              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
          }`}>
            <p className="text-sm font-medium">{mensaje}</p>
          </div>
        )}
      </div>
    </div>
  )
}