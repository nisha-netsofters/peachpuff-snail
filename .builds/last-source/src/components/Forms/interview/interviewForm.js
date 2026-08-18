import React, { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import { Row, Col, Input, Label } from "reactstrap";
import { selectThemeColors } from "@utils";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCandidateAPI } from "../../../apis/candidate";
import AsyncSelect from "react-select/async";

const InterviewForm = ({
  interview,
  candidateId,
  setInterview,
  show,
  candidates,
  update,
  clients,
  create,
  loginUser,
  setSelectCandidateValidation,
  setSelectCompanyValidation,
  setDateValidation,
  setInterviewStartValidation,
  setInterviewValidation,
  handleChange = () => {},
}) => {
  const getCompany = useSelector((state) => state.client);
  const [selectCandidate, setSelectCandidate] = useState();
  const location = useLocation().search;
  const first = new URLSearchParams(location).get("first");
  const last = new URLSearchParams(location).get("last");
  const candidateIdURL = new URLSearchParams(location).get("id");
  const [selectCompany, setSelectCompany] = useState();
  const [clientOptions, setClientOptions] = useState([]);
  const [date, setDate] = useState();
  const [joiningDate, setJoiningDate] = useState();
  const [startTime, setStartTime] = useState();
  const [interviewOp, setInterviewOp] = useState();
  const [statusOp, setStatusOp] = useState();
  const [disableField, setDisableField] = useState(false);
  const { agencyDetail } = useSelector((state) => state?.agency);

  const patchInterview = (fields) =>
    setInterview((prev) => ({
      ...(Array.isArray(prev) ? {} : prev || {}),
      ...fields,
    }));

  const getCandidate = async (text) => {
    const payload = {
      filterData: {
        dataMergePermission: agencyDetail?.permission?.dataMerge,
        firstname: text,
      },
    };
    let resp;
    if (text.length >= 2) {
      resp = await getCandidateAPI(payload);
    }
    const data = resp?.results?.map((ele) => {
      ele.label = `${ele.firstname} ${ele.lastname}`;
      ele.value = ele?.id;
      ele.key = ele?.id;
      return ele;
    });
    return data || [];
  };

  useEffect(() => {
    if (create && loginUser?.id) {
      patchInterview({ userId: loginUser.id });
    }

    if (interview?.candidateId) {
      setSelectCandidate({
        label: first + last,
        value: interview?.candidateId,
      });
      setSelectCandidateValidation(interview?.candidateId);
    }
    if (update === true || interview?.candidateId !== undefined) {
      setDisableField(true);
    } else setDisableField(false);
  }, [update, create, joiningDate, loginUser?.id]);

  const interviewOptions = [
    { value: "personal", id: "interviewType", label: "Personal" },
    { value: "virtual", id: "interviewType", label: "Virtual" },
    { value: "telephonic", id: "interviewType", label: "Telephonic" },
  ];

  const statusOptions = [
    { value: "available", id: "interviewStatus", label: "Available" },
    { value: "shortlisted", id: "interviewStatus", label: "Shortlisted" },
    { value: "trail", id: "interviewStatus", label: "Trail" },
    { value: "reschedule", id: "interviewStatus", label: "Reschedule" },
    { value: "scheduled", id: "interviewStatus", label: "Scheduled" },
    { value: "completed", id: "interviewStatus", label: "Completed" },
    { value: "hired", id: "interviewStatus", label: "Hired" },
    { value: "rejected", id: "interviewStatus", label: "Rejected" },
    { value: "hold", id: "interviewStatus", label: "Hold" },
    { value: "CV Shared", id: "interviewStatus", label: "CV Shared" },
    { value: "Not Joined It", id: "interviewStatus", label: "Not Joined It" },
    { value: "Left", id: "interviewStatus", label: "Left" },
  ];

  useEffect(() => {
    if (
      interview?.onBoarding?.companyName !== undefined ||
      interview?.client?.companyName !== undefined
    ) {
      let label = interview?.onBoarding?.companyName;
      if (interview?.client?.companyName)
        label = interview?.client?.companyName;
      setSelectCompany({ label });
      setSelectCompanyValidation({ label: interview?.onBoarding?.companyName });
    }
    if (interview?.candidate?.firstname !== undefined) {
      setSelectCandidate({ label: interview?.candidate?.firstname });
      setSelectCandidateValidation({ label: interview?.candidate?.firstname });
    }
    if (interview?.interviewStatus !== undefined) {
      const matchedStatus = statusOptions.find(
        (opt) => opt.value === interview?.interviewStatus
      );
      // Ensure the select has a full option object (value + label + id)
      setStatusOp(
        matchedStatus || {
          value: interview?.interviewStatus,
          label: interview?.interviewStatus,
          id: "interviewStatus",
        }
      );
    }
    if (interview?.interviewType !== undefined) {
      setInterviewOp({ label: interview?.interviewType });
    }
    if (interview?.time !== undefined) {
      setStartTime(new Date(interview?.time));
    }
  }, [interview]);

  useEffect(() => {
    const company = [];

    clients?.forEach((ele) => {
      ele.label = ` ${ele.companyName} (${ele?.jobCategory?.jobCategory})`;
      ele.key = "onBoardingId";
      company.push(ele);
    });

    if (getCompany?.length > 0) {
      getCompany?.filter((ele) => {
        ele.label = ` ${ele.companyName}`;
        ele.key = "onBoardingId";
        company.push(ele);
      });
    }
    setClientOptions(company);
  }, [candidates, clients, show, getCompany]);

  const candidateOptions =
    candidates?.map((ele) => ({
      ...ele,
      label: `${ele.firstname} ${ele.lastname}`.trim(),
      value: ele?.id,
      key: "candidateId",
    })) || [];

  const loadOptions = async (inputValue, callback) => {
    if (candidateIdURL == null) {
      try {
        let data = candidateOptions;
        if (inputValue.length >= 2) {
          data = await getCandidate(inputValue);
        }
        callback(data || []);
      } catch (error) {
        console.error("Error loading options:", error);
        callback([]);
      }
    }
  };

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  const debouncedHandleChange = useCallback(
    debounce((e) => {
      setSelectCandidate(e);
      setInterview((prev) => ({
        ...(Array.isArray(prev) ? {} : prev || {}),
        candidateId: e.value,
        userId: prev?.userId || loginUser?.id,
      }));
      setSelectCandidateValidation(e.value);
    }, 100),
    [loginUser?.id, setInterview, setSelectCandidateValidation]
  );
  const handleInputChange = (newValue) => {
    const val = newValue.replace(/\W/g, "");
    return val;
  };
  const [focus, setIsfocus] = useState(null);
  const themecolor = localStorage.getItem("themecolor");
  return (
    <div>
      <Row className="gy-1 pt-75">
        <div>
          <h4>Basic</h4>
        </div>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="candidateId">
              Select Candidate<span style={{ color: "red" }}>*</span>
            </Label>
            <AsyncSelect
              id="candidateId"
              isDisabled={disableField}
              value={selectCandidate}
              isClearable={false}
              className="react-select"
              classNamePrefix="select"
              name="callback-react-select"
              loadOptions={loadOptions}
              defaultOptions={candidateOptions}
              onInputChange={handleInputChange}
              theme={selectThemeColors}
              onChange={debouncedHandleChange}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="companyId">
              Select Company<span style={{ color: "red" }}>*</span>
            </Label>
            <Select
              isDisabled={update}
              id="companyId"
              value={selectCompany}
              placeholder="Select Company"
              options={clientOptions}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                setSelectCompany(e);
                handleChange(e);
                setSelectCompanyValidation(e.value);
              }}
            />
          </div>
        </Col>
        {interview?.interviewStatus !== "shortlisted" && (
          <Col lg={6} xs={12} xl={4}>
            <div>
              <Label id="date">
                Shedule Date<span style={{ color: "red" }}>*</span>
              </Label>
              <Flatpickr
                className="form-control"
                onFocus={() => setIsfocus("Shedule")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "Shedule" && themecolor,
                }}
                placeholder={
                  interview?.date !== "Invalid date"
                    ? interview?.date
                    : "Shedule Date"
                }
                value={date}
                options={{ dateFormat: "d-M-y", minDate: new Date() }}
                id="default-picker"
                onChange={(date) => {
                  setDate(date[0]);
                  const dateFormat = moment(date[0]).format("L");
                  setDateValidation(date[0]);
                  patchInterview({ date: dateFormat });
                }}
              />
            </div>
          </Col>
        )}
        {/* <Col lg={6} xs={12} xl={4}>
                    <div>
                        <Label id="time">Interview Time End<span style={{ color: "red" }}>*</span></Label>
                        <Flatpickr
                            className='form-control'
                            placeholder={'Select End Time'}

                            value={interview?.time?.to ? interview?.time?.to : endTime}
                            id='time'
                            options={{
                                enableTime: true,
                                noCalendar: true

                            }}
                            onChange={date => {
                                setInterviewEndValidation(date)
                                setEndTime(date)
                            }
                            }
                        />
                    </div>
                </Col> */}
        {update || candidateId !== null ? (
          <Col lg={6} xs={12} xl={4}>
            <Label id="interviewStatus">Interview Status</Label>
            <Select
              id="interviewStatus"
              value={statusOp}
              placeholder="Select Interview Status"
              options={statusOptions}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              onChange={(e) => {
                setStatusOp(e);
                const interviewStatusUpdate = new Date().toISOString();
                setInterview((prev) => {
                  const base = Array.isArray(prev) ? {} : prev || {};
                  return {
                    ...base,
                    interviewStatus: e.value,
                    candidate: {
                      ...base?.candidate,
                      interviewStatus: e.value,
                      interviewStatusUpdate,
                    },
                  };
                });
              }}
            />
          </Col>
        ) : null}
        {interview?.interviewStatus === "scheduled" ||
        interview?.interviewStatus === "reschedule" ||
        interview?.interviewStatus === undefined ? (
          <>
            <Col lg={6} xs={12} xl={4}>
              <Label for="role-select">
                Interview<span style={{ color: "red" }}>*</span>
              </Label>
              <Select
                id="interviewType"
                value={interviewOp}
                placeholder="Select Interview Type"
                options={interviewOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setInterviewOp(e);
                  handleChange(e);
                  setInterviewValidation(e.value);
                }}
              />
            </Col>
            <Col lg={6} xs={12} xl={4}>
              <div>
                <Label id="time">
                  Interview Time Start<span style={{ color: "red" }}>*</span>
                </Label>
                <Flatpickr
                  className="form-control"
                  onFocus={() => setIsfocus("interview")}
                  onBlur={() => setIsfocus(null)}
                  style={{
                    borderColor: focus === "interview" && themecolor,
                  }}
                  placeholder={"Select Start Time"}
                  value={new Date(startTime)}
                  id="time"
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "h:i:K",
                  }}
                  onChange={(val) => {
                    setStartTime(val[0]);
                    patchInterview({ time: val[0] });
                    setInterviewStartValidation(val[0]);
                  }}
                />
              </div>
            </Col>
          </>
        ) : null}{" "}
        {interview?.interviewType === "virtual" &&
        (interview?.interviewStatus === undefined ||
          interview?.interviewStatus === "scheduled" ||
          interview?.interviewStatus === "reschedule") ? (
          <Col lg={6} xs={12} xl={4}>
            <div>
              <Label id="link">link</Label>
              <Input
                id="link"
                onFocus={() => setIsfocus("link")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "link" && themecolor,
                }}
                name="link"
                maxLength={250}
                className="w-100"
                type="text"
                value={interview?.link}
                placeholder={"Enter Link"}
                onChange={(e) =>
                  patchInterview({ [e.target.id]: e.target.value })
                }
              />
            </div>
          </Col>
        ) : null}
        {interview?.interviewStatus === "hired" ||
        interview?.interviewStatus === "trail" ? (
          <>
            <Col lg={6} xs={12} xl={4}>
              <div>
                <Label id="date">
                  {" "}
                  Joining Date<span style={{ color: "red" }}>*</span>
                </Label>
                <Flatpickr
                  onFocus={() => setIsfocus("joiningDate")}
                  onBlur={() => setIsfocus(null)}
                  style={{
                    borderColor: focus === "joiningDate" && themecolor,
                  }}
                  className="form-control"
                  placeholder={
                    interview?.joiningDate !== "Invalid date"
                      ? interview?.joiningDate
                      : "Select Date"
                  }
                  value={joiningDate}
                  options={{ dateFormat: "d-M-y" }}
                  id="default-picker"
                  onChange={(date) => {
                    setJoiningDate(date[0]);
                    const dateFormat = moment(date[0]).format("L");
                    patchInterview({ joiningDate: dateFormat });
                    // setDateValidation(date)
                  }}
                />
              </div>
            </Col>
            <Col lg={6} xs={12} xl={4}>
              <Label id="startingSalary">Starting Salary</Label>
              <Input
                type="text"
                name="startingSalary"
                onFocus={() => setIsfocus("startingSalary")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "startingSalary" && themecolor,
                }}
                id="startingSalary"
                // rows='1'
                maxLength={15}
                value={interview?.startingSalary}
                placeholder="Enter Starting Salary"
                onChange={(e) => {
                  patchInterview({
                    [e.target.id]: e.target.value.replace(/\D/g, ""),
                  });
                }}
              />
            </Col>
          </>
        ) : null}
        <Col lg={6} xs={12} xl={4}>
          <Label id="Comments">Comments</Label>
          <Input
            type="textarea"
            name="comments"
            onFocus={() => setIsfocus("comments")}
            onBlur={() => setIsfocus(null)}
            style={{
              borderColor: focus === "comments" && themecolor,
            }}
            id="comments"
            // rows='1'
            maxLength={250}
            value={interview?.comments}
            placeholder="Enter Comments"
            onChange={(e) => {
              patchInterview({ [e.target.id]: e.target.value });
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default InterviewForm;
