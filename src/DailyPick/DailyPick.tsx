import styled from "styled-components";
import { recipes } from "../recipes";

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 32px;
  background-color: #c6b7a8;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;

export const ImageBox = styled.div`
  display: flex;
  height: 250px;
  overflow: hidden;
`;
const DailyImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const DailyPick = () => {
  const placeholder = recipes[1];
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
