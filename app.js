const express = require("express");
const app = express();
const cors = require("cors");

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const questionRoutes = require("./modules/question/router/question.routes");
app.use("/api", questionRoutes);

const respuestaRoutes = require("./modules/question/router/respuesta.routes");
app.use("/api", respuestaRoutes);
 
// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
