import { Component } from "react";
import { Navbar, NavbarBrand, NavItem, NavLink, Collapse, Nav, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import React from "react";
import { InformationModal } from "../Dialogs/Information.modal";

interface IState {
    showImpressum: boolean;
    showDsgvo: boolean;
    showAbout: boolean;
}

interface IProps {

}

export class Navigation extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props);
        this.state = {
            showImpressum: false,
            showDsgvo: false,
            showAbout: false
        };
    }

    toggleImpressum(): void {
        this.setState({ showImpressum: !this.state.showImpressum });
    }

    toggleDsgvo(): void {
        this.setState({ showDsgvo: !this.state.showDsgvo });
    }

    toggleAbout(): void {
        this.setState({ showAbout: !this.state.showAbout });
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
                            <NavLink onClick={() => this.toggleAbout()}>Über die Seite</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink onClick={() => this.toggleDsgvo()}>Datenschutz</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink onClick={() => this.toggleImpressum()}>Impressum</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
                <InformationModal
                    open={this.state.showImpressum}
                    toggle={() => this.toggleImpressum()}
                    headline="Impressum">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

                    <p>Duis aute irure dolor in reprehenderit in
                    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                        sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </InformationModal>
                <InformationModal
                    open={this.state.showDsgvo}
                    toggle={() => this.toggleDsgvo()}
                    headline="Datenschutz">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

                    <p>Duis aute irure dolor in reprehenderit in
                    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                        sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </InformationModal>
                <InformationModal
                    open={this.state.showAbout}
                    toggle={() => this.toggleAbout()}
                    headline="Über die Seite">
                    <b>Das Spiel</b>
                    <p>Das Spiel habe ich als historisches Spiel (kleine Mühle) bzw als Variation der runden römischen Mühle
                        im Netz gefunden. Es ist wohl ein Vorlgänger der heutigen Mühlespiele und des Tic Tac Toe.
                        </p>

                    <b>Implementierung</b>
                    <p>Das gesamte Spiel ist in Typescript programmiert und läuft komplett im Browser
                        (keine weiteren Serveranfragen, während des Spiels).
                            Außerdem verwende ich React für den Aufbau der Seite.</p>

                    <b>Spiel KI</b>
                    <p>Initial kennt die KI nur die Zielzustände - also die Positionen auf dem Spielfeld die dazu führen, dass ein
                        Spieler gewinnt. Die Schwierigkeitslevel unterscheiden sich darin, wie weit die KI 'voraus denkt'.
                        </p>
                    <p>
                        <ul>
                            <li>Einfach - 1 Runde, also eigener Zug und idealer Zug des Gegners werden berücksichtigt</li>
                            <li>Normal - 2 Runden</li>
                            <li>Schwierig - 3 Runden</li>
                        </ul>
                    </p>
                    <p>
                        Da das Spielfeld nicht sehr komplex ist funktioniert das bereits recht vernünftig.
                            </p>
                    <p>
                        Wenn ihr Spieler 1 und 2 vom Computer steuern lasst, könnt ihr die die KI aber zusätzlich trainieren.
                        Dabei spielt der Computer 1000x gegen sich selbst und sammelt Daten. Danach wird das Spiel tatsächlich noch
                        etwas herausfordernder.
                        </p>
                </InformationModal>
            </Navbar>)
    }
}