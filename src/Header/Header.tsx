import styled from "styled-components";

const HeaderWrap = styled.header`
  height: 64px;
  display: flex;
  flex-direction: column;
`;

const BSpan = styled.span`
  color: #d18b4f;
`;

const Header = () => (
  <HeaderWrap>
    <h1>
      Chef Boyar-<BSpan>B</BSpan>
    </h1>
  </HeaderWrap>
);

export default Header;
