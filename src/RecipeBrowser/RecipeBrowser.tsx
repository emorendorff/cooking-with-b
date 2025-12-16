import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Recipe } from '../types'
import { getRecipes } from '../lib/api'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

const Image = styled.img`
  height: 100%;
  object-fit: cover;
  width: 100%;
`

const CardContainer = styled.div`
  background-color: #c6b7a8;
  border-radius: 8px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  display: flex;
  flex-direction: column;
  margin-right: 12px;
  padding: 16px;
  width: 175px;
  height: 250px;
`

const ImageBox = styled.div`
  display: flex;
  height: 100px;
  overflow: hidden;
  background-color: #e0d6c8;
  border-radius: 4px;
`

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b7355;
  font-size: 24px;
`

interface RecipeCardProps {
  recipe: Recipe
  primaryImage?: string
}

const RecipeCard = ({ recipe, primaryImage }: RecipeCardProps) => {
  return (
    <CardContainer>
      <ImageBox>
        {primaryImage ? (
          <Image src={primaryImage} alt={recipe.name} />
        ) : (
          <PlaceholderImage>🍽️</PlaceholderImage>
        )}
      </ImageBox>
      <h3>{recipe.name}</h3>
      <p>{recipe.tagline}</p>
    </CardContainer>
  )
}

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    partialVisibilityGutter: 40,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    partialVisibilityGutter: 30,
  },
  mobile: {
    breakpoint: { max: 344, min: 0 },
    items: 1,
    partialVisibilityGutter: 30,
  },
}

const RecipeBrowser = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const data = await getRecipes()
        setRecipes(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recipes')
      } finally {
        setLoading(false)
      }
    }
    fetchRecipes()
  }, [])

  if (loading) return <div>Loading recipes...</div>
  if (error) return <div>Error: {error}</div>
  if (recipes.length === 0) return <div>No recipes yet!</div>

  return (
    <div style={{ marginTop: '12px' }}>
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        centerMode={true}
        draggable
        infinite
        keyBoardControl
        minimumTouchDrag={10}
        pauseOnHover
        responsive={responsive}
        swipeable
      >
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </Carousel>
    </div>
  )
}

export default RecipeBrowser
