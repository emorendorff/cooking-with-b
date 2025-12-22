import { styled } from "styled-components"

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

export const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  margin-top: 64px;
  margin-bottom: 64px;
`

export const Section = styled.section`
  max-width: 800px;
  margin: 0 auto 32px;
`

export const SectionTitle = styled.h2`
  font-family: var(--font-display);
  color: #6a0d2b;
  margin-bottom: 16px;
`

export const StatusMessage = styled.div<{ $success?: boolean }>`
  margin: 20px auto;
  max-width: 800px;
  padding: 12px;
  border-radius: 4px;
  background-color: ${(props) => (props.$success ? '#e6f7e6' : '#f8d7da')};
  color: ${(props) => (props.$success ? '#28a745' : '#dc3545')};
`

export const LoadingMessage = styled.div`
  text-align: center;
  padding: 48px;
  color: #666;
`