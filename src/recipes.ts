import GreenSauceFlowers from '../src/assets/green-sauce-flowers.jpg';
import LASalad from '../src/assets/la-salad.jpg';
import BPAsparagusTofu from '../src/assets/blackpepper-asparagus-tofu.jpg';
import TofuScramble from '../src/assets/tofi-scrambie.jpg';
export interface Recipe {
  id: number;
  name: string;
  tagline: string;
  servings?: number;
  prepTime?: {
    value: number;
    unit: string;
  };
  cookTime?: {
    value: number;
    unit: string;
  };
  totalTime?: {
    value: number;
    unit: string;
  };
  difficulty?: string;
  ingredients?: {
    item: string;
    amount?: number;
    unit?: string;
    notes?: string;
  }[];
  instructions?: {
    step: number;
    text: string;
  }[];
  tags?: string[];
  equipment?: string[];
  image?: string;
}

export const recipes: Recipe[] = [
  {
    id: 1,
    name: "Spicy Tangy Green Beans",
    tagline: "You know it, you love it, you wanna eat it",
    servings: 4,
    prepTime: {
      value: 10,
      unit: "minutes"
    },
    cookTime: {
      value: 8,
      unit: "minutes"
    },
    totalTime: {
      value: 18,
      unit: "minutes"
    },
    difficulty: "easy",
    ingredients: [
      {
        item: "green beans",
        amount: 1,
        unit: "pound",
        notes: "trimmed"
      },
      {
        item: "garlic",
        amount: 4,
        unit: "cloves",
        notes: "thinly sliced"
      },
      {
        item: "ginger",
        amount: 2,
        unit: "inches",
        notes: "peeled and julienned"
      },
      {
        item: "red pepper flakes",
        amount: 1,
        unit: "teaspoon"
      },
      {
        item: "soy sauce",
        amount: 2,
        unit: "tablespoons"
      },
      {
        item: "rice vinegar",
        amount: 2,
        unit: "tablespoons"
      },
      {
        item: "vegetable oil",
        amount: 2,
        unit: "tablespoons"
      },
      {
        item: "sesame oil",
        amount: 1,
        unit: "teaspoon"
      },
      {
        item: "kosher salt",
        amount: 1,
        unit: "teaspoon"
      }
    ],
    instructions: [
      {
        step: 1,
        text: "Bring a large pot of heavily salted water to boil"
      },
      {
        step: 2,
        text: "Prepare an ice bath in a large bowl"
      },
      {
        step: 3,
        text: "Blanch green beans in boiling water for 2-3 minutes until bright green and crisp-tender"
      },
      {
        step: 4,
        text: "Transfer beans to ice bath to stop cooking, then drain and pat dry"
      },
      {
        step: 5,
        text: "Heat vegetable oil in a large skillet over medium-high heat"
      },
      {
        step: 6,
        text: "Add garlic, ginger, and red pepper flakes, cook until fragrant, about 30 seconds"
      },
      {
        step: 7,
        text: "Add green beans and stir-fry until heated through, about 2 minutes"
      },
      {
        step: 8,
        text: "Add soy sauce and rice vinegar, toss to coat"
      },
      {
        step: 9,
        text: "Remove from heat and drizzle with sesame oil"
      }
    ],
    tags: [
      "vegetarian",
      "vegan",
      "side dish",
      "asian-inspired",
      "spicy"
    ],
    equipment: [
      "large pot",
      "large bowl",
      "large skillet",
      "colander",
      "paper towels"
    ]
  },
  {
    id: 2,
    image: GreenSauceFlowers,
    name: "Green Sauce Pasta",
    tagline: "This ain't no pesto, this just green sauce made from the kale or spinach you keep forgetting to eat",
  },
  {
    id: 3,
    image: LASalad,
    name: "That One LA Salad",
    tagline: "This salad is sponsored by Moby and the city of Los Angeles",
  },
  {
    id: 4,
    image: BPAsparagusTofu,
    name: "Black Pepper Asparagus Tofu",
    tagline: "Just go light on the black pepper and you'll be fine",
  },
  {
    id: 5,
    image: TofuScramble,
    name: "Tofie Scrambie",
    tagline: "Throw whatever you want in there girlie"
  }
];

export default null;