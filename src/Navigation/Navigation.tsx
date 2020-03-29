import { Component } from "react";
import { Navbar, NavbarBrand, NavItem, NavLink, Collapse, Nav, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import React from "react";

interface IState {
    showImpressum: boolean;
}

interface IProps {

}

export class Navigation extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props);
        this.state = { showImpressum: false };
    }

    toggleImpressum(): void {
        this.setState({ showImpressum: !this.state.showImpressum });
    }

    render() {
        return (
            <Navbar className="navigation" expand="md">
                <NavbarBrand >Website Bastelei ...</NavbarBrand>
                <Collapse isOpen={true} navbar>
                    <Nav>
                        {/* <NavItem>
                            <NavLink>Games</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink>Blog</NavLink>
                        </NavItem>*/}
                        <NavItem>
                            <NavLink onClick={() => this.toggleImpressum()}>Impressum</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
                <Impressum open={this.state.showImpressum} toggle={() => this.toggleImpressum()}></Impressum>
            </Navbar>)
    }
}

const Impressum = (props: any) => {
    return (
        <div>
            <Modal isOpen={props.open} toggle={props.toggle} >
                <div className="information">
                    <ModalHeader toggle={props.toggle}>Impressum</ModalHeader>
                    <ModalBody>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={props.toggle}>Schließen</Button>
                    </ModalFooter>
                </div>
            </Modal>
        </div>
    )
}