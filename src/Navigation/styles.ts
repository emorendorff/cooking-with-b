import styled from "styled-components";

export const NavigationWrapper = styled.nav`
  align-items: center;
  background-color: #4c6a35;
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
  justify-content: space-around;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 50%;
`;

export const NavItem = styled.li`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  padding: 16px;
`;
