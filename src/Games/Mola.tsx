import React, { Component, useState } from "react";

import { Container, Row, Col, Label, Input, Button } from "reactstrap";
import { MolaGame } from "./Mola/mola.game";
import MolaState from "./Mola/mola.state";

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

    constructor(props: any) {
        super(props);
        this.state = { gameState: new MolaState([0, 0, 0, 0, 0, 0, 0, 0, 0]) }
    }

    handleUpdate(gameState: MolaState) {
        this.setState({ gameState: gameState }, 
            () => { console.log("Component state: " + this.state.gameState.positions) });
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
                            <Input type="checkbox" /> Spieler 1 Computer
                        </Row>
                        <Row>
                            <Input type="checkbox" /> Spieler 2 Computer
                        </Row>
                        <Row>
                            <Button color="primary"
                                onClick={() => this.game.runGame((gameState: MolaState) => this.handleUpdate(gameState))}>
                                    Neues Spiel
                            </Button>
                        </Row>
                        <Row>
                            <Button color="secondary"> Trainiere KI</Button>
                        </Row>
                    </Col>
                    <Board gameState={this.state.gameState}></Board>
                </Row>
            </Container>)
    }
}

const Board = (props: any) => {
    return (
        <Col sm="12" md="8">
            <Row>
                <Col sm={{ size: 3, offset: 1 }}>
                    <Field player={props.gameState.positions[0]}></Field>
                </Col>
                <Col sm="3">
                    <Field player={props.gameState.positions[1]}></Field>
                </Col>
                <Col sm="3">
                    <Field player={props.gameState.positions[2]}></Field>
                </Col>
            </Row>
            <Row>
                <Col sm={{ size: 3, offset: 1 }}>
                    <Field player={props.gameState.positions[3]}></Field>
                </Col>
                <Col sm="3">
                    <Field player={props.gameState.positions[4]}></Field>
                </Col>
                <Col sm="3">
                    <Field player={props.gameState.positions[5]}></Field>
                </Col>
            </Row>
            <Row>
                <Col sm={{ size: 3, offset: 1 }}>
                    <Field player={props.gameState.positions[6]}></Field>
                </Col>
                <Col sm="3">
                    <Field player={props.gameState.positions[7]}></Field>
                </Col>
                <Col sm="3">
                    <Field player={props.gameState.positions[8]}></Field>
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
        if (player === -1) {
            return styleTwo;
        }
        return styleEmpty;
    }

    return (<div style={getLayout(props.player)}></div>);
}