import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Water Supply System API",
      version: "1.0.0",
      description: "API documentation for your water supply system",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token", // Name of the cookie that contains the JWT
        },
      },
    },
  },
  apis: [
    "./src/routes/authRoutes.js",
    "./src/routes/adminRoutes.js",
    "./src/routes/announcementRoutes.js",
    "./src/routes/dashboardRoutes.js",
    "./src/routes/notificationRoutes.js",
    "./src/routes/PasswordResetRoute.js",
    "./src/routes/profileRoutes.js",
    "./src/routes/reportRoutes.js",
    "./src/routes/scheduleRoutes.js",
  ], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app, port) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger Docs running on http://localhost:${port}/api-docs`);
};