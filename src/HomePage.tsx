import DailyPick from "./DailyPick/DailyPick";
import Header from "./Header/Header";
import Navigation from "./Navigation/Navigation";
import RecipeBrowser from "./RecipeBrowser/RecipeBrowser";

const HomePage = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1 overflow-y-auto p-4 mt-16 mb-16">
      <DailyPick />
      <RecipeBrowser />
    </main>
    <Navigation />
  </div>
);

export default HomePage;
