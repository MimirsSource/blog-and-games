import { Component } from "react";
import { Navbar, NavbarBrand, NavItem, NavLink, Collapse, Nav } from 'reactstrap';
import React from "react";

export class Navigation extends Component {

    render() {
        return(
            <Navbar color="dark" expand="md">
                <NavbarBrand href="/">Toms Playground</NavbarBrand>
                <Collapse isOpen={true} navbar>
                    <Nav>
                        <NavItem>
                            <NavLink>Games</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink>Blog</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink>Impressum</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>)
    }
}