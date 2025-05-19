import swaggerJSDoc, { OAS3Options } from "swagger-jsdoc";
const swaggerOptions: OAS3Options = {
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
  apis: ["./src/routes/*.ts"],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
export default swaggerDocs;
