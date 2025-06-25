const express = require("express");
const router = express.Router();
const db = require("../../../firebase/firebase"); // Asegúrate que esta ruta sea correcta

// Ruta POST para guardar una pregunta resuelta
router.post("/respuestas", async (req, res) => {
  try {
    const { userEmail, questionTitle, isCorrect, date } = req.body;

    if (!userEmail || !questionTitle || typeof isCorrect !== "boolean") {
      return res.status(400).json({ error: "Datos incompletos o inválidos" });
    }

    await db.collection("respuestas").add({
      userEmail,
      questionTitle,
      isCorrect,
      date: date || new Date().toISOString().split("T")[0],
    });

    res.status(200).json({ message: "Respuesta registrada con éxito" });
  } catch (error) {
    console.error("Error al guardar respuesta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
