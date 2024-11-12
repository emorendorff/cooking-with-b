import DailyPick from "./DailyPick/DailyPick";
import Header from "./Header/Header";
import Navigation from "./Navigation/Navigation";
import RecipeBrowser from "./RecipeBrowser/RecipeBrowser";

import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  margin-top: 64px;
  margin-bottom: 64px;
`;

const HomePage = () => {
  return (
    <PageContainer>
      <Header />
      <MainContent>
        <DailyPick />
        <RecipeBrowser />
      </MainContent>
      <Navigation />
    </PageContainer>
  );
};

export default HomePage;
