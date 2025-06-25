const express = require("express");
const router = express.Router();
const db = require("../../../firebase/firebase");

// GET /api/respuestas/:email
router.get("/respuestas/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const respuestasSnapshot = await db.collection("respuestas")
      .where("email", "==", email)
      .get();

    const respuestas = respuestasSnapshot.docs.map(doc => doc.data());

    res.json(respuestas);
  } catch (error) {
    console.error("Error al obtener respuestas:", error);
    res.status(500).json({ error: "Error al obtener respuestas" });
  }
});

module.exports = router;
