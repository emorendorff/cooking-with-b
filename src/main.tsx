import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext";
import { GroceryListProvider } from "./context/GroceryListContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <GroceryListProvider>
        <App />
      </GroceryListProvider>
    </AuthProvider>
  </React.StrictMode>
);
