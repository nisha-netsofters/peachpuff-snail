import React from "react";
import { Button, Form, Modal, ModalBody, ModalHeader } from "reactstrap";
import FeedBack from "../Forms/feedBack/FeedBack";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const FeedBackDialog = ({
  feedBackHandler = () => {},
  feedBack,
  setFeedBack,
  setCreate,
  setUpdate,
  loading,
  show,
  setShow,
}) => {
  const handleChange = (e) => {
    if (e?.target?.id === undefined) {
      setFeedBack({ ...feedBack, [e.id]: e.value });
    } else {
      setFeedBack({ ...feedBack, [e.target.id]: e.target.value });
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
        {loading == true ? (
          <Loader loading={loading} theamcolour={themecolor} />
        ) : null}
        <ModalBody className="px-sm-5 pt-50 pb-5">
          <FeedBack
            handleChange={handleChange}
            setFeedBack={setFeedBack}
            feedBack={feedBack}
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
              onClick={() => feedBackHandler()}
              style={{ backgroundColor: themecolor, color: "white" }}
            >
              Submit
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default FeedBackDialog;
