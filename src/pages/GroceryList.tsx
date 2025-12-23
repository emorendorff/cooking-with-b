import { useState } from "react";
import { useGroceryListContext } from "../context/GroceryListContext";
import Header from "../Header/Header";
import Navigation from "../Navigation/Navigation";

const GroceryList = () => {
  const [inputText, setInputText] = useState("");
  const {
    manualItems,
    recipeItemsGrouped,
    addManualItems,
    toggleItem,
    removeItem,
    clearChecked,
    clearAll
  } = useGroceryListContext();

  const handleAddItems = () => {
    const lines = inputText.split("\n");
    addManualItems(lines);
    setInputText("");
  };

  const hasItems =
    manualItems.length > 0 || Object.keys(recipeItemsGrouped).length > 0;
  const hasCheckedItems =
    manualItems.some((item) => item.checked) ||
    Object.values(recipeItemsGrouped).some((group) =>
      group.items.some((item) => item.checked)
    );

  return (
    <div className="pt-16 pb-16 min-h-screen">
      <Header />
      <div className="max-w-xl mx-auto p-4">
        <h1 className="mb-6">Grocery List</h1>

        <div className="mb-8 bg-tan-lighter rounded-lg p-4 shadow-md">
          <textarea
            placeholder="Add items, one per line..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full min-h-25 p-3 border border-tan-light rounded-lg text-base resize-y focus:outline-none focus:border-burgundy bg-white"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddItems}
              disabled={!inputText.trim()}
              className="px-4 py-2 bg-burgundy text-white border-none rounded cursor-pointer text-sm hover:bg-burgundy-hover disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add Items
            </button>
            {hasCheckedItems && (
              <button
                onClick={clearChecked}
                className="px-4 py-2 bg-tan text-gray-700 border-none rounded cursor-pointer text-sm hover:bg-tan-hover"
              >
                Clear Checked
              </button>
            )}
            {hasItems && (
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-tan text-gray-700 border-none rounded cursor-pointer text-sm hover:bg-tan-hover"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {!hasItems && (
          <p className=" text-center mt-8">
            Your grocery list is empty. Add items above or add ingredients from
            recipes.
          </p>
        )}

        {manualItems.length > 0 && (
          <div className="mb-6 bg-tan-light rounded-lg p-4 shadow-md">
            <h2 className="text-left normal-case mb-3 pb-2 border-b border-tan-hover">
              My Items
            </h2>
            <ul className="list-none p-0 m-0">
              {manualItems.map((item) => (
                <li
                  key={item.id}
                  className={`flex items-center py-2 border-b border-tan-light last:border-b-0 ${
                    item.checked ? "line-through text-brown" : "text-gray-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(item.id, false)}
                    className="mr-3 w-4.5 h-4.5 cursor-pointer"
                  />
                  <span className="flex-1">{item.text}</span>
                  <button
                    onClick={() => removeItem(item.id, false)}
                    className="bg-transparent border-none text-gray-400 cursor-pointer text-lg px-2 hover:text-burgundy"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {Object.entries(recipeItemsGrouped).map(([recipeId, group]) => (
          <div
            key={recipeId}
            className="mb-6 bg-tan-light rounded-lg p-4 shadow-md"
          >
            <h2 className="text-left normal-case mb-3 pb-2 border-b border-tan-hover">
              From: {group.recipeName}
            </h2>
            <ul className="list-none p-0 m-0">
              {group.items.map((item) => (
                <li
                  key={item.id}
                  className={`flex items-center py-2 border-b border-tan-light last:border-b-0 ${
                    item.checked ? "line-through text-brown" : "text-gray-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(item.id, true)}
                    className="mr-3 w-4.5 h-4.5 cursor-pointer"
                  />
                  <span className="flex-1">{item.text}</span>
                  <button
                    onClick={() => removeItem(item.id, true)}
                    className="bg-transparent border-none text-gray-400 cursor-pointer text-lg px-2 hover:text-burgundy"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Navigation />
    </div>
  );
};

export default GroceryList;
