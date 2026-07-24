import React from "react";
import { Modal, ModalBody } from "reactstrap";
import ComponentSpinner from "../../@core/components/spinner/Loading-spinner";

const Loader = ({ loading, theamcolour }) => {
  return (
    <Modal
      className="modal-dialog-centered modal-xl modal-loader"
      isOpen={loading}
    >
      <ModalBody>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ComponentSpinner theamcolour={theamcolour} />
        </div>
      </ModalBody>
    </Modal>
  );
};

export default Loader;
