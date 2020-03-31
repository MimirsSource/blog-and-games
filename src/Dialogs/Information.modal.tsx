import React from "react"

import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap"

export interface InformationProps {
    open: boolean,
    toggle: () => void,
    headline: string,
    children: React.ReactNode;
}

export const InformationModal = (props: InformationProps) => {
    return (
        <div>
            <Modal isOpen={props.open} toggle={props.toggle} >
                <div className="information">
                    <ModalHeader toggle={props.toggle}>{props.headline}</ModalHeader>
                    <ModalBody>
                        {props.children}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={props.toggle}>Schließen</Button>
                    </ModalFooter>
                </div>
            </Modal>
        </div>
    )
}