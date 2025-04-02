import React from 'react';
import {StyledItem, StyledNavLink, Text} from "./Header.jsx";


export const NavItem = (props) => {
    return (
        <StyledItem>
            <StyledNavLink to={props.path} activeClassName="active">
                <Text>{props.title}</Text>
            </StyledNavLink>
        </StyledItem>
    );
};