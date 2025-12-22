import DailyPick from "./DailyPick/DailyPick";
import Header from "./Header/Header";
import Navigation from "./Navigation/Navigation";
import { MainContent, PageContainer } from "./pages/styles";
import RecipeBrowser from "./RecipeBrowser/RecipeBrowser";

const HomePage = () => (
  <PageContainer>
    <Header />
    <MainContent>
      <DailyPick />
      <RecipeBrowser />
    </MainContent>
    <Navigation />
  </PageContainer>
);

export default HomePage;
