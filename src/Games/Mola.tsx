import React, { Component, useState } from "react";

import { Container, Row, Col, Input, Button, Modal, 
    ModalHeader, ModalBody, ModalFooter} from "reactstrap";
import { MolaGame } from "./Mola/mola.game";
import MolaState from "./Mola/mola.state";
import { allStonesSet } from "./Mola/mola.rules";
import { HumanPlayer } from "./Mola/mola.player";
import { InformationModal } from "../Dialogs/Information.modal";

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

    game: MolaGame = new MolaGame();
    userPickedField: number = -1;

    constructor(props: any) {
        super(props);
        this.state = { gameState: MolaState.getInitialState(), showDescription: false }
    }

    handleUpdate(gameState: MolaState) {
        this.setState({ gameState: gameState },
            () => { /* console.log("Component state: " + this.state.gameState.getPositions()) */ });
    }

    handleChangeOne(event: React.ChangeEvent<HTMLInputElement>) {
        this.game.setHumanPlayerOne(!event.target.checked);
    }

    handleChangeTwo(event: React.ChangeEvent<HTMLInputElement>) {
        this.game.setHumanPlayerTwo(!event.target.checked);
    }

    changeDifficutly(event: React.ChangeEvent<HTMLInputElement>) {
        this.game.setDifficulty(parseInt(event.target.value, 10));
    }

    toggleDescription() {
        this.setState({ showDescription: !this.state.showDescription });
    }

    selectField(position: number) {
        if (this.game.gameState.currentPlayer instanceof HumanPlayer) {
            let positions = this.game.gameState.currentState.getPositions();
            if (!allStonesSet(this.game.gameState.currentState, this.game.gameState.currentPlayer)) {
                if (positions[position] === 0) {
                    (this.game.gameState.currentPlayer as HumanPlayer).userChoice = 
                        this.game.gameState.currentState.putStone(this.game.gameState.currentPlayer.getPlayerSymbol(), position);
                }
            } else {
                if (this.userPickedField < 0 && positions[position] === this.game.gameState.currentPlayer.getPlayerSymbol()) {
                    this.userPickedField = position;
                } else {
                    if (positions[position] === 0) {
                        (this.game.gameState.currentPlayer as HumanPlayer).userChoice = 
                            this.game.gameState.currentState.moveStone(this.userPickedField, position);
                        this.userPickedField = -1;
                    }
                }
            }
        }
    }

    render() {
        return (
            <Container>
                <Row className="headline">
                    <Col>
                        <h2>Kleine Mühle (römische Mühle)</h2>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12" md="2" className="controlPanel" >
                        <Row>
                            <Col sm="12" className="checkInput">
                                <Input type="checkbox" onChange={(event) => this.handleChangeOne(event)} /> Spieler 1 Computer
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" className="checkInput">
                                <Input type="checkbox" onChange={(event) => this.handleChangeTwo(event)} /> Spieler 2 Computer
                            </Col>
                        </Row>
                        {!this.game.gameState.running &&
                            <Row>
                                <Col sm="12" className="controlButton">
                                    <Button color="primary"
                                        onClick={() => this.game.runGame((gameState: MolaState) => this.handleUpdate(gameState))}>
                                        Neues Spiel
                                </Button>
                                </Col>
                            </Row>
                        }

                        {this.game.gameState.running &&
                            <Row>
                                <Col sm="12" className="controlButton">
                                    <Button color="secondary"
                                        onClick={() => { this.game.stopGame((gameState: MolaState) => this.handleUpdate(gameState)) }}>
                                        Spiel beenden
                                    </Button>
                                </Col>
                            </Row>
                        }
                        <Row>
                            <Col sm="12" className="controlButton">
                                <Button color="info"
                                    onClick={() => { this.toggleDescription() }}>
                                    Spielregeln</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" className="controlButton">
                                <Input type="select" name="level" id="level" onChange={(event) => {this.changeDifficutly(event)}}>
                                    <option value="0" selected >Einfach</option>
                                    <option value="1" >Normal</option>
                                    <option value="2" >Schwierig</option>
                                </Input>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" className="controlButton">
                                <Button color="secondary"
                                    onClick={() => this.game.trainAI((gameState: MolaState) => this.handleUpdate(gameState), 1000)}>
                                    Trainiere KI</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Board gameState={this.state.gameState} selectField={(position: number) => this.selectField(position)}></Board>
                    <InformationModal 
                    open={this.state.showDescription} 
                    toggle={() => { this.toggleDescription() }}
                    headline="Spielregeln">
                        <b>Ziel des Spiels</b>
                        <p>Jeder Spieler besitzt drei Spielsteine.</p>
                        <p>Gewinner ist, wer seine drei Steine zuerst in eine Reihe gelegt bekommt.</p>
                        <p>Es gelten waagrechte, senkrechte und diagonale Reihen.</p>
                        <b>Ablauf des Spiels</b>
                        <p>Zuerst setzen die Spieler ihre Steine abwechselnd auf das Spielfeld, bis alle Steine gesetzt sind.</p>
                        <p>Sind alle Steine gesetzt darf gezogen oder gesprungen werden.
                            Züge sind jeweils waagrecht und senkrecht erlaubt.
                        </p>
                        <p>Liegt ein gegnerischer Stein neben dem eigenen, kann dieser übersprungen werden, sofern das Feld dahinter frei ist.
                            Es kann nur waagrecht und senkrecht gesprungen werden.
                        </p>
                    </InformationModal>
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