import React from "react";
import { Button, Form, Modal, ModalBody, ModalHeader } from "reactstrap";
import JobCat from "../Forms/JobCate/JobCat";
import Loader from "./Loader";

const JobDescription = ({
  jobCatHandler = () => {},
  jobCat,
  setJobCat,
  setCreate,
  setUpdate,
  setCategoryValidation,
  show,
  setShow,
  loading,
}) => {
  const handleChange = (e) => {
    if (e?.target?.id === undefined) {
      setJobCat({ ...jobCat, [e.id]: e.value });
    } else {
      setJobCat({
        ...jobCat,
        [e.target.id]: e.target.value.replace(/[^a-z 0-9 "/"]/gi, ""),
      });
    }
  };

  return (
    <>
      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-md"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => {
            setShow(!show);
            setCreate(false);
            setUpdate(false);
          }}
        ></ModalHeader>
        {loading == true ? <Loader loading={loading} /> : null}
        <ModalBody className="px-sm-5 pt-50 pb-5">
          <JobCat
            handleChange={handleChange}
            jobCat={jobCat}
            setCategoryValidation={setCategoryValidation}
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
              color="primary"
              onClick={() => jobCatHandler()}
            >
              Submit
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default JobDescription;
