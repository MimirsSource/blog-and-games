import React, { Component } from "react";

import { Container, Row, Col, Label, Input, Button } from "reactstrap";

export class Mola extends Component {

    headlineStyle = {
        backgroundColor: '#040b63',
        border: '0.5rem outset #040b63',
        paddingTop: '0.5rem',
        marginBottom: '1rem'
    };

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
                            <Button color="primary"> Neues Spiel</Button>
                        </Row>
                        <Row>
                            <Button color="secondary"> Trainiere KI</Button>
                        </Row>
                    </Col>
                    <Board></Board>
                </Row>
            </Container>)
    }
}

const Board = () => {
    return (
        <Col sm="12" md="8">
            <Row>
                <Col sm={{size:3, offset: 1}}>
                    <Field></Field>
                </Col>
                <Col sm="3">
                    <Field></Field>
                </Col>
                <Col sm="3">
                    <Field></Field>
                </Col>
            </Row>
            <Row>
                <Col sm={{size:3, offset: 1}}>
                    <Field></Field>
                </Col>
                <Col sm="3">
                    <Field player={1}></Field>
                </Col>
                <Col sm="3">
                    <Field></Field>
                </Col>
            </Row>
            <Row>
                <Col sm={{size:3, offset: 1}}>
                    <Field player={2}></Field>
                </Col>
                <Col sm="3">
                    <Field></Field>
                </Col>
                <Col sm="3">
                    <Field></Field>
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

    let getLayout = function(player: number) {
        console.log('Player '+ player)
        if(player === 1) {
            return styleOne;
        }
        if(player === 2) {
            return styleTwo;
        }
        return styleEmpty;
    }

    return (<div style={getLayout(props.player)}>{props.player}</div>);
}