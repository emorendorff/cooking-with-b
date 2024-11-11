import React from "react";
import { NavigationWrapper, NavItem, NavList } from "./styles";

const Navigation = () => {
  return (
    <NavigationWrapper>
      <NavList>
        <NavItem>Home</NavItem>
        <NavItem>Search</NavItem>
      </NavList>
    </NavigationWrapper>
  );
};

export default Navigation;
