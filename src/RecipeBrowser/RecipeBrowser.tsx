import styled from "styled-components";
import { Recipe, recipes } from "../recipes";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Image = styled.img`
  height: 100%;
  object-fit: cover;
  width: 100%;
`;
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
`;

const ImageBox = styled.div`
  display: flex;
  height: 100px;
  overflow: hidden;
`;

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  return (
    <CardContainer>
      <ImageBox>
        <Image src={recipe.image} alt={recipe.name} />
      </ImageBox>
      <h3>{recipe.name}</h3>
      <p>{recipe.tagline}</p>
    </CardContainer>
  );
};

const RecipeBrowser = () => {
  return (
    <div style={{ marginTop: "12px" }}>
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        centerMode={true}
        className=""
        containerClass="container-with-dots"
        dotListClass=""
        draggable
        focusOnSelect={false}
        infinite
        itemClass="test"
        keyBoardControl
        minimumTouchDrag={10}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={{
          desktop: {
            breakpoint: {
              max: 3000,
              min: 1024
            },
            items: 3,
            partialVisibilityGutter: 40
          },
          mobile: {
            breakpoint: {
              max: 344,
              min: 0
            },
            items: 1,
            partialVisibilityGutter: 30
          },
          tablet: {
            breakpoint: {
              max: 1024,
              min: 464
            },
            items: 2,
            partialVisibilityGutter: 30
          }
        }}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        {recipes &&
          recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
      </Carousel>
    </div>
  );
};

export default RecipeBrowser;
