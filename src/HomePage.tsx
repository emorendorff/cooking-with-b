import DailyPick from "./DailyPick/DailyPick";
import Header from "./Header/Header";
import Navigation from "./Navigation/Navigation";

const HomePage = () => {
  return (
    <>
      <Header />
      <DailyPick />
      <Navigation />
    </>
  );
}

export default HomePage;