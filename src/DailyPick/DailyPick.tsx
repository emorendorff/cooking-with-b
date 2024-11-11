import styled from "styled-components";
import {recipes} from "../recipes";

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 50%; 
  border-radius: 8px;
  padding: 16px;
  background-color: #C6B7A8;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  `;

  const ImageBox = styled.div`
  overflow: hidden;
`;
const DailyImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;  


const DailyPick = () => {
const placeholder = recipes[1]
  return (
    <PreviewContainer>
      <ImageBox>
        <DailyImage src={placeholder.image} alt="Green sauce flowers" />
      </ImageBox>
        <h2>Today's Pick</h2>
        <p>{placeholder.tagline}</p>
    </PreviewContainer>
  );
};

export default DailyPick;
