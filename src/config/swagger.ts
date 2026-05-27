import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Email Verification Authentication API",
      version: "1.0.0",
      description: "Complete Email Verification Authentication System with OTP",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development Server",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "number", example: 1 },
            first_name: { type: "string", example: "John" },
            last_name: { type: "string", example: "Doe" },
            user_email: { type: "string", example: "john@gmail.com" },
            is_verified: { type: "boolean", example: false },
            role: { type: "string", example: "customer" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: [
            "first_name",
            "last_name",
            "email",
            "password",
            "confirm_password",
          ],
          properties: {
            first_name: { type: "string", example: "John" },
            last_name: { type: "string", example: "Doe" },
            email: { type: "string", example: "john@gmail.com" },
            password: { type: "string", example: "Test@1234" },
            confirm_password: { type: "string", example: "Test@1234" },
            role: { type: "string", example: "customer" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "john@gmail.com" },
            password: { type: "string", example: "Test@1234" },
          },
        },
        VerifyOtpRequest: {
          type: "object",
          required: ["email", "otp"],
          properties: {
            email: { type: "string", example: "john@gmail.com" },
            otp: { type: "string", example: "582934" },
          },
        },
        ResendOtpRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: { type: "string", example: "john@gmail.com" },
          },
        },
        ChangePasswordRequest: {
          type: "object",
          required: ["current_password", "new_password", "confirm_password"],
          properties: {
            current_password: { type: "string", example: "OldPass@123" },
            new_password: { type: "string", example: "NewPass@123" },
            confirm_password: { type: "string", example: "NewPass@123" },
          },
        },
        LogoutResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Logged out successfully." },
            data: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Logged out successfully.",
                },
              },
            },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message" },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Success message" },
            data: { type: "object" },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/config/*.ts"],
};

export const specs = swaggerJsdoc(options);
