import styled from "styled-components";

export const NavigationWrapper = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #F4F1E1;
  z-index: 1000;
  background-color: #6A0D2B;
  height: 64px;
`;

export const NavList = styled.ul`
  display: flex;
  justify-content: space-around;
  list-style: none;
  margin: 0;
  padding: 0;
  height: 100%;
`;

export const NavItem = styled.li`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
  padding: 8px 16px;
  gap: 4px;

  a {
    color: white;
    text-decoration: none;
    font-size: 12px;
  }
`;
