import styled from "styled-components";

// #4c6a35;

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
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const NavItem = styled.li`
  color: white;
  cursor: pointer;
  text-decoration: none;
  padding: 16px;
`;
