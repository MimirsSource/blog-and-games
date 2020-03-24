import React, { Component } from "react";

import { Container, Row, Col } from "reactstrap";

export class Mola extends Component {

    render() {
        return(
        <Container>
            <Row>
               <Col sm="12" md={{ size:6, offset: 3}}>Game goes here</Col>
            </Row>
        </Container>)
    }
}