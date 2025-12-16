import { useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../context/AuthContext'

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f4f1e1;
  border-radius: 8px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Input = styled.input`
  padding: 12px;
  border: 1px solid #c6b7a8;
  border-radius: 4px;
  font-size: 16px;
`

const Button = styled.button`
  background-color: #6a0d2b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #8a1d3b;
  }

  &:disabled {
    background-color: #c6b7a8;
    cursor: not-allowed;
  }
`

const ToggleLink = styled.button`
  background: none;
  border: none;
  color: #6a0d2b;
  cursor: pointer;
  text-decoration: underline;
`

const ErrorMessage = styled.div`
  color: #dc3545;
  padding: 8px;
  background-color: #f8d7da;
  border-radius: 4px;
`

const Login = () => {
  const { signIn, signUp } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password, displayName)
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <h2>{isSignUp ? 'Sign Up' : 'Log In'}</h2>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Form onSubmit={handleSubmit}>
        {isSignUp && (
          <Input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        )}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
        </Button>
      </Form>

      <p style={{ marginTop: '16px', textAlign: 'center' }}>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <ToggleLink type="button" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Log In' : 'Sign Up'}
        </ToggleLink>
      </p>
    </Container>
  )
}

export default Login
