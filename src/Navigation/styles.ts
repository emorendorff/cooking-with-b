import styled from "styled-components";

// #4c6a35;

export const NavigationWrapper = styled.nav`
  align-items: center;
  background-color: #6A0D2B;
  bottom: 0;
  display: flex;
  height: 64px;
  left: 0;
  position: fixed;
  justify-content: space-around;
  width: 100%;
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
