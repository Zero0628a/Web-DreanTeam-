import type { NextApiRequest, NextApiResponse } from 'next';
const db = require('../../../firebase/firebase'); // Ruta relativa a firebase.js

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const nueva = req.body;

    try {
      await db.collection("preguntas").add(nueva);
      return res.status(200).json({ message: "Pregunta guardada en Firestore" });
    } catch (error) {
      return res.status(500).json({ error: "Error al guardar la pregunta" });
    }
  }

  if (req.method === 'GET') {
    try {
      const snapshot = await db.collection("preguntas").get();
      const preguntas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(preguntas);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener preguntas" });
    }
  }

  res.status(405).end(); // Método no permitido
}
