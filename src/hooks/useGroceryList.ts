import { useState, useEffect, useCallback } from "react";

export interface GroceryItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface RecipeGroceryItem extends GroceryItem {
  recipeId: string;
  recipeName: string;
}

export interface GroceryListData {
  manualItems: GroceryItem[];
  recipeItems: RecipeGroceryItem[];
}

const STORAGE_KEY = "grocery-list";

const getInitialData = (): GroceryListData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse grocery list from localStorage", e);
  }
  return { manualItems: [], recipeItems: [] };
};

export function useGroceryList() {
  const [data, setData] = useState<GroceryListData>(getInitialData);

  // Persist to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const addManualItems = useCallback((texts: string[]) => {
    const newItems: GroceryItem[] = texts
      .map((text) => text.trim())
      .filter((text) => text.length > 0)
      .map((text) => ({
        id: generateId(),
        text,
        checked: false,
      }));

    if (newItems.length > 0) {
      setData((prev) => ({
        ...prev,
        manualItems: [...prev.manualItems, ...newItems],
      }));
    }
  }, []);

  const addRecipeIngredient = useCallback(
    (text: string, recipeId: string, recipeName: string) => {
      const newItem: RecipeGroceryItem = {
        id: generateId(),
        text: text.trim(),
        checked: false,
        recipeId,
        recipeName,
      };

      setData((prev) => ({
        ...prev,
        recipeItems: [...prev.recipeItems, newItem],
      }));
    },
    []
  );

  const addAllRecipeIngredients = useCallback(
    (ingredients: string[], recipeId: string, recipeName: string) => {
      const newItems: RecipeGroceryItem[] = ingredients
        .map((text) => text.trim())
        .filter((text) => text.length > 0)
        .map((text) => ({
          id: generateId(),
          text,
          checked: false,
          recipeId,
          recipeName,
        }));

      if (newItems.length > 0) {
        setData((prev) => ({
          ...prev,
          recipeItems: [...prev.recipeItems, ...newItems],
        }));
      }
    },
    []
  );

  const toggleItem = useCallback((id: string, isRecipeItem: boolean) => {
    setData((prev) => {
      if (isRecipeItem) {
        return {
          ...prev,
          recipeItems: prev.recipeItems.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        };
      }
      return {
        ...prev,
        manualItems: prev.manualItems.map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item
        ),
      };
    });
  }, []);

  const removeItem = useCallback((id: string, isRecipeItem: boolean) => {
    setData((prev) => {
      if (isRecipeItem) {
        return {
          ...prev,
          recipeItems: prev.recipeItems.filter((item) => item.id !== id),
        };
      }
      return {
        ...prev,
        manualItems: prev.manualItems.filter((item) => item.id !== id),
      };
    });
  }, []);

  const clearChecked = useCallback(() => {
    setData((prev) => ({
      manualItems: prev.manualItems.filter((item) => !item.checked),
      recipeItems: prev.recipeItems.filter((item) => !item.checked),
    }));
  }, []);

  const clearAll = useCallback(() => {
    setData({ manualItems: [], recipeItems: [] });
  }, []);

  // Group recipe items by recipe
  const recipeItemsGrouped = data.recipeItems.reduce<
    Record<string, { recipeName: string; items: RecipeGroceryItem[] }>
  >((acc, item) => {
    if (!acc[item.recipeId]) {
      acc[item.recipeId] = { recipeName: item.recipeName, items: [] };
    }
    acc[item.recipeId].items.push(item);
    return acc;
  }, {});

  return {
    manualItems: data.manualItems,
    recipeItems: data.recipeItems,
    recipeItemsGrouped,
    addManualItems,
    addRecipeIngredient,
    addAllRecipeIngredients,
    toggleItem,
    removeItem,
    clearChecked,
    clearAll,
  };
}
