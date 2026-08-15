export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Trello Lite Backend API',
    version: '1.0.0',
    description: 'Trello Lite Backend API documentation powered by OpenAPI 3.0 and Swagger UI.',
    contact: {
      name: 'Trello Lite Team',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local Development Server',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Server status and health endpoints',
    },
    {
      name: 'Users & RBAC',
      description: 'User directory and Role-Based Access Control administration (Admin Only)',
    },
    {
      name: 'Authentication',
      description: 'Better Auth integration endpoints for sessions, login, and registration',
    },
  ],
  components: {
    securitySchemes: {
      CookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'better-auth.session_token',
        description: 'Better Auth session cookie set upon authentication.',
      },
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Optional Authorization Bearer token',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'user_1' },
          name: { type: 'string', example: 'Alex Admin' },
          email: { type: 'string', format: 'email', example: 'admin@trello.com' },
          role: { type: 'string', enum: ['admin', 'member', 'viewer'], example: 'admin' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      UpdateUserRoleInput: {
        type: 'object',
        required: ['role'],
        properties: {
          role: { type: 'string', enum: ['admin', 'member', 'viewer'], example: 'admin' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'An error occurred processing your request.' },
          errors: { type: 'array', items: { type: 'object' }, nullable: true },
        },
      },
    },
  },
  paths: {
    '/': {
      get: {
        tags: ['Health'],
        summary: 'Server Health Check & API welcome status',
        responses: {
          200: {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Welcome to Trello Lite Backend API!' },
                    timestamp: { type: 'string', format: 'date-time' },
                    status: { type: 'string', example: 'healthy' },
                    docs: { type: 'string', example: '/docs' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/users': {
      get: {
        tags: ['Users & RBAC'],
        summary: 'Fetch users directory (Admin role required)',
        security: [{ CookieAuth: [] }, { BearerAuth: [] }],
        responses: {
          200: {
            description: 'List of users',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
          403: { description: 'Forbidden: Only admin users can access' },
        },
      },
    },
    '/api/v1/users/{id}/role': {
      patch: {
        tags: ['Users & RBAC'],
        summary: 'Update user role (Admin role required)',
        security: [{ CookieAuth: [] }, { BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserRoleInput' },
            },
          },
        },
        responses: {
          200: { description: 'User role updated successfully' },
          403: { description: 'Forbidden' },
          404: { description: 'User not found' },
        },
      },
    },
  },
};
