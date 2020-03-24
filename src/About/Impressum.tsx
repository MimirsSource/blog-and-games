import React, { Component } from "react";

import { Container, Row, Col } from "reactstrap";

export class Impressum extends Component {

    render() {
        return(
        <Container>
            <Row>
               <Col sm="12" md={{ size:6, offset: 3}}>Navigation goes here</Col>
            </Row>
        </Container>)
    }
}