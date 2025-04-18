import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

import swaggerDocs from "../libs/swaggerConfig";
import userRoutes from "../routes/userRoutes";
import movieRoutes from "../routes/movieRoutes";

const app = express();
const port = 3000;

// Middleware para parsing de JSON e CORS
app.use(express.json());
app.use(cors());

// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas da API
app.use("/api", userRoutes);
app.use("/api", movieRoutes);

// Rota raiz para verificação de saúde do servidor
app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "Boscov API está online!",
    version: "1.0.0"
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
});
