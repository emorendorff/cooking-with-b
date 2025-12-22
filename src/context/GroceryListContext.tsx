import { createContext, useContext, ReactNode } from "react";
import { useGroceryList } from "../hooks/useGroceryList";

type GroceryListContextType = ReturnType<typeof useGroceryList>;

const GroceryListContext = createContext<GroceryListContextType | undefined>(undefined);

export function GroceryListProvider({ children }: { children: ReactNode }) {
  const groceryList = useGroceryList();

  return (
    <GroceryListContext.Provider value={groceryList}>
      {children}
    </GroceryListContext.Provider>
  );
}

export function useGroceryListContext() {
  const context = useContext(GroceryListContext);
  if (context === undefined) {
    throw new Error("useGroceryListContext must be used within a GroceryListProvider");
  }
  return context;
}
