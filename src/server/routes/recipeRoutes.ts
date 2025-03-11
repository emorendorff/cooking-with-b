import { Router, Request, Response } from 'express';
import { DataService } from '../services/DataService';


export class RecipeRoutes {
  public router: Router;
  
  constructor(private dataService: DataService) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/', this.getAllRecipes.bind(this));
    this.router.get('/:id', this.getRecipeById.bind(this));
    this.router.post('/', this.createRecipe.bind(this));
    this.router.patch('/:id', this.updateRecipe.bind(this));
    this.router.delete('/:id', this.deleteRecipe.bind(this));
  }

  private async getAllRecipes(_req: Request, res: Response): Promise<void> {
    const data = await this.dataService.readRecipes();
    res.json(data.recipes);
  }

  private async getRecipeById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    const data = await this.dataService.readRecipes();
    const recipe = data.recipes.find(r => r.id === id);
    
    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }
    
    res.json(recipe);
  }

  private async createRecipe(req: Request, res: Response): Promise<void> {
    const recipe = req.body;
    const data = await this.dataService.readRecipes();
    recipe.id = data.recipes.length + 1;
    data.recipes.push(recipe);
    await this.dataService.writeRecipes(data);
    res.status(201).json(recipe);
  }

  private async updateRecipe(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    const recipe = req.body;
    const data = await this.dataService.readRecipes();
    const index = data.recipes.findIndex(r => r.id === id);
    
    if (index === -1) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }
    
    data.recipes[index] = { ...data.recipes[index], ...recipe };
    await this.dataService.writeRecipes(data);
    res.json(data.recipes[index]);
  }

  private async deleteRecipe(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    const data = await this.dataService.readRecipes();
    const index = data.recipes.findIndex(r => r.id === id);
    
    if (index === -1) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }
    
    data.recipes.splice(index, 1);
    await this.dataService.writeRecipes(data);
    res.status(204).end();
  }
}