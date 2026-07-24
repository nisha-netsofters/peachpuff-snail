import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Form, Modal, ModalBody, ModalHeader } from "reactstrap";
import Attachment_File from "../Forms/onBoarding/Attachment_File";
import OnBoarding from "../Forms/onBoarding/OnBoarding";
import Recruiter from "../Forms/onBoarding/Recruiter";
import Loader from "./Loader";

const OnBoardingDialog = ({
  UserActionHandler = () => {},
  onBoarding,
  setOnBoarding,
  users,
  update,
  setCreate,
  setUpdate,
  show,
  setShow,
  loading,
}) => {
  const loginUser = useSelector((state) => state.auth.user);

  const [isRecruiter, setIsRecruiter] = useState(false);

  useEffect(() => {
    if (loginUser?.role?.name === "Recruiter") {
      setIsRecruiter(true);
    }
  }, [loginUser]);

  const handleChange = (e) => {
    if (e?.target?.id === undefined) {
      if (e.key === undefined) {
        setOnBoarding({ ...onBoarding, [e.id]: e.value });
      } else {
        setOnBoarding({ ...onBoarding, [e.key]: e.id });
      }
    } else {
      setOnBoarding({
        ...onBoarding,
        [e.target.id]: e.target.value.replace(/[^a-z ]/gi, ""),
      });
    }
  };

  const fileOnChangeHandler = (e) => {
    setOnBoarding({
      ...onBoarding,
      [e.target.id]: e.target.files[0],
    });
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
          <OnBoarding
            update={update}
            onBoarding={onBoarding}
            setOnBoarding={setOnBoarding}
            handleChange={handleChange}
            users={users}
            isRecruiter={isRecruiter}
          />

          <Attachment_File
            update={update}
            onBoarding={onBoarding}
            isRecruiter={isRecruiter}
            fileOnChangeHandler={fileOnChangeHandler}
          />

          <Recruiter
            isRecruiter={isRecruiter}
            onBoarding={onBoarding}
            setOnBoarding={setOnBoarding}
            handleChange={handleChange}
            users={users}
            // setSelectUser={setSelectUser}
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
              onClick={() => UserActionHandler()}
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

export default OnBoardingDialog;
