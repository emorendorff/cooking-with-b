import { Link } from "react-router-dom";
import styled from "styled-components";
import { Settings } from "../assets";
import { useAuth } from "../context/AuthContext";

const HeaderWrap = styled.header`
  align-items: center;
  background-color: #f4f1e1;
  display: flex;
  height: 64px;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
`;

const SettingsLink = styled(Link)`
  align-items: center;
  color: #d18b4f;
  display: flex;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
`;

const BSpan = styled.span`
  color: #d18b4f;
`;

const Header = () => {
  const { user } = useAuth();
  return (
    <HeaderWrap>
      <Link to="/" style={{ textDecoration: "none" }}>
        <h1>
          Chef Boyar-<BSpan>B</BSpan>
        </h1>
      </Link>
      {user && (
        <SettingsLink to="/settings">
          <Settings width={24} height={24} />
        </SettingsLink>
      )}
    </HeaderWrap>
  );
};

export default Header;
