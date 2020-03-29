import React, { Component, useState } from "react";

import { Container, Row, Col, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { MolaGame } from "./Mola/mola.game";
import MolaState from "./Mola/mola.state";
import { allStonesSet } from "./Mola/mola.rules";
import { HumanPlayer } from "./Mola/mola.player";

/**
 * Color scheme:
 * Brown  = #4B3B47
 * Red    = #C14953
 * Yellow = #E5DCC5
 * Purple = #4D2D52
 * Blue   = #1D1A31
 */

 /**
 * Color scheme 2:
 * Brown  = #2D080A
 * Purple = #3D315B
 * BlueL  = #444B6E
 * Violet = #4D2D52
 * Blue   = #1D1A31
 */

interface IProps {
}

interface IState {
    gameState: MolaState;
    showDescription: boolean;
}

export class Mola extends React.Component<IProps, IState> {

    headlineStyle = {
        paddingTop: '2rem',
        marginBottom: '1rem'
    };

    controlStyle = {
        backgroundColor: '#444B6E',
        border: '0.5rem outset #444B6E',
        paddingTop: '0.5rem',
        marginBottom: '1rem',
        overflow: 'hidden'
    };

    controlElementStyle = {
        padding: '0.5rem 0 0.5rem 0',
    };

    game: MolaGame = new MolaGame();
    userPickedField: number = -1;

    constructor(props: any) {
        super(props);
        this.state = { gameState: new MolaState([0, 0, 0, 0, 0, 0, 0, 0, 0]), showDescription: false }
    }

    handleUpdate(gameState: MolaState) {
        this.setState({ gameState: gameState },
            () => { console.log("Component state: " + this.state.gameState.positions) });
    }

    handleChangeOne(event: React.ChangeEvent<HTMLInputElement>) {
        this.game.setHumanPlayerOne(!event.target.checked);
    }

    handleChangeTwo(event: React.ChangeEvent<HTMLInputElement>) {
        this.game.setHumanPlayerTwo(!event.target.checked);
    }

    toggleDescription() {
        this.setState({ showDescription: !this.state.showDescription });
    }

    selectField(position: number) {
        if (this.game.gameState.currentPlayer instanceof HumanPlayer) {
            if (!allStonesSet(this.game.gameState.currentState, this.game.gameState.currentPlayer)) {
                if (this.game.gameState.currentState.positions[position] === 0) {
                    let userChoice = new MolaState(Object.assign([], this.game.gameState.currentState.positions));
                    userChoice.positions[position] = this.game.gameState.currentPlayer.getPlayerSymbol();
                    (this.game.gameState.currentPlayer as HumanPlayer).userChoice = userChoice;
                }
            } else {
                if (this.userPickedField < 0 &&
                    this.game.gameState.currentState.positions[position] === this.game.gameState.currentPlayer.getPlayerSymbol()) {
                    this.userPickedField = position;
                } else {
                    if (this.game.gameState.currentState.positions[position] === 0) {
                        let userChoice = new MolaState(Object.assign([], this.game.gameState.currentState.positions));
                        userChoice.positions[this.userPickedField] = 0;
                        userChoice.positions[position] = this.game.gameState.currentPlayer.getPlayerSymbol();
                        this.userPickedField = -1;
                        (this.game.gameState.currentPlayer as HumanPlayer).userChoice = userChoice;
                    }
                }
            }
        }
    }

    render() {
        return (
            <Container>
                <Row style={this.headlineStyle}>
                    <Col>
                        <h2>Kleine Mühle (römische Mühle)</h2>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12" md="2" style={this.controlStyle}>
                        <Row>
                            <Col sm="12" style={{ padding: '0 0 0 1rem', margin: '0 0 0 1rem' }}>
                                <Input type="checkbox" onChange={(event) => this.handleChangeOne(event)} /> Spieler 1 Computer
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" style={{ padding: '0 0 0 1rem', margin: '0 0 0 1rem' }}>
                                <Input type="checkbox" onChange={(event) => this.handleChangeTwo(event)} /> Spieler 2 Computer
                            </Col>
                        </Row>
                        {!this.game.gameState.running &&
                            <Row>
                                <Col sm="12" style={this.controlElementStyle}>
                                    <Button color="primary" style={{ width: '90%' }}
                                        onClick={() => this.game.runGame((gameState: MolaState) => this.handleUpdate(gameState))}>
                                        Neues Spiel
                                </Button>
                                </Col>
                            </Row>
                        }

                        {this.game.gameState.running &&
                            <Row>
                                <Col sm="12" style={this.controlElementStyle}>
                                    <Button color="secondary" style={{ width: '90%' }}
                                        onClick={() => { this.game.stopGame((gameState: MolaState) => this.handleUpdate(gameState)) }}>
                                        Spiel beenden
                                    </Button>
                                </Col>
                            </Row>
                        }
                        <Row>
                            <Col sm="12" style={this.controlElementStyle}>
                                <Button color="info" style={{ width: '90%' }}
                                    onClick={() => { this.toggleDescription() }}>
                                    Spielregeln</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" style={this.controlElementStyle}>
                                <Button color="secondary" style={{ width: '90%' }}
                                    onClick={() => this.game.trainAI((gameState: MolaState) => this.handleUpdate(gameState), 1000)}>
                                    Trainiere KI</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Board gameState={this.state.gameState} selectField={(position: number) => this.selectField(position)}></Board>
                    <Description open={this.state.showDescription} toggle={() => { this.toggleDescription() }}></Description>
                </Row>
            </Container>)
    }
}

const Board = (props: any) => {
    return (
        <Col sm="12" md="8">
            <Row>
                <Col sm={{ size: 3, offset: 1 }}>
                    <Field player={props.gameState.positions[0]} select={() => props.selectField(0)}></Field>
                </Col>
                <Col sm="3">
                    <Field player={props.gameState.positions[1]} select={() => props.selectField(1)}></Field>
                </Col>
                <Col sm="3">
                    <Field player={props.gameState.positions[2]} select={() => props.selectField(2)}></Field>
                </Col>
            </Row>
            <Row>
                <Col sm={{ size: 3, offset: 1 }}>
                    <Field player={props.gameState.positions[3]} select={() => props.selectField(3)}></Field>
                </Col>
                <Col sm="3">
                    <Field player={props.gameState.positions[4]} select={() => props.selectField(4)}></Field>
                </Col>
                <Col sm="3">
                    <Field player={props.gameState.positions[5]} select={() => props.selectField(5)}></Field>
                </Col>
            </Row>
            <Row>
                <Col sm={{ size: 3, offset: 1 }}>
                    <Field player={props.gameState.positions[6]} select={() => props.selectField(6)}></Field>
                </Col>
                <Col sm="3">
                    <Field player={props.gameState.positions[7]} select={() => props.selectField(7)}></Field>
                </Col>
                <Col sm="3">
                    <Field player={props.gameState.positions[8]} select={() => props.selectField(8)}></Field>
                </Col>
            </Row>
        </Col>);
}

const Field = (props: any) => {

    let styleEmpty = {
        backgroundColor: 'white',
        borderColor: 'white',
    };

    let styleOne = {
        backgroundColor: '#3D315B',
        border: '0.5rem outset #3D315B',
    };

    let styleTwo = {
        backgroundColor: '#C14953',
        border: '0.5rem outset #C14953',
    };

    let getLayout = function (player: number) {
        console.log('Player ' + player)
        if (player === 1) {
            return styleOne;
        }
        if (player === 2) {
            return styleTwo;
        }
        return styleEmpty;
    }

    return (<div style={getLayout(props.player)} onClick={props.select} className="gamefield"></div>);
}

const Description = (props: any) => {
    return (
        <div>
            <Modal isOpen={props.open} toggle={props.toggle}>
                <div className="information">
                    <ModalHeader toggle={props.toggle}>Spielanleitung</ModalHeader>
                    <ModalBody>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={props.toggle}>Schließen</Button>
                    </ModalFooter>
                </div>
            </Modal>
        </div>
    );
}