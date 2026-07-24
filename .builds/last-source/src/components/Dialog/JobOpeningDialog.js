import React from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import JobOpening from "../Forms/JobOpening/JobOpening";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const JobOpeningDialog = ({
  UserActionHandler = () => {},
  jobOpening,
  setJobOpening,
  update,
  setDesignationValidation,
  setCreate,
  setUpdate,
  show,
  setShow,
  loading,
  assignableUsers = [],
  canAssignRecruiter = false,
}) => {
  const handleChange = (e) => {
    if (e?.target?.id === undefined) {
      if (e.key === undefined) {
        setJobOpening({ ...jobOpening, [e.id]: e.value });
      } else {
        setJobOpening({ ...jobOpening, [e.key]: e.id });
      }
    } else {
      setJobOpening({
        ...jobOpening,
        [e.target.id]: e.target.value,
      });
    }
  };
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  return (
    <>
      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-xl"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => {
            setShow(!show);
            setCreate(false);
            setUpdate(false);
          }}
        ></ModalHeader>
        {loading == true ? (
          <Loader loading={loading} theamcolour={themecolor} />
        ) : null}
        <ModalBody className="px-sm-5 pt-50 pb-5">
          <JobOpening
            update={update}
            jobOpening={jobOpening}
            setJobOpening={setJobOpening}
            handleChange={handleChange}
            setDesignationValidation={setDesignationValidation}
            assignableUsers={assignableUsers}
            canAssignRecruiter={canAssignRecruiter}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <Button
              type="button"
              className="add-new-user"
              color="default"
              style={{ backgroundColor: themecolor, color: "white" }}
              onClick={() => UserActionHandler()}
            >
              Submit
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default JobOpeningDialog;
