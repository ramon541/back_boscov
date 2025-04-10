import express from "express";
import swaggerUi from "swagger-ui-express";

import swaggerDocs from "../libs/swaggerConfig";
import userRoutes from "../routes/userRoutes";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
