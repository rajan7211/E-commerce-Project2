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

        Category: {
          type: "object",
          properties: {
            id: { type: "number", example: 1 },
            category_name: { type: "string", example: "Electronics" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        CreateCategoryRequest: {
          type: "object",
          required: ["category_name"],
          properties: {
            category_name: {
              type: "string",
              example: "Electronics",
              minLength: 2,
              maxLength: 50,
              pattern: "^[a-zA-Z\\s]+$",
            },
          },
        },
        UpdateCategoryRequest: {
          type: "object",
          properties: {
            category_name: {
              type: "string",
              example: "Electronic Devices",
              minLength: 2,
              maxLength: 50,
              pattern: "^[a-zA-Z\\s]+$",
            },
          },
        },
        CategoryListResponse: {
          type: "object",
          properties: {
            categories: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number", example: 1 },
                  category_name: { type: "string", example: "Electronics" },
                },
              },
            },
            total: { type: "number", example: 5 },
          },
        },

        Product: {
          type: "object",
          properties: {
            product_id: { type: "number", example: 1 },
            product_name: { type: "string", example: "Laptop" },
            product_price: { type: "number", example: 999.99 },
            product_description: {
              type: "string",
              example: "High performance laptop",
            },
            stock: { type: "number", example: 30 },
            category: {
              type: "object",
              properties: {
                id: { type: "number", example: 1 },
                category_name: { type: "string", example: "Electronics" },
              },
            },
            store: {
              type: "object",
              properties: {
                id: { type: "number", example: 1 },
                store_name: { type: "string", example: "Tech Store" },
              },
            },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        CreateProductRequest: {
          type: "object",
          required: [
            "product_name",
            "product_price",
            "stock",
            "category_id",
            "store_id",
          ],
          properties: {
            product_name: { type: "string", example: "Laptop" },
            product_price: { type: "number", example: 999.99 },
            product_description: {
              type: "string",
              example: "High performance laptop",
            },
            stock: { type: "number", example: 50 },
            category_id: { type: "number", example: 1 },
            store_id: { type: "number", example: 1 },
          },
        },
        UpdateProductRequest: {
          type: "object",
          properties: {
            product_name: { type: "string", example: "Updated Laptop" },
            product_price: { type: "number", example: 899.99 },
            product_description: {
              type: "string",
              example: "Updated description",
            },
            stock: { type: "number", example: 45 },
            category_id: { type: "number", example: 2 },
          },
        },
        ProductListResponse: {
          type: "object",
          properties: {
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  product_id: { type: "number", example: 1 },
                  product_name: { type: "string", example: "Laptop" },
                  product_price: { type: "number", example: 999.99 },
                  stock: { type: "number", example: 50 },
                },
              },
            },
            total: { type: "number", example: 100 },
          },
        },

 Store: {
          type: "object",
          properties: {
            id: { type: "number", example: 1 },
            store_name: { type: "string", example: "Tech Store" },
            store_description: { type: "string", example: "Best electronics store" },
            store_logo: { type: "string", example: "https://example.com/logo.png" },
            user: {
              type: "object",
              properties: {
                id: { type: "number", example: 1 },
                first_name: { type: "string", example: "John" },
                last_name: { type: "string", example: "Doe" },
                email: { type: "string", example: "john@example.com" },
              },
            },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        CreateStoreRequest: {
          type: "object",
          required: ["store_name"],
          properties: {
            store_name: { type: "string", example: "Tech Store" },
            store_description: { type: "string", example: "Best electronics store" },
            store_logo: { type: "string", example: "https://example.com/logo.png" },
          },
        },
        UpdateStoreRequest: {
          type: "object",
          properties: {
            store_name: { type: "string", example: "Updated Tech Store" },
            store_description: { type: "string", example: "Updated description" },
            store_logo: { type: "string", example: "https://example.com/new-logo.png" },
          },
        },
        StoreListResponse: {
          type: "object",
          properties: {
            stores: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number", example: 1 },
                  store_name: { type: "string", example: "Tech Store" },
                  store_description: { type: "string", example: "Best electronics store" },
                },
              },
            },
            total: { type: "number", example: 10 },
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
