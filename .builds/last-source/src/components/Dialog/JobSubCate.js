import React from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import JobSubCatForm from "../Forms/JobSubCate/JobSubCat";
import Loader from "./Loader";

const JobSubCateDialog = ({
  handler = () => {},
  jobSubCat,
  setJobSubCat,
  categoryOptions = [],
  setCreate,
  setUpdate,
  setNameValidation,
  show,
  setShow,
  loading,
}) => {
  const handleChange = (e) => {
    if (e?.target?.id === undefined) {
      setJobSubCat({ ...jobSubCat, [e.id]: e.value });
    } else {
      setJobSubCat({
        ...jobSubCat,
        [e.target.id]: e.target.value,
      });
    }
  };

  return (
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
      />
      {loading ? <Loader loading={loading} /> : null}
      <ModalBody className="px-sm-5 pt-50 pb-5">
        <JobSubCatForm
          handleChange={handleChange}
          jobSubCat={jobSubCat}
          categoryOptions={categoryOptions}
          setNameValidation={setNameValidation}
          onCategoryChange={(e) =>
            setJobSubCat({ ...jobSubCat, jobCategoryId: e?.value || "" })
          }
        />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
          <Button color="primary" onClick={() => handler()}>
            Submit
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default JobSubCateDialog;
