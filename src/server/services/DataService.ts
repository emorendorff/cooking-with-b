import fs from 'fs/promises';
import { dirname } from 'path';
import { RecipeData } from '../types/types';

export class DataService {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async initialize(): Promise<void> {
    try {
      await fs.mkdir(dirname(this.filePath), { recursive: true });
      try {
        await fs.access(this.filePath);
      } catch {
        await this.writeRecipes({ recipes: [] });
      }
    } catch (error) {
      throw new Error(`Failed to initialize data service: ${error}`);
    }
  }

  async readRecipes(): Promise<RecipeData> {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch {
      return { recipes: [] };
    }
  }

  async writeRecipes(data: RecipeData): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
  }
}