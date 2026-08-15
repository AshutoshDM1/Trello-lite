export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Lead CRM Backend API',
    version: '1.0.0',
    description:
      'High-performance Lead CRM Backend API documentation powered by OpenAPI 3.0 and Swagger UI. Supports lead capture, duplicate detection, pipeline tracking, and user role management.',
    contact: {
      name: 'Lead CRM Team',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local Development Server',
    },
    {
      url: 'https://api-lead-erp.elitedev.space',
      description: 'Production API Server',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'Server status and health endpoints',
    },
    {
      name: 'Leads (Public)',
      description: 'Public endpoints for prospective client lead capture (No Auth Required)',
    },
    {
      name: 'Leads (Dashboard)',
      description: 'Authenticated lead management, tracking, and activity notes',
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
      Lead: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'lead_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' },
          name: { type: 'string', example: 'Jane Doe' },
          email: { type: 'string', format: 'email', example: 'jane.doe@acme.com' },
          phone: { type: 'string', nullable: true, example: '+1 555-0199' },
          company: { type: 'string', nullable: true, example: 'Acme Corp' },
          source: { type: 'string', example: 'website' },
          status: {
            type: 'string',
            enum: ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'],
            example: 'new',
          },
          value: { type: 'number', nullable: true, example: 5000 },
          assignedTo: { type: 'string', nullable: true, example: 'user_123' },
          notes: { type: 'string', nullable: true, example: 'Interested in enterprise plan' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      LeadNote: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'note_123' },
          leadId: { type: 'string', example: 'lead_9b1deb4d' },
          content: { type: 'string', example: 'Followed up via phone call.' },
          authorId: { type: 'string', nullable: true, example: 'user_123' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      PublicCreateLeadInput: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string', example: 'John Smith' },
          email: { type: 'string', format: 'email', example: 'john.smith@client.com' },
          phone: { type: 'string', example: '+1 555-0123' },
          company: { type: 'string', example: 'Smith Enterprises' },
          source: { type: 'string', example: 'website' },
          notes: { type: 'string', example: 'Looking for a demo' },
        },
      },
      CreateLeadInput: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string', example: 'John Smith' },
          email: { type: 'string', format: 'email', example: 'john.smith@client.com' },
          phone: { type: 'string', example: '+1 555-0123' },
          company: { type: 'string', example: 'Smith Enterprises' },
          source: { type: 'string', example: 'inbound' },
          status: {
            type: 'string',
            enum: ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'],
            default: 'new',
          },
          assignedTo: { type: 'string', example: 'user_admin' },
          value: { type: 'number', example: 12000 },
          notes: { type: 'string', example: 'Key lead from Q3 campaign' },
        },
      },
      UpdateLeadInput: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          company: { type: 'string' },
          source: { type: 'string' },
          status: {
            type: 'string',
            enum: ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'],
          },
          assignedTo: { type: 'string' },
          value: { type: 'number' },
          notes: { type: 'string' },
        },
      },
      CreateNoteInput: {
        type: 'object',
        required: ['content'],
        properties: {
          content: { type: 'string', example: 'Client requested a revised proposal by Friday.' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'user_1' },
          name: { type: 'string', example: 'Alex Admin' },
          email: { type: 'string', format: 'email', example: 'admin@crm.com' },
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
                    message: { type: 'string', example: 'Welcome to Lead CRM Backend API!' },
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
    '/api/v1/leads/public': {
      post: {
        tags: ['Leads (Public)'],
        summary: 'Submit lead inquiry form (Public - No Auth)',
        description:
          'Public endpoint for prospective clients to submit their details. Validates input and performs automatic duplicate detection against existing lead emails or phone numbers.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PublicCreateLeadInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Lead captured successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Lead captured successfully' },
                    data: { $ref: '#/components/schemas/Lead' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          409: {
            description: 'Duplicate Lead Found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example:
                        'A lead with this email or phone number already exists in our records.',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/leads': {
      get: {
        tags: ['Leads (Dashboard)'],
        summary: 'List all leads',
        security: [{ CookieAuth: [] }, { BearerAuth: [] }],
        parameters: [
          {
            name: 'search',
            in: 'query',
            description: 'Filter leads by name, email, or company',
            schema: { type: 'string' },
          },
          {
            name: 'status',
            in: 'query',
            description: 'Filter leads by status',
            schema: {
              type: 'string',
              enum: ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'],
            },
          },
        ],
        responses: {
          200: {
            description: 'Array of lead records',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Lead' },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
        },
      },
      post: {
        tags: ['Leads (Dashboard)'],
        summary: 'Create a new lead manually',
        security: [{ CookieAuth: [] }, { BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateLeadInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Lead created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Lead' },
              },
            },
          },
          400: { description: 'Validation error' },
          409: { description: 'Duplicate lead error' },
        },
      },
    },
    '/api/v1/leads/{id}': {
      patch: {
        tags: ['Leads (Dashboard)'],
        summary: 'Update existing lead status, assigned user, or details',
        security: [{ CookieAuth: [] }, { BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: 'lead_123',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateLeadInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Lead updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Lead' },
              },
            },
          },
          404: { description: 'Lead not found' },
        },
      },
      delete: {
        tags: ['Leads (Dashboard)'],
        summary: 'Delete lead record',
        security: [{ CookieAuth: [] }, { BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Lead deleted' },
          404: { description: 'Lead not found' },
        },
      },
    },
    '/api/v1/leads/{id}/notes': {
      get: {
        tags: ['Leads (Dashboard)'],
        summary: 'Get activity logs and notes for a specific lead',
        security: [{ CookieAuth: [] }, { BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'List of lead notes',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/LeadNote' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Leads (Dashboard)'],
        summary: 'Add a new activity note to a lead',
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
              schema: { $ref: '#/components/schemas/CreateNoteInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Note added',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LeadNote' },
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
