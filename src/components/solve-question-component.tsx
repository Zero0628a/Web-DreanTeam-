"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Circle, Square, Triangle, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

// Shape types matching the create component
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

// Shape renderer component
const ShapeRenderer = ({ shapeId, size = 40, color, opacity = 1 }: { 
  shapeId: string, 
  size?: number, 
  color?: string, 
  opacity?: number 
}) => {
  const shapeColor = color || SHAPE_TYPES.find(s => s.id === shapeId)?.color || '#6B7280'
  
  const shapes = {
    circle: (
      <circle cx={size/2} cy={size/2} r={size/2 - 2} fill={shapeColor} stroke="white" strokeWidth="2" opacity={opacity} />
    ),
    square: (
      <rect x="2" y="2" width={size-4} height={size-4} fill={shapeColor} stroke="white" strokeWidth="2" opacity={opacity} />
    ),
    triangle: (
      <polygon points={`${size/2},4 ${size-4},${size-4} 4,${size-4}`} fill={shapeColor} stroke="white" strokeWidth="2" opacity={opacity} />
    ),
    rectangle: (
      <rect x="2" y="8" width={size-4} height={size-16} fill={shapeColor} stroke="white" strokeWidth="2" opacity={opacity} />
    ),
    diamond: (
      <polygon points={`${size/2},4 ${size-4},${size/2} ${size/2},${size-4} 4,${size/2}`} fill={shapeColor} stroke="white" strokeWidth="2" opacity={opacity} />
    ),
    pentagon: (
      <polygon points={`${size/2},4 ${size-4},${size/3} ${size-8},${size-4} 8,${size-4} 4,${size/3}`} fill={shapeColor} stroke="white" strokeWidth="2" opacity={opacity} />
    ),
    hexagon: (
      <polygon points={`${size/4},6 ${size*3/4},6 ${size-4},${size/2} ${size*3/4},${size-6} ${size/4},${size-6} 4,${size/2}`} fill={shapeColor} stroke="white" strokeWidth="2" opacity={opacity} />
    ),
    star: (
      <polygon points={`${size/2},4 ${size*0.6},${size*0.35} ${size-4},${size*0.35} ${size*0.7},${size*0.6} ${size*0.8},${size-4} ${size/2},${size*0.75} ${size*0.2},${size-4} ${size*0.3},${size*0.6} 4,${size*0.35} ${size*0.4},${size*0.35}`} fill={shapeColor} stroke="white" strokeWidth="2" opacity={opacity} />
    )
  }
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {shapes[shapeId as keyof typeof shapes]}
    </svg>
  )
}

// Question interface matching the create component
interface Question {
  title: string
  description: string
  type: "order-words" | "order-shapes" | "drawing" | "incoherence"
  words: string[]
  shapes: { id: string, name: string, color: string }[]
  correctOrders: string[]
  incoherentText: string
  correctText: string
  image: string | null
  feedbackCorrect: string
  feedbackIncorrect: string
}

// Draggable item component
const DraggableItem = ({ 
  item, 
  index, 
  onDragStart, 
  onDragEnd, 
  isDragging, 
  isShape = false 
}: {
  item: any
  index: number
  onDragStart: (index: number) => void
  onDragEnd: () => void
  isDragging: boolean
  isShape?: boolean
}) => {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnd={onDragEnd}
      className={`
        cursor-move select-none transition-all duration-200
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
        ${isShape 
          ? 'bg-white dark:bg-slate-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-md hover:shadow-lg' 
          : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg border-2 border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-800'
        }
      `}
    >
      {isShape ? (
        <div className="flex flex-col items-center gap-2">
          <ShapeRenderer shapeId={item.id} size={50} />
          <span className="text-sm font-medium">{item.name}</span>
        </div>
      ) : (
        <span className="font-medium">{item}</span>
      )}
    </div>
  )
}

