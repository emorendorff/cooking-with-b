import path from 'path';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { DataService } from './services/DataService';
import { RecipeRoutes } from './routes/recipeRoutes';
import { errorHandler } from './middleware/errorHandler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Server {
  private app: Application;
  private port: number;
  private dataService: DataService;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3001', 10);
    this.dataService = new DataService(path.join(__dirname, '../../db.json'));
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    // Initialize recipe routes with data service
    const recipeRoutes = new RecipeRoutes(this.dataService);
    
    // API routes
    this.app.use('/api/recipes', recipeRoutes.router);

    // Production static file serving
    if (process.env.NODE_ENV === 'production') {
      this.setupProductionRoutes();
    }

    // Error handling middleware should be last
    this.app.use(errorHandler);
  }

  private setupProductionRoutes(): void {
    const distPath = path.join(__dirname, '../dist');
    this.app.use(express.static(distPath));
    
    this.app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  public async start(): Promise<void> {
    try {
      await this.dataService.initialize();
      this.app.listen(this.port, () => {
        console.log(`Server running on port ${this.port}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Start server
const server = new Server();
server.start().catch(console.error);