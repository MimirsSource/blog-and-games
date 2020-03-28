import React, { Component, useState } from "react";

import { Container, Row, Col, Label, Input, Button } from "reactstrap";
import { MolaGame } from "./Mola/mola.game";
import MolaState from "./Mola/mola.state";
import { allStonesSet } from "./Mola/mola.rules";
import { HumanPlayer } from "./Mola/mola.player";

interface IProps {
}

interface IState {
    gameState: MolaState;
}

export class Mola extends React.Component<IProps, IState> {

    headlineStyle = {
        backgroundColor: '#040b63',
        border: '0.5rem outset #040b63',
        paddingTop: '0.5rem',
        marginBottom: '1rem'
    };

    game: MolaGame = new MolaGame();
    userPickedField: number = -1;

    constructor(props: any) {
        super(props);
        this.state = { gameState: new MolaState([0, 0, 0, 0, 0, 0, 0, 0, 0]) }
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
                        <h1>Mola - große Mühle</h1>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12" md="2">
                        <Row>
                            <Input type="checkbox" onChange={(event) => this.handleChangeOne(event)} /> Spieler 1 Computer
                        </Row>
                        <Row>
                            <Input type="checkbox" onChange={(event) => this.handleChangeTwo(event)} /> Spieler 2 Computer
                        </Row>
                        <Row>
                            <Button color="primary"
                                onClick={() => this.game.runGame((gameState: MolaState) => this.handleUpdate(gameState))}>
                                Neues Spiel
                            </Button>
                        </Row>
                        <Row>
                            <Button color="secondary"
                                onClick={() => this.game.trainAI((gameState: MolaState) => this.handleUpdate(gameState), 1000)}>
                                Trainiere KI</Button>
                        </Row>
                    </Col>
                    <Board gameState={this.state.gameState} selectField={(position: number) => this.selectField(position)}></Board>
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
        width: '12vw',
        height: '12vw',
        backgroundColor: 'white',
        border: '0.5rem outset white',
        margin: '0.2em'
    };

    let styleOne = {
        width: '12vw',
        height: '12vw',
        backgroundColor: '#043a63',
        border: '0.5rem outset #043a63',
        margin: '0.2em'
    };

    let styleTwo = {
        width: '12vw',
        height: '12vw',
        backgroundColor: '#63041f',
        border: '0.5rem outset #63041f',
        margin: '0.2em'
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

    return (<div style={getLayout(props.player)} onClick={props.select}></div>);
}