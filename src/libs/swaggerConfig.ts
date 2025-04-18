import swaggerJSDoc from "swagger-jsdoc";
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API do Boscov",
      version: "1.0.0",
      description: "Documentação da API do Boscov",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controller/*.ts", "./src/http/server.ts"],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
export default swaggerDocs;