// Drop zone component
const DropZone = ({ 
  index, 
  onDrop, 
  onDragOver, 
  onDragLeave, 
  item, 
  correctItem, 
  isOver, 
  isShape = false,
  showWatermark = true
}: {
  index: number
  onDrop: (index: number) => void
  onDragOver: (index: number) => void
  onDragLeave: () => void
  item: any
  correctItem: any
  isOver: boolean
  isShape?: boolean
  showWatermark?: boolean
}) => {
  return (
    <div
      onDrop={(e) => {
        e.preventDefault()
        onDrop(index)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        onDragOver(index)
      }}
      onDragLeave={onDragLeave}
      className={`
        relative min-h-[80px] border-2 border-dashed rounded-lg p-4 transition-all duration-200
        ${isOver 
          ? 'border-green-400 bg-green-50 dark:bg-green-900/20' 
          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-700/50'
        }
        ${item ? 'border-solid bg-white dark:bg-slate-700' : ''}
      `}
    >
      {/* Watermark showing correct answer */}
      {showWatermark && !item && correctItem && (
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          {isShape ? (
            <div className="flex flex-col items-center gap-1">
              <ShapeRenderer shapeId={correctItem.id} size={40} opacity={0.3} />
              <span className="text-xs text-gray-500">{correctItem.name}</span>
            </div>
          ) : (
            <span className="text-gray-400 text-sm italic">{correctItem}</span>
          )}
        </div>
      )}
      
      {/* Dropped item */}
      {item && (
        <div className="flex items-center justify-center">
          {isShape ? (
            <div className="flex flex-col items-center gap-2">
              <ShapeRenderer shapeId={item.id} size={50} />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
          ) : (
            <span className="font-medium text-gray-800 dark:text-gray-200">{item}</span>
          )}
        </div>
      )}
      
      {/* Drop zone label */}
      {!item && (
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-400 text-sm">
            Posición {index + 1}
          </span>
        </div>
      )}
    </div>
  )
}

