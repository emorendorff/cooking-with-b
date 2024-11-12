import styled from "styled-components";

const HeaderWrap = styled.header`
  background-color: #f4f1e1;
  display: flex;
  flex-direction: column;
  height: 64px;
  left: 0;
  padding: 0 16px;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
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
