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
    clearAll,
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
        <h1 className="mb-6 text-gray-700">Grocery List</h1>

        <div className="mb-8">
          <textarea
            placeholder="Add items, one per line..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full min-h-[100px] p-3 border border-tan rounded-lg text-base resize-y focus:outline-none focus:border-burgundy"
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
          <p className="text-gray-400 text-center mt-8">
            Your grocery list is empty. Add items above or add ingredients from
            recipes.
          </p>
        )}

        {manualItems.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base text-burgundy mb-3 pb-2 border-b border-tan text-left normal-case">
              My Items
            </h2>
            <ul className="list-none p-0 m-0">
              {manualItems.map((item) => (
                <li
                  key={item.id}
                  className={`flex items-center py-2 border-b border-gray-200 ${
                    item.checked ? 'line-through text-gray-400' : 'text-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(item.id, false)}
                    className="mr-3 w-[18px] h-[18px] cursor-pointer"
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
          <div key={recipeId} className="mb-6">
            <h2 className="text-base text-burgundy mb-3 pb-2 border-b border-tan text-left normal-case">
              From: {group.recipeName}
            </h2>
            <ul className="list-none p-0 m-0">
              {group.items.map((item) => (
                <li
                  key={item.id}
                  className={`flex items-center py-2 border-b border-gray-200 ${
                    item.checked ? 'line-through text-gray-400' : 'text-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(item.id, true)}
                    className="mr-3 w-[18px] h-[18px] cursor-pointer"
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
