import { useState } from 'react'
import styled from 'styled-components'
import RecipeForm from './RecipeForm'
import Header from './Header/Header'
import Navigation from './Navigation/Navigation'
import { RecipeFormData, IngredientFormData } from './types'
import { createRecipe } from './lib/api'
import { useAuth } from './context/AuthContext'

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  margin-top: 64px;
  margin-bottom: 64px;
`

const StatusMessage = styled.div<{ success?: boolean }>`
  margin: 20px 0;
  padding: 12px;
  border-radius: 4px;
  background-color: ${(props) => (props.success ? '#e6f7e6' : '#f8d7da')};
  color: ${(props) => (props.success ? '#28a745' : '#dc3545')};
  font-family: var(--font-secondary);
`

const AddRecipePage = () => {
  const { isAdmin } = useAuth()
  const [status, setStatus] = useState<{
    message: string
    success: boolean
  } | null>(null)

  const handleSubmit = async (
    formData: RecipeFormData,
    ingredients: IngredientFormData[]
  ) => {
    try {
      await createRecipe(formData, ingredients)
      setStatus({
        message: 'Recipe submitted successfully!',
        success: true,
      })
    } catch (error) {
      console.error('Error submitting recipe:', error)
      setStatus({
        message: `Failed to submit recipe: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        success: false,
      })
    }
  }

  if (!isAdmin) {
    return (
      <PageContainer>
        <Header />
        <MainContent>
          <h2>Add a New Recipe</h2>
          <StatusMessage success={false}>
            You must be an admin to add recipes.
          </StatusMessage>
        </MainContent>
        <Navigation />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Header />
      <MainContent>
        <h2>Add a New Recipe</h2>

        {status && (
          <StatusMessage success={status.success}>
            {status.message}
          </StatusMessage>
        )}

        <RecipeForm onSubmit={handleSubmit} />
      </MainContent>
      <Navigation />
    </PageContainer>
  )
}

export default AddRecipePage
