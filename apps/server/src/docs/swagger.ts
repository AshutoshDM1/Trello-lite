export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'TaskFlow / Trello Lite Backend API',
    version: '1.0.0',
    description:
      'TaskFlow Backend API documentation for managing Boards, Columns, Tasks, and User RBAC.',
    contact: {
      name: 'TaskFlow Team',
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
      name: 'Boards',
      description: 'Board structure with nested columns and tasks',
    },
    {
      name: 'Tasks',
      description: 'Task creation, modification, position movement, and priority filtering',
    },
    {
      name: 'Users & RBAC',
      description: 'User directory and Role-Based Access Control administration',
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
    },
    schemas: {
      Task: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'task_sample_1' },
          title: { type: 'string', example: 'Design TaskFlow Database Schema' },
          description: {
            type: 'string',
            nullable: true,
            example: 'Set up tables for boards and tasks',
          },
          columnId: { type: 'string', example: 'col_todo' },
          priority: { type: 'string', enum: ['Low', 'Medium', 'High'], example: 'High' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Column: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'col_todo' },
          name: { type: 'string', example: 'To Do' },
          boardId: { type: 'string', example: 'board_demo_1' },
          position: { type: 'number', example: 0 },
          tasks: {
            type: 'array',
            items: { $ref: '#/components/schemas/Task' },
          },
        },
      },
      Board: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'board_demo_1' },
          name: { type: 'string', example: 'TaskFlow Workspace Board' },
          columns: {
            type: 'array',
            items: { $ref: '#/components/schemas/Column' },
          },
        },
      },
      CreateTaskInput: {
        type: 'object',
        required: ['title', 'columnId'],
        properties: {
          title: { type: 'string', example: 'Build REST APIs' },
          description: { type: 'string', example: 'Implement Express routes and validation' },
          columnId: { type: 'string', example: 'col_todo' },
          priority: { type: 'string', enum: ['Low', 'Medium', 'High'], default: 'Medium' },
        },
      },
      UpdateTaskInput: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Updated Task Title' },
          description: { type: 'string', example: 'Updated description' },
          columnId: { type: 'string', example: 'col_in_progress' },
          priority: { type: 'string', enum: ['Low', 'Medium', 'High'] },
        },
      },
      MoveTaskInput: {
        type: 'object',
        required: ['columnId'],
        properties: {
          columnId: { type: 'string', example: 'col_done' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Validation failed' },
          errors: { type: 'object', nullable: true },
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
          },
        },
      },
    },
    '/api/v1/boards': {
      get: {
        tags: ['Boards'],
        summary: 'List all boards',
        responses: {
          200: { description: 'List of boards' },
        },
      },
    },
    '/api/v1/boards/{id}': {
      get: {
        tags: ['Boards'],
        summary: 'Get board details with columns and tasks',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: 'board_demo_1',
          },
          {
            name: 'priority',
            in: 'query',
            schema: { type: 'string', enum: ['Low', 'Medium', 'High'] },
            description: 'Filter nested tasks by priority',
          },
        ],
        responses: {
          200: { description: 'Board with nested columns and tasks' },
          404: { description: 'Board not found' },
        },
      },
    },
    '/api/v1/tasks': {
      get: {
        tags: ['Tasks'],
        summary: 'Fetch tasks with optional filters',
        parameters: [
          {
            name: 'priority',
            in: 'query',
            schema: { type: 'string', enum: ['Low', 'Medium', 'High'] },
          },
          {
            name: 'columnId',
            in: 'query',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'List of tasks' },
        },
      },
      post: {
        tags: ['Tasks'],
        summary: 'Create a new task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateTaskInput' },
            },
          },
        },
        responses: {
          201: { description: 'Task created successfully' },
          400: { description: 'Validation error or invalid columnId' },
        },
      },
    },
    '/api/v1/tasks/{id}': {
      patch: {
        tags: ['Tasks'],
        summary: 'Update task details',
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
              schema: { $ref: '#/components/schemas/UpdateTaskInput' },
            },
          },
        },
        responses: {
          200: { description: 'Task updated successfully' },
          400: { description: 'Validation error' },
          404: { description: 'Task not found' },
        },
      },
      delete: {
        tags: ['Tasks'],
        summary: 'Delete task',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Task deleted successfully' },
          404: { description: 'Task not found' },
        },
      },
    },
    '/api/v1/tasks/{id}/move': {
      patch: {
        tags: ['Tasks'],
        summary: 'Move task to a different column',
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
              schema: { $ref: '#/components/schemas/MoveTaskInput' },
            },
          },
        },
        responses: {
          200: { description: 'Task moved successfully' },
          400: { description: 'Validation error or target column does not exist' },
          404: { description: 'Task not found' },
        },
      },
    },
  },
};
