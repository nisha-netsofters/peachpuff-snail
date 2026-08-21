import React from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import AreasForm from "../Forms/Areas/AreasForm";
import Loader from "./Loader";

const AreasDialog = ({
  show,
  setShow,
  loading,
  form,
  setForm,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  cities,
  setCities,
  onSubmit,
  setCreate,
  setUpdate,
}) => {
  return (
    <Modal
      isOpen={show}
      toggle={() => setShow(!show)}
      className="modal-dialog-centered modal-md"
    >
      <ModalHeader
        className="bg-transparent"
        toggle={() => {
          setShow(false);
          setCreate(false);
          setUpdate(false);
        }}
      />
      {loading ? <Loader loading={loading} /> : null}
      <ModalBody className="px-sm-5 pt-50 pb-5">
        <AreasForm
          form={form}
          setForm={setForm}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          cities={cities}
          setCities={setCities}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
          }}
        >
          <Button color="primary" onClick={onSubmit}>
            Submit
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default AreasDialog;
