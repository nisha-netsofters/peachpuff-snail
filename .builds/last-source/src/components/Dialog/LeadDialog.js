import React from "react";
import { Button, Form, Modal, ModalBody, ModalHeader } from "reactstrap";
import FeedBack from "../Forms/feedBack/FeedBack";
import Attachment_File from "../Forms/lead/Attachment_File";
import Lead from "../Forms/lead/Lead";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const LeadDialog = ({
  leadHandler = () => {},
  lead,
  setLead,
  setCreate,
  setUpdate,
  // setCategoryValidation,
  show,
  setShow,
  loading,
}) => {
  const handleChange = (e) => {
    if (e?.target?.id === undefined) {
      setLead({ ...lead, [e.id]: e.value });
    } else {
      setLead({
        ...lead,
        [e.target.id]: e.target.value.replace(/[^a-z ]/gi, ""),
      });
    }
  };

  // const fileOnChangeHandler = (e) => {
  //     setLead({
  //         ...lead,
  //         [e.target.id]: e.target.files[0]
  //     })
  // }
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
          <Lead setLead={setLead} handleChange={handleChange} lead={lead} />
          {/* <Attachment_File fileOnChangeHandler={fileOnChangeHandler} /> */}

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
              onClick={() => leadHandler()}
            >
              Submit
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default LeadDialog;
