import React from "react";
// import { useHistory } from "react-router-dom";
// import { useHistory } from 'react-router-dom'
import { Button, Form, Modal, ModalBody, ModalHeader } from "reactstrap";
import InterviewForm from "../Forms/interview/interviewForm";
import JobCat from "../Forms/JobCate/JobCat";
import { useSelector } from "react-redux";
import Loader from "./Loader";
// const slug = localStorage.getItem("slug");
const InterviewDialog = ({
  interviewHandler = () => {},
  candidateId,
  interview,
  setInterview,
  clients,
  update,
  candidates,
  setCreate,
  create,
  setUpdate,
  loginUser,
  setSelectCandidateValidation,
  setSelectCompanyValidation,
  setDateValidation,
  setInterviewStartValidation,
  setInterviewValidation,
  show,
  setShow,
  loading,
}) => {
  // const history = useHistory();
  const handleChange = (e, text = "") => {
    if (text == "candidate") {
      setInterview({ ...interview, candidateId: e.value });
    } else {
      if (e?.target?.id === undefined) {
        if (e.key === undefined) {
          setInterview({ ...interview, [e.id]: e.value });
        } else {
          setInterview({ ...interview, [e.key]: e.id });
        }
      } else {
        setInterview({
          ...interview,
          [e.target.id]: e.target.value.replace(/[^a-z ]/gi, ""),
        });
      }
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

            // if (candidateId) {
            //   history.push(`/${slug}/candidate`);
            // }
          }}
        ></ModalHeader>
        {loading == true ? (
          <Loader loading={loading} theamcolour={themecolor} />
        ) : null}
        <ModalBody className="px-sm-5 pt-50 pb-5">
          <InterviewForm
            handleChange={handleChange}
            candidateId={candidateId}
            interview={interview}
            setInterview={setInterview}
            show={show}
            create={create}
            clients={clients}
            update={update}
            candidates={candidates}
            loginUser={loginUser}
            setSelectCandidateValidation={setSelectCandidateValidation}
            setSelectCompanyValidation={setSelectCompanyValidation}
            setDateValidation={setDateValidation}
            setInterviewStartValidation={setInterviewStartValidation}
            setInterviewValidation={setInterviewValidation}
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
              onClick={() => interviewHandler()}
            >
              Submit
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default InterviewDialog;
