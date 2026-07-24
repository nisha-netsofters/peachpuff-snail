import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { CheckCircle } from 'react-feather';

const ResumeThankYouPopup = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} toggle={onClose} className="modal-dialog-centered">
      {/* <ModalHeader toggle={onClose} className="border-0 pb-3">
        <div className="d-flex align-items-center justify-content-center">
          <CheckCircle size={24} className="text-success me-2" />
          Application Submitted
        </div>
      </ModalHeader> */}
      <ModalBody className="text-center p-2 rounded-3">
        <CheckCircle size={64} className="text-success mb-1" />
        <h4 className="text-success mb-2">Thank You!</h4>
        <p className="mb-0">
          Your resume has been successfully submitted. We will review your 
          application and contact you soon.
        </p>
      </ModalBody>
      <ModalFooter className="border-0 justify-content-center">
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ResumeThankYouPopup;
