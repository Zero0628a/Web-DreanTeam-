"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Trash2, Edit3, Save, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Question } from "@/lib/types";

// Definición de tipos de formas para order-shapes
const SHAPE_TYPES = [
  { id: "circle", name: "Círculo" },
  { id: "square", name: "Cuadrado" },
  { id: "triangle", name: "Triángulo" },
  { id: "rectangle", name: "Rectángulo" },
  { id: "diamond", name: "Diamante" },
  { id: "pentagon", name: "Pentágono" },
];

interface SolveQuestionsTabProps {
  questions: Question[];
  onQuestionSolved: (questionTitle: string, isCorrect: boolean) => void;
  onQuestionUpdated: (questionIndex: number, updatedQuestion: Question) => void; // Nueva prop
  setActiveTab: (tab: "home" | "create" | "solve" | "profile") => void;
}

export function SolveQuestionsTab({
  questions,
  onQuestionSolved,
  onQuestionUpdated,
  setActiveTab,
}: SolveQuestionsTabProps) {
  const [shuffledWords, setShuffledWords] = useState<string[][]>([]);
  const [selectedWords, setSelectedWords] = useState<string[][]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [questionFeedback, setQuestionFeedback] = useState<
    { correct: boolean; message: string }[]
  >([]);
  const [draggedWord, setDraggedWord] = useState<{
    questionIndex: number;
    word: string;
    source: "available" | "selected";
    index: number;
  } | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Estados para edición
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Question | null>(null);

  useEffect(() => {
    initializeQuestionState();
  }, [questions]);

  const initializeQuestionState = () => {
    const newShuffledWords: string[][] = [];
    const newSelectedWords: string[][] = [];
    const newUserAnswers: string[] = [];
    const newQuestionFeedback: { correct: boolean; message: string }[] = [];

    questions.forEach((question, index) => {
      if (question.type === "order-words" || question.type === "order-shapes") {
        newShuffledWords[index] = [...question.words].sort(
          () => Math.random() - 0.5
        );
        newSelectedWords[index] = [];
      } else {
        newUserAnswers[index] = "";
      }
      newQuestionFeedback[index] = null;
    });

    setShuffledWords(newShuffledWords);
    setSelectedWords(newSelectedWords);
    setUserAnswers(newUserAnswers);
    setQuestionFeedback(newQuestionFeedback);
  };

  const handleUserAnswerChange = (questionIndex: number, value: string) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[questionIndex] = value;
    setUserAnswers(newUserAnswers);
  };

  // Funciones de edición
  const handleEditQuestion = (index: number) => {
  const questionToEdit = questions[index];
  setEditingIndex(index);
  setEditForm({
    ...questionToEdit,
    correctOrders: questionToEdit.correctOrders ?? [],
    words: questionToEdit.words ?? [],
  });
};

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditForm(null);
  };

  const handleSaveEdit = () => {
    if (editForm && editingIndex !== null) {
      onQuestionUpdated(editingIndex, editForm);
      setEditingIndex(null);
      setEditForm(null);
      // Reinicializar el estado para la pregunta editada
      initializeQuestionState();
    }
  };

  const updateEditForm = (field: string, value: any) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  const addWordToEditForm = () => {
    if (editForm && editForm.words) {
      setEditForm({
        ...editForm,
        words: [...editForm.words, ""]
      });
    }
  };

  const removeWordFromEditForm = (index: number) => {
    if (editForm && editForm.words) {
      const newWords = editForm.words.filter((_, i) => i !== index);
      setEditForm({
        ...editForm,
        words: newWords
      });
    }
  };

  const updateWordInEditForm = (index: number, value: string) => {
    if (editForm && editForm.words) {
      const newWords = [...editForm.words];
      newWords[index] = value;
      setEditForm({
        ...editForm,
        words: newWords
      });
    }
  };

  const addCorrectOrderToEditForm = () => {
    if (editForm && editForm.correctOrders) {
      setEditForm({
        ...editForm,
        correctOrders: [...editForm.correctOrders, ""]
      });
    }
  };

  const removeCorrectOrderFromEditForm = (index: number) => {
    if (editForm && editForm.correctOrders) {
      const newOrders = editForm.correctOrders.filter((_, i) => i !== index);
      setEditForm({
        ...editForm,
        correctOrders: newOrders
      });
    }
  };

  const updateCorrectOrderInEditForm = (index: number, value: string) => {
    if (editForm && editForm.correctOrders) {
      const newOrders = [...editForm.correctOrders];
      newOrders[index] = value;
      setEditForm({
        ...editForm,
        correctOrders: newOrders
      });
    }
  };

  const checkAnswer = (questionIndex: number) => {
    const question = questions[questionIndex];

    if (question.type === "order-words" || question.type === "order-shapes") {
      const userAnswer = selectedWords[questionIndex].join(" ");

      const isCorrect = question.correctOrders.some(
        (validOrder) =>
          userAnswer.trim().toLowerCase() === validOrder.trim().toLowerCase()
      );

      const newQuestionFeedback = [...questionFeedback];
      newQuestionFeedback[questionIndex] = {
        correct: isCorrect,
        message: isCorrect
          ? question.feedbackCorrect
          : question.feedbackIncorrect,
      };
      setQuestionFeedback(newQuestionFeedback);

      onQuestionSolved(question.title, isCorrect);
    }

    if (question.type === "incoherence") {
      const isCorrect =
        userAnswers[questionIndex].toLowerCase().includes("salta") &&
        userAnswers[questionIndex].toLowerCase().includes("suena");

      const newQuestionFeedback = [...questionFeedback];
      newQuestionFeedback[questionIndex] = {
        correct: isCorrect,
        message: isCorrect
          ? question.feedbackCorrect
          : question.feedbackIncorrect,
      };
      setQuestionFeedback(newQuestionFeedback);

      onQuestionSolved(question.title, isCorrect);
    }
  };

  const clearCanvas = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Funciones para drag and drop
  const handleDragStart = (
    questionIndex: number,
    word: string,
    source: "available" | "selected",
    index: number
  ) => {
    setDraggedWord({ questionIndex, word, source, index });
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (
    e: React.DragEvent,
    questionIndex: number,
    dropIndex = -1
  ) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (!draggedWord || draggedWord.questionIndex !== questionIndex) return;

    const newShuffledWords = [...shuffledWords];
    const newSelectedWords = [...selectedWords];

    if (draggedWord.source === "available") {
      if (
        dropIndex >= 0 &&
        dropIndex < newSelectedWords[questionIndex].length
      ) {
        newSelectedWords[questionIndex].splice(dropIndex, 0, draggedWord.word);
      } else {
        newSelectedWords[questionIndex].push(draggedWord.word);
      }

      newShuffledWords[questionIndex] = newShuffledWords[questionIndex].filter(
        (_, i) => i !== draggedWord.index
      );
    } else if (draggedWord.source === "selected") {
      newSelectedWords[questionIndex].splice(draggedWord.index, 1);

      if (
        dropIndex >= 0 &&
        dropIndex < newSelectedWords[questionIndex].length
      ) {
        newSelectedWords[questionIndex].splice(dropIndex, 0, draggedWord.word);
      } else {
        newSelectedWords[questionIndex].push(draggedWord.word);
      }
    }

    setShuffledWords(newShuffledWords);
    setSelectedWords(newSelectedWords);
    setDraggedWord(null);
  };

  const handleReturnWord = (questionIndex: number, wordIndex: number) => {
    const word = selectedWords[questionIndex][wordIndex];

    const newSelectedWords = [...selectedWords];
    newSelectedWords[questionIndex].splice(wordIndex, 1);

    const newShuffledWords = [...shuffledWords];
    newShuffledWords[questionIndex].push(word);

    setShuffledWords(newShuffledWords);
    setSelectedWords(newSelectedWords);
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Resolver Preguntas
        </h2>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-8 text-center">
          <div className="text-teal-600 dark:text-teal-400 mb-4 flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-search-x"
            >
              <path d="m13.5 8.5-5 5" />
              <path d="m8.5 8.5 5 5" />
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            No hay preguntas disponibles
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Aún no se han creado preguntas para resolver.
          </p>
          <Button
            onClick={() => setActiveTab("create")}
            className="bg-teal-600 hover:bg-teal-700"
          >
            Crear una pregunta
          </Button>
        </div>
      </div>
    );
  }

  const renderShapeSVG = (shapeId: string) => {
    switch (shapeId) {
      case "circle":
        return <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="white" strokeWidth="2" />;
      case "square":
        return <rect x="4" y="4" width="32" height="32" fill="#EF4444" stroke="white" strokeWidth="2" />;
      case "triangle":
        return <polygon points="20,4 36,36 4,36" fill="#10B981" stroke="white" strokeWidth="2" />;
      case "rectangle":
        return <rect x="4" y="10" width="32" height="20" fill="#F59E0B" stroke="white" strokeWidth="2" />;
      case "diamond":
        return <polygon points="20,4 36,20 20,36 4,20" fill="#8B5CF6" stroke="white" strokeWidth="2" />;
      case "pentagon":
        return <polygon points="20,4 36,16 30,36 10,36 4,16" fill="#EC4899" stroke="white" strokeWidth="2" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Resolver Preguntas
      </h2>

      <div className="grid gap-6">
        {questions.map((question, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              {editingIndex === index ? (
                // Formulario de edición
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      Editando Pregunta
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveEdit}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <Save size={16} className="mr-1" />
                        Guardar
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        size="sm"
                      >
                        <X size={16} className="mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </div>

                  {/* Campos básicos */}
                  <div>                             
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Título
                    </label>
                    <Input
                      value={editForm?.title || ""}
                      onChange={(e) => updateEditForm("title", e.target.value)}
                      className="dark:bg-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Descripción
                    </label>
                    <Textarea
                      value={editForm?.description || ""}
                      onChange={(e) => updateEditForm("description", e.target.value)}
                      className="dark:bg-slate-700"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tipo de pregunta
                    </label>
                    <Select
                      value={editForm?.type || ""}
                      onValueChange={(value) => updateEditForm("type", value)}
                    >
                      <SelectTrigger className="dark:bg-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="order-words">Ordenar palabras</SelectItem>
                        <SelectItem value="order-shapes">Ordenar formas</SelectItem>
                        <SelectItem value="incoherence">Detectar incoherencias</SelectItem>
                        <SelectItem value="drawing">Dibujo libre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Campos específicos según el tipo */}
                  {(editForm?.type === "order-words" || editForm?.type === "order-shapes") && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {editForm.type === "order-words" ? "Palabras" : "Formas"}
                        </label>
                        {editForm.words.map((word, wordIndex) => (
                          <div key={wordIndex} className="flex gap-2 mb-2">
                            {editForm.type === "order-words" ? (
                              <Input
                                value={word}
                                onChange={(e) => updateWordInEditForm(wordIndex, e.target.value)}
                                className="dark:bg-slate-700"
                                placeholder="Palabra"
                              />
                            ) : (
                              <Select
                                value={word}
                                onValueChange={(value) => updateWordInEditForm(wordIndex, value)}
                              >
                                <SelectTrigger className="dark:bg-slate-700">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {SHAPE_TYPES.map((shape) => (
                                    <SelectItem key={shape.id} value={shape.id}>
                                      {shape.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            <Button
                              onClick={() => removeWordFromEditForm(wordIndex)}
                              variant="outline"
                              size="sm"
                              className="text-red-600"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        ))}
                        <Button
                          onClick={addWordToEditForm}
                          variant="outline"
                          size="sm"
                          className="mt-2"
                        >
                          <Plus size={16} className="mr-1" />
                          Agregar {editForm.type === "order-words" ? "palabra" : "forma"}
                        </Button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Respuestas correctas
                        </label>
                        {Array.isArray(editForm?.correctOrders) &&
                          editForm.correctOrders.map((order, orderIndex) => (
                            <div key={orderIndex} className="flex gap-2 mb-2">
                              <Input
                                value={order}
                                onChange={(e) => updateCorrectOrderInEditForm(orderIndex, e.target.value)}
                                className="dark:bg-slate-700"
                                placeholder="Orden correcto (ej: palabra1 palabra2 palabra3)"
                              />
                              <Button
                                onClick={() => removeCorrectOrderFromEditForm(orderIndex)}
                                variant="outline"
                                size="sm"
                                className="text-red-600"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                        ))}
                        <Button
                          onClick={addCorrectOrderToEditForm}
                          variant="outline"
                          size="sm"
                          className="mt-2"
                        >
                          <Plus size={16} className="mr-1" />
                          Agregar respuesta correcta
                        </Button>
                      </div>
                    </>
                  )}

                  {editForm?.type === "incoherence" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Texto con incoherencia
                      </label>
                      <Textarea
                        value={editForm?.incoherentText || ""}
                        onChange={(e) => updateEditForm("incoherentText", e.target.value)}
                        className="dark:bg-slate-700"
                        rows={3}
                      />
                    </div>
                  )}

                  {/* Feedback */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mensaje de respuesta correcta
                    </label>
                    <Textarea
                      value={editForm?.feedbackCorrect || ""}
                      onChange={(e) => updateEditForm("feedbackCorrect", e.target.value)}
                      className="dark:bg-slate-700"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mensaje de respuesta incorrecta
                    </label>
                    <Textarea
                      value={editForm?.feedbackIncorrect || ""}
                      onChange={(e) => updateEditForm("feedbackIncorrect", e.target.value)}
                      className="dark:bg-slate-700"
                      rows={2}
                    />
                  </div>
                </div>
              ) : (
                // Vista normal de la pregunta
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        {question.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {question.description}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditQuestion(index)}
                      className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Edit3 size={16} className="mr-1" />
                      Editar
                    </Button>
                  </div>

                  {question.image && (
                    <div className="mb-4">
                      <img
                        src={question.image || "/placeholder.svg"}
                        alt="Imagen de la pregunta"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                    </div>
                  )}

                  {/* Componente para ordenar palabras */}
                  {question.type === "order-words" && (
                    <div className="mb-6">
                      <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-lg mb-4">
                        <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                          Palabras disponibles:
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
                          {shuffledWords[index]?.map((word, wordIndex) => (
                            <div
                              key={wordIndex}
                              draggable
                              onDragStart={() =>
                                handleDragStart(index, word, "available", wordIndex)
                              }
                              className="px-3 py-1 rounded-lg cursor-move bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 hover:shadow-md transition-shadow"
                            >
                              {word}
                            </div>
                          ))}
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                          Tu respuesta:
                        </p>
                        <div
                          className={`bg-white dark:bg-slate-800 p-3 rounded-lg border-2 min-h-[60px] flex flex-wrap gap-2 ${
                            dragOverIndex === index
                              ? "border-teal-500 dark:border-teal-400"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, index)}
                        >
                          {selectedWords[index]?.map((word, wordIndex) => (
                            <div
                              key={wordIndex}
                              draggable
                              onDragStart={() =>
                                handleDragStart(index, word, "selected", wordIndex)
                              }
                              className="bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 px-3 py-1 rounded-lg flex items-center cursor-move hover:shadow-md transition-shadow group"
                            >
                              {word}
                              <button
                                onClick={() => handleReturnWord(index, wordIndex)}
                                className="ml-2 text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Componente para detectar incoherencias */}
                  {question.type === "incoherence" && (
                    <div className="mb-6">
                      <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-lg mb-4">
                        <p className="text-gray-800 dark:text-gray-200 mb-3">
                          {question.incoherentText}
                        </p>
                        <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                          Corrige la oración:
                        </label>
                        <Textarea
                          value={userAnswers[index] || ""}
                          onChange={(e) =>
                            handleUserAnswerChange(index, e.target.value)
                          }
                          rows={3}
                          className="dark:bg-slate-700"
                          placeholder="Escribe la versión corregida"
                        />
                      </div>
                    </div>
                  )}

                  {question.type === "order-shapes" && (
                    <div className="mb-6">
                      <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-lg mb-4">
                        <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                          Figuras disponibles:
                        </p>
                        <div className="flex flex-wrap gap-3 mb-4 min-h-[60px]">
                          {shuffledWords[index]?.map((shapeId, i) => (
                            <div
                              key={i}
                              draggable
                              onDragStart={() => handleDragStart(index, shapeId, "available", i)}
                              className="w-14 h-14 cursor-move"
                            >
                              <svg width="100%" height="100%" viewBox="0 0 40 40">
                                {renderShapeSVG(shapeId)}
                              </svg>
                            </div>
                          ))}
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                          Tu respuesta:
                        </p>
                        <div
                          className="bg-white dark:bg-slate-800 p-3 rounded-lg border-2 min-h-[70px] flex flex-wrap gap-3"
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, index)}
                        >
                          {selectedWords[index]?.map((shapeId, shapeIndex) => (
                            <div
                              key={shapeIndex}
                              title={SHAPE_TYPES.find(s => s.id === shapeId)?.name || shapeId}
                              draggable
                              onDragStart={() =>
                                handleDragStart(index, shapeId, "selected", shapeIndex)
                              }
                              className="w-14 h-14 relative cursor-move group"
                            >
                              <svg width="100%" height="100%" viewBox="0 0 40 40">
                                {renderShapeSVG(shapeId)}
                              </svg>
                              <button
                                onClick={() => handleReturnWord(index, shapeIndex)}
                                className="absolute top-0 right-0 text-red-600 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <XCircle size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Componente para dibujar */}
                  {question.type === "drawing" && (
                    <div className="mb-6">
                      <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-lg mb-4">
                        <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg h-64 mb-3 relative">
                          <canvas className="w-full h-full rounded-lg"></canvas>
                          <button
                            onClick={clearCanvas}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex justify-center space-x-4">
                          <button className="px-3 py-1 bg-black text-white rounded-lg">
                            Negro
                          </button>
                          <button className="px-3 py-1 bg-red-500 text-white rounded-lg">
                            Rojo
                          </button>
                          <button className="px-3 py-1 bg-blue-500 text-white rounded-lg">
                            Azul
                          </button>
                          <button className="px-3 py-1 bg-green-500 text-white rounded-lg">
                            Verde
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      onClick={() => checkAnswer(index)}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      Comprobar Respuesta
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Feedback */}
            {questionFeedback[index] && (
              <div
                className={`p-4 border-t border-gray-200 dark:border-gray-700 ${
                  questionFeedback[index].correct
                    ? "bg-green-50 dark:bg-green-900/20"
                    : "bg-red-50 dark:bg-red-900/20"
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`${
                      questionFeedback[index].correct
                        ? "text-green-500"
                        : "text-red-500"
                    } mr-3 mt-1`}
                  >
                    {questionFeedback[index].correct ? (
                      <CheckCircle size={20} />
                    ) : (
                      <XCircle size={20} />
                    )}
                  </div>
                  <div>
                    <h4
                      className={`font-medium ${
                        questionFeedback[index].correct
                          ? "text-green-800 dark:text-green-200"
                          : "text-red-800 dark:text-red-200"
                      }`}
                    >
                      {questionFeedback[index].correct
                        ? "¡Correcto!"
                        : "Incorrecto"}
                    </h4>
                    <p
                      className={`${
                        questionFeedback[index].correct
                          ? "text-green-700 dark:text-green-300"
                          : "text-red-700 dark:text-red-300"
                      }`}
                    >
                      {questionFeedback[index].message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}