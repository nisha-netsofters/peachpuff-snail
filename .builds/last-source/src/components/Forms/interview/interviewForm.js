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
import { getClientAPI, getAllClientsAPI } from "../../../apis/client";
import AsyncSelect from "react-select/async";

const toCompanyOption = (ele) => {
  if (!ele) return null;
  const id = ele.id || ele._id || ele.value;
  if (!id) return null;
  const companyName = ele.companyName || ele.label || "-";
  const jobCat = ele?.jobCategory?.jobCategory;
  return {
    id: String(id),
    value: String(id),
    key: "onBoardingId",
    companyName,
    label: jobCat ? `${companyName} (${jobCat})` : String(companyName),
  };
};

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

  const applyCompanySelection = (option) => {
    if (!option) {
      setSelectCompany(null);
      setSelectCompanyValidation(null);
      patchInterview({ onBoardingId: undefined });
      return;
    }
    const opt = toCompanyOption(option) || option;
    setSelectCompany(opt);
    setSelectCompanyValidation(opt.value || opt.id);
    patchInterview({
      onBoardingId: opt.value || opt.id,
      client: {
        id: opt.value || opt.id,
        companyName: opt.companyName || opt.label,
      },
    });
  };

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
      const nameFromCandidate = [
        interview?.candidate?.firstname,
        interview?.candidate?.lastname,
      ]
        .filter(Boolean)
        .join(" ")
        .trim();
      const nameFromUrl = [first, last].filter(Boolean).join(" ").trim();
      setSelectCandidate({
        label: nameFromCandidate || nameFromUrl || "Selected Candidate",
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
    if (interview?.candidate?.firstname !== undefined || interview?.candidate?.lastname) {
      const label = `${interview?.candidate?.firstname || ""} ${
        interview?.candidate?.lastname || ""
      }`.trim();
      setSelectCandidate({
        label: label || "Selected Candidate",
        value: interview?.candidateId,
      });
      setSelectCandidateValidation(interview?.candidateId || { label });
    }
    const statusValue =
      interview?.candidate?.interviewStatus ?? interview?.interviewStatus;
    if (statusValue !== undefined) {
      const matchedStatus = statusOptions.find(
        (opt) => opt.value === statusValue
      );
      setStatusOp(
        matchedStatus || {
          value: statusValue,
          label: statusValue,
          id: "interviewStatus",
        }
      );
    }
    if (interview?.interviewType !== undefined) {
      const matchedType = interviewOptions.find(
        (opt) => opt.value === interview.interviewType
      );
      setInterviewOp(
        matchedType || {
          value: interview.interviewType,
          label: interview.interviewType,
          id: "interviewType",
        }
      );
    }
    if (interview?.time !== undefined && interview?.time !== null) {
      setStartTime(new Date(interview.time));
      setInterviewStartValidation(new Date(interview.time));
    }
    if (interview?.date && interview.date !== "Invalid date") {
      const parsed = moment(
        interview.date,
        ["L", "l", "D-MMM-YY", "D-M-YY", "DD-MMM-YYYY", moment.ISO_8601],
        true
      );
      const dateObj = parsed.isValid() ? parsed.toDate() : new Date(interview.date);
      if (!Number.isNaN(dateObj?.getTime?.())) {
        setDate(dateObj);
        setDateValidation(dateObj);
      }
    }
    if (interview?.onBoardingId || interview?.client?.id) {
      setSelectCompanyValidation(
        interview?.onBoardingId || interview?.client?.id
      );
    }
  }, [interview]);

  // Load company list when dialog opens
  useEffect(() => {
    if (!show) return;
    let cancelled = false;

    const buildOptions = (list) => {
      const unique = [];
      const seen = new Set();
      (list || []).forEach((ele) => {
        const opt = toCompanyOption(ele);
        if (!opt || seen.has(opt.value)) return;
        seen.add(opt.value);
        unique.push(opt);
      });
      return unique;
    };

    const mergeLocal = () => {
      const fromProps = Array.isArray(clients) ? clients : [];
      const fromStore = Array.isArray(getCompany?.results)
        ? getCompany.results
        : Array.isArray(getCompany)
          ? getCompany
          : [];
      return buildOptions([...fromProps, ...fromStore]);
    };

    (async () => {
      if (!cancelled) setClientOptions(mergeLocal());
      try {
        let resp = await getClientAPI({
          page: 1,
          perPage: 100,
          filterData: {},
        });
        let rows = resp?.results || resp?.data?.results || [];
        if (!Array.isArray(rows) || !rows.length) {
          const allResp = await getAllClientsAPI();
          rows = Array.isArray(allResp)
            ? allResp
            : allResp?.results || allResp?.data || [];
        }
        const next = buildOptions([
          ...(Array.isArray(rows) ? rows : []),
          ...(Array.isArray(clients) ? clients : []),
        ]);
        if (!cancelled) setClientOptions(next);
      } catch (err) {
        console.error("InterviewForm company load error =>", err);
        if (!cancelled) setClientOptions(mergeLocal());
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [show, clients, getCompany]);

  // Sync selected company only when editing / company already saved on interview
  useEffect(() => {
    // Create flow: always show placeholder until user picks a company
    if (create && !update) {
      if (!interview?.onBoardingId && !interview?.client?.id) {
        setSelectCompany(null);
        setSelectCompanyValidation(null);
      }
      return;
    }

    const companyId = String(
      interview?.onBoardingId ||
        interview?.client?.id ||
        interview?.onBoarding?.id ||
        ""
    );
    if (!companyId) return;

    const matched = clientOptions.find(
      (o) => String(o.value) === companyId || String(o.id) === companyId
    );
    if (matched) {
      setSelectCompany(matched);
      setSelectCompanyValidation(matched.value);
      return;
    }

    const label =
      interview?.client?.companyName ||
      interview?.onBoarding?.companyName ||
      interview?.companyName ||
      "Selected Company";
    setSelectCompany({
      id: companyId,
      value: companyId,
      key: "onBoardingId",
      companyName: label,
      label,
    });
    setSelectCompanyValidation(companyId);
  }, [
    create,
    update,
    interview?.onBoardingId,
    interview?.client,
    interview?.onBoarding,
    interview?.companyName,
    clientOptions,
  ]);

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
              Candidate<span style={{ color: "red" }}>*</span>
            </Label>
            {disableField || interview?.candidateId ? (
              <Input
                id="candidateId"
                type="text"
                readOnly
                disabled
                value={
                  selectCandidate?.label ||
                  [
                    interview?.candidate?.firstname,
                    interview?.candidate?.lastname,
                  ]
                    .filter(Boolean)
                    .join(" ")
                    .trim() ||
                  ""
                }
              />
            ) : (
              <AsyncSelect
                id="candidateId"
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
            )}
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="companyId">
              Select Company<span style={{ color: "red" }}>*</span>
            </Label>
            <Select
              id="companyId"
              value={selectCompany}
              placeholder={
                clientOptions.length ? "Select Company" : "Loading companies..."
              }
              options={clientOptions}
              isDisabled={false}
              isClearable={false}
              className="react-select"
              classNamePrefix="select"
              theme={selectThemeColors}
              getOptionValue={(opt) => String(opt?.value || opt?.id || "")}
              getOptionLabel={(opt) => opt?.label || opt?.companyName || ""}
              onChange={(e) => applyCompanySelection(e)}
            />
          </div>
        </Col>
        {interview?.candidate?.interviewStatus !== "shortlisted" &&
        interview?.interviewStatus !== "shortlisted" && (
          <Col lg={6} xs={12} xl={4}>
            <div>
              <Label id="date">
                Shedule Date<span style={{ color: "red" }}>*</span>
              </Label>
              <Flatpickr
                className="form-control"
                onFocus={() => setIsfocus("Shedule")}
                style={{
                  borderColor: focus === "Shedule" && themecolor,
                }}
                placeholder="Schedule Date"
                value={date}
                options={{
                  dateFormat: "d-M-y",
                  minDate: new Date(),
                  disableMobile: true,
                  onClose: () => setIsfocus(null),
                }}
                id="default-picker"
                onChange={(selectedDates) => {
                  const picked = selectedDates?.[0];
                  if (!picked) return;
                  setDate(picked);
                  const dateFormat = moment(picked).format("L");
                  setDateValidation(picked);
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
                if (e.value === "shortlisted") {
                  setDate(undefined);
                  setDateValidation(new Date());
                  setInterviewStartValidation(new Date());
                  setInterviewValidation("shortlisted");
                }
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
                  style={{
                    borderColor: focus === "interview" && themecolor,
                  }}
                  placeholder="Select Start Time"
                  value={startTime}
                  id="time"
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "h:i K",
                    disableMobile: true,
                    onClose: () => setIsfocus(null),
                  }}
                  onChange={(val) => {
                    const picked = val?.[0];
                    if (!picked) return;
                    setStartTime(picked);
                    patchInterview({ time: picked });
                    setInterviewStartValidation(picked);
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
