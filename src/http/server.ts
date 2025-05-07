import express from "express";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";

import swaggerDocs from "../libs/swaggerConfig";
import userRoutes from "../routes/userRoutes";
import errorHandler from "../middlewares/errorHandler";

const app = express();
const port = 3000;

// ----- Middlewares -----
app.use(express.json());
app.use(morgan("dev"));

// ----- Docs -----
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ----- Routes -----
app.use("/api", userRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
