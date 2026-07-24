import { Modal, ModalHeader } from 'reactstrap'

import React from 'react'
import { documentationImageLink } from '../configs/config'
import { X } from 'react-feather'

const DocumentationModal = ({ setModal, modal }) => {

    return (
        <Modal isOpen={modal}
            toggle={() => setModal(!modal)}
            className="modal-dialog-centered modal-lg"
        >
            <img className='img-fluid position-relative' src={documentationImageLink} />
            <div className='position-absolute' style={{ right: "1px", cursor: "pointer" }} onClick={() => setModal(!modal)} >
                <X />
            </div>
        </Modal>
    )
}

export default DocumentationModal