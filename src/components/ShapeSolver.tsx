"use client";

import { useState } from "react";
import { CheckCircle, XCircle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Definición de tipos para las props
interface ShapeSolverProps {
  shapes: string[];
  correctOrders: string[];
  feedbackCorrect: string;
  feedbackIncorrect: string;
  onSolved: (isCorrect: boolean) => void;
}

export function ShapeSolver({
  shapes,
  correctOrders,
  feedbackCorrect,
  feedbackIncorrect,
  onSolved,
}: ShapeSolverProps) {
  // Estados del componente
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);
  const [attempts, setAttempts] = useState(0);

  // Manejar selección/deselección de figuras
  const handleSelectShape = (shape: string) => {
    if (selectedShapes.includes(shape)) {
      // Deseleccionar si ya está seleccionada
      setSelectedShapes(selectedShapes.filter((s) => s !== shape));
    } else {
      // Seleccionar si no está en la lista
      setSelectedShapes([...selectedShapes, shape]);
    }
  };

  // Verificar la solución
  const checkSolution = () => {
    const userAnswer = selectedShapes.join(" ");
    const isCorrect = correctOrders.some((order) => order === userAnswer);

    setFeedback({
      correct: isCorrect,
      message: isCorrect ? feedbackCorrect : feedbackIncorrect,
    });
    
    setAttempts(attempts + 1);
    onSolved(isCorrect);
  };

  // Reiniciar el ejercicio
  const resetExercise = () => {
    setSelectedShapes([]);
    setFeedback(null);
  };

  // Verificar si todas las figuras están seleccionadas
  const allShapesSelected = selectedShapes.length === shapes.length;

  return (
    <div className="space-y-6">
      {/* Instrucciones */}
      <div className="prose dark:prose-invert">
        <p>Selecciona las figuras en el orden correcto:</p>
      </div>

      {/* Figuras disponibles */}
      <div className="grid grid-cols-4 gap-3">
        {shapes.map((shape, index) => {
          const isSelected = selectedShapes.includes(shape);
          return (
            <button
              key={`shape-${index}`}
              onClick={() => handleSelectShape(shape)}
              className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                isSelected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                  : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400"
              }`}
              disabled={isSelected && !selectedShapes.includes(shape)}
            >
              <ShapeRenderer shapeId={shape} size={40} />
              <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                {SHAPE_TYPES.find((s) => s.id === shape)?.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orden seleccionado */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
          Tu orden seleccionado:
        </p>
        {selectedShapes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedShapes.map((shape, index) => (
              <div
                key={`selected-${index}`}
                className="p-2 bg-white dark:bg-gray-700 rounded-md shadow-sm flex flex-col items-center"
              >
                <ShapeRenderer shapeId={shape} size={30} />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Haz clic en las figuras para seleccionarlas
          </p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={checkSolution}
          disabled={!allShapesSelected}
          className="flex-1"
          variant={allShapesSelected ? "default" : "secondary"}
        >
          Comprobar respuesta
        </Button>
        
        <Button
          onClick={resetExercise}
          variant="outline"
          className="flex-1"
          disabled={selectedShapes.length === 0}
        >
          <RotateCw className="mr-2 h-4 w-4" />
          Reiniciar
        </Button>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-lg border ${
            feedback.correct
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          }`}
        >
          <div className="flex items-start gap-3">
            {feedback.correct ? (
              <CheckCircle className="h-5 w-5 mt-0.5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="h-5 w-5 mt-0.5 text-red-600 dark:text-red-400" />
            )}
            <div>
              <p
                className={`font-medium ${
                  feedback.correct
                    ? "text-green-800 dark:text-green-200"
                    : "text-red-800 dark:text-red-200"
                }`}
              >
                {feedback.correct ? "¡Correcto!" : "¡Incorrecto!"}
              </p>
              <p
                className={`${
                  feedback.correct
                    ? "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
                }`}
              >
                {feedback.message}
              </p>
              {!feedback.correct && attempts > 0 && (
                <p className="text-xs mt-2 text-red-600 dark:text-red-400">
                  Intentos: {attempts}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para renderizar figuras SVG (debe estar en otro archivo o al inicio)
const ShapeRenderer = ({ shapeId, size = 40 }: { shapeId: string; size?: number }) => {
  const shape = SHAPE_TYPES.find((s) => s.id === shapeId);
  
  if (!shape) return <div>Figura no encontrada</div>;

  const shapes = {
    circle: (
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} fill={shape.color} />
    ),
    square: (
      <rect x="2" y="2" width={size - 4} height={size - 4} fill={shape.color} />
    ),
    triangle: (
      <polygon
        points={`${size / 2},4 ${size - 4},${size - 4} 4,${size - 4}`}
        fill={shape.color}
      />
    ),
    rectangle: (
      <rect x="4" y="8" width={size - 8} height={size - 16} fill={shape.color} />
    ),
    diamond: (
      <polygon
        points={`${size / 2},4 ${size - 4},${size / 2} ${size / 2},${size - 4} 4,${size / 2}`}
        fill={shape.color}
      />
    ),
    pentagon: (
      <polygon
        points={`${size / 2},4 ${size - 4},${size / 3} ${size - 8},${size - 4} 8,${size - 4} 4,${size / 3}`}
        fill={shape.color}
      />
    ),
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {shapes[shapeId as keyof typeof shapes]}
    </svg>
  );
};

// Tipos de figuras (debería estar en un archivo types.ts)
const SHAPE_TYPES = [
  { id: "circle", name: "Círculo", color: "#3B82F6" },
  { id: "square", name: "Cuadrado", color: "#EF4444" },
  { id: "triangle", name: "Triángulo", color: "#10B981" },
  { id: "rectangle", name: "Rectángulo", color: "#F59E0B" },
  { id: "diamond", name: "Diamante", color: "#8B5CF6" },
  { id: "pentagon", name: "Pentágono", color: "#EC4899" },
];