import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import router from './routes/router.js';
import { origins } from './utils/origins.js';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import { swaggerDocument } from './docs/swagger.js';

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1);

const corsOptions = {
  origin: origins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
    'X-Better-Auth-CSRF',
  ],
  exposedHeaders: ['Set-Cookie'],
};
app.use(cors(corsOptions));

app.all('/api/auth/*splat', toNodeHandler(auth));
// Enable CORS and parsing of JSON request bodies
app.use(express.json());

// Interactive Swagger API documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Register API routes
app.use('/api/v1', router);

// Root API health and welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Trello Lite Backend API!',
    timestamp: new Date().toISOString(),
    status: 'healthy',
    docs: '/docs',
  });
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📖 Swagger API Docs available at http://localhost:${port}/docs`);
});
