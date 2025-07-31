import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Document",
      version: "1.0.0",
      description: "API documentation for my app",
    },
    servers: [{ url: "http://localhost:5500" }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", 
        },
        RefreshToken: {
          type: "apiKey",
          in: "cookie",
          name: "refresh_token",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
        RefreshToken: [],
      },
    ],
  },
  apis: ["./src/swagger/*.ts"], 
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec,{
    swaggerOptions: {
      requestInterceptor: (req:any) => {
        req.credentials = 'same-origin';
        return req;
      },
    },
  }));
};