// Main solve question component
export default function SolveQuestionComponent() {
  // Sample question data - in real app this would come from props
  const [sampleQuestion] = useState<Question>({
    title: "Ordena las figuras geométricas",
    description: "Arrastra las figuras para ordenarlas de menor a mayor número de lados",
    type: "order-shapes",
    words: [],
    shapes: [
      { id: 'triangle', name: 'Triángulo', color: '#10B981' },
      { id: 'square', name: 'Cuadrado', color: '#EF4444' },
      { id: 'pentagon', name: 'Pentágono', color: '#EC4899' },
      { id: 'hexagon', name: 'Hexágono', color: '#06B6D4' }
    ],
    correctOrders: ['Triángulo, Cuadrado, Pentágono, Hexágono'],
    incoherentText: "",
    correctText: "",
    image: null,
    feedbackCorrect: "¡Excelente! Has ordenado las figuras correctamente según su número de lados.",
    feedbackIncorrect: "No es correcto. Recuerda ordenar las figuras de menor a mayor número de lados."
  })

  // Component state
  const [currentItems, setCurrentItems] = useState(() => {
    // Shuffle the items initially
    const items = sampleQuestion.type === 'order-shapes' ? sampleQuestion.shapes : sampleQuestion.words
    return [...items].sort(() => Math.random() - 0.5)
  })
  
  const [dropZoneItems, setDropZoneItems] = useState<any[]>([])
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showWatermark, setShowWatermark] = useState(true)
  const [isCorrect, setIsCorrect] = useState(false)

  // Parse correct answer to create target sequence
  const correctSequence = sampleQuestion.correctOrders[0].split(',').map(item => item.trim())
  const correctItems = correctSequence.map(itemName => {
    if (sampleQuestion.type === 'order-shapes') {
      return sampleQuestion.shapes.find(shape => shape.name === itemName)
    } else {
      return itemName
    }
  })

  // Initialize drop zones
  useEffect(() => {
    const itemsToUse = sampleQuestion.type === 'order-shapes' ? sampleQuestion.shapes : sampleQuestion.words
    setDropZoneItems(new Array(itemsToUse.length).fill(null))
  }, [sampleQuestion])

  // Drag and drop handlers
  const handleDragStart = useCallback((index: number) => {
    setDraggedItemIndex(index)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedItemIndex(null)
    setDragOverIndex(null)
  }, [])

  const handleDragOver = useCallback((index: number) => {
    setDragOverIndex(index)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null)
  }, [])

  const handleDrop = useCallback((dropIndex: number) => {
    if (draggedItemIndex === null) return

    const draggedItem = currentItems[draggedItemIndex]
    
    // Remove item from current items
    const newCurrentItems = currentItems.filter((_, index) => index !== draggedItemIndex)
    
    // Add item to drop zone (remove any existing item first)
    const newDropZoneItems = [...dropZoneItems]
    const existingItem = newDropZoneItems[dropIndex]
    
    newDropZoneItems[dropIndex] = draggedItem
    
    // If there was an existing item, add it back to current items
    if (existingItem) {
      newCurrentItems.push(existingItem)
    }
    
    setCurrentItems(newCurrentItems)
    setDropZoneItems(newDropZoneItems)
    setDraggedItemIndex(null)
    setDragOverIndex(null)
  }, [draggedItemIndex, currentItems, dropZoneItems])

  // Check answer
  const checkAnswer = useCallback(() => {
    if (dropZoneItems.some(item => item === null)) {
      alert('Por favor, completa todas las posiciones antes de verificar tu respuesta.')
      return
    }

    const userAnswer = dropZoneItems.map(item => 
      sampleQuestion.type === 'order-shapes' ? item.name : item
    ).join(', ')

    const isAnswerCorrect = sampleQuestion.correctOrders.some(correctOrder => 
      correctOrder.toLowerCase().trim() === userAnswer.toLowerCase().trim()
    )

    setIsCorrect(isAnswerCorrect)
    setShowResult(true)
  }, [dropZoneItems, sampleQuestion])

  // Reset game
  const resetGame = useCallback(() => {
    const items = sampleQuestion.type === 'order-shapes' ? sampleQuestion.shapes : sampleQuestion.words
    setCurrentItems([...items].sort(() => Math.random() - 0.5))
    setDropZoneItems(new Array(items.length).fill(null))
    setShowResult(false)
    setShowWatermark(true)
  }, [sampleQuestion])

  // Toggle watermark
  const toggleWatermark = useCallback(() => {
    setShowWatermark(!showWatermark)
  }, [showWatermark])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
        {/* Question header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            {sampleQuestion.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            {sampleQuestion.description}
          </p>
          
          {/* Question image if available */}
          {sampleQuestion.image && (
            <img 
              src={sampleQuestion.image} 
              alt="Imagen de la pregunta" 
              className="max-h-60 mx-auto rounded-lg shadow-md mb-4"
            />
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <Button
            onClick={toggleWatermark}
            variant="outline"
            className="flex items-center gap-2"
          >
            {showWatermark ? '👁️ Ocultar Ayuda' : '👁️ Mostrar Ayuda'}
          </Button>
          <Button
            onClick={resetGame}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Reiniciar
          </Button>
        </div>

        {/* Game area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available items */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Elementos Disponibles
            </h3>
            <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg min-h-[200px]">
              {currentItems.map((item, index) => (
                <DraggableItem
                  key={`${sampleQuestion.type}-${index}-${item.id || item}`}
                  item={item}
                  index={index}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedItemIndex === index}
                  isShape={sampleQuestion.type === 'order-shapes'}
                />
              ))}
            </div>
          </div>

          {/* Drop zones */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Orden Correcto
            </h3>
            <div className="space-y-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              {dropZoneItems.map((item, index) => (
                <DropZone
                  key={`dropzone-${index}`}
                  index={index}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  item={item}
                  correctItem={correctItems[index]}
                  isOver={dragOverIndex === index}
                  isShape={sampleQuestion.type === 'order-shapes'}
                  showWatermark={showWatermark}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={checkAnswer}
            disabled={dropZoneItems.some(item => item === null)}
            className="px-8 py-3 text-lg font-semibold bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verificar Respuesta
          </Button>
        </div>

        {/* Result feedback */}
        {showResult && (
          <div className={`mt-8 p-6 rounded-lg text-center ${
            isCorrect 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' 
              : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
          }`}>
            <div className="flex items-center justify-center gap-3 mb-3">
              {isCorrect ? (
                <CheckCircle size={32} className="text-green-600" />
              ) : (
                <XCircle size={32} className="text-red-600" />
              )}
              <h3 className="text-xl font-bold">
                {isCorrect ? '¡Correcto!' : 'Incorrecto'}
              </h3>
            </div>
            <p className="text-lg">
              {isCorrect ? sampleQuestion.feedbackCorrect : sampleQuestion.feedbackIncorrect}
            </p>
            {!isCorrect && (
              <p className="mt-2 text-sm opacity-80">
                Respuesta correcta: {sampleQuestion.correctOrders[0]}
              </p>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
            Instrucciones:
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Arrastra los elementos desde la izquierda hacia las posiciones correctas a la derecha</li>
            <li>• Las marcas de agua te muestran la respuesta correcta como guía (puedes ocultarlas)</li>
            <li>• Puedes intercambiar elementos arrastrando uno sobre otro</li>
            <li>• Completa todas las posiciones antes de verificar tu respuesta</li>
          </ul>
        </div>
      </div>
    </div>
  )
}