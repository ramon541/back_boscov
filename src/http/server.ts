const express = require("express");

const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("../libs/swaggerConfig");

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
