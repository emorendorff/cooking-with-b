import { useState } from "react";
import { Link } from "react-router-dom";
import { RecipeWithRelations } from "../types";

interface RecipeCardProps {
  recipe: RecipeWithRelations;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const primaryImage = recipe.images?.find(
    (img) => img.role === "primary"
  )?.url;

  return (
    <Link to={`/recipes/${recipe.id}`} className="no-underline text-inherit">
      <div className="bg-tan-light rounded-lg shadow-lg flex flex-col p-4 w-44 h-64 cursor-pointer transition-transform hover:-translate-y-1">
        <div className="relative h-25 overflow-hidden rounded">
          {primaryImage ? (
            <>
              <div
                className={`absolute inset-0 bg-linear-to-r from-tan-light via-tan-lighter to-tan-light bg-size-[200%_100%] animate-shimmer transition-opacity duration-300 pointer-events-none ${
                  imageLoaded ? "opacity-0" : "opacity-100"
                }`}
              />
              <img
                src={primaryImage}
                alt={recipe.name}
                onLoad={() => setImageLoaded(true)}
                className={`min-h-full w-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-tan to-tan-hover rounded text-4xl">
              🍽️
            </div>
          )}
        </div>
        <h3 className="my-2 text-base font-semibold text-burgundy text-center">
          {recipe.name}
        </h3>
        <p className="m-0 text-xs text-brown text-center line-clamp-3">
          {recipe.tagline}
        </p>
      </div>
    </Link>
  );
};

export default RecipeCard;
