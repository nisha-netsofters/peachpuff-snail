import React, { useEffect, useRef, useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import {
  Share,
  FileText,
  Download,
  UploadCloud,
  X,
  Mail,
  MoreVertical,
  Search,
} from "react-feather";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useDispatch, useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import { useCSVReader } from "react-papaparse";
import actions from "../../redux/candidate/actions";
import {
  checkCandidatePublicAPI,
  createCandidateAPI,
  updateCandidateAPI,
} from "../../apis/candidate";
import { tostifyError, tostifyInfo, tostifySuccess } from "../Tostify";
import { useLocation } from "react-router-dom";
import ComposeEmail from "../ComposeEmail/ComposeEmail";
// import { debounce } from "lodash";
import useBreakpoint from "../../utility/hooks/useBreakpoints";
import useDebounce from "../../utility/hooks/useDebounce";
import ComposeClientEmail from "../ComposeEmail/ComposeClientEmail";
import Select from "react-select";
import { selectThemeColors } from "@utils";
const CustomHeader = ({
  store,
  setCreate,
  setShow,
  setFilterData,
  loading,
  isCandidate = false,
  onAddNew = null,
  showRecruiterFilter = false,
  recruiterFilter = null,
  recruiterOptions = [],
  onRecruiterFilterChange = () => {},
}) => {
  const { CSVReader } = useCSVReader();
  const { width } = useBreakpoint();
  const dispatch = useDispatch();
  const { selectedCandidates } = useSelector((state) => state.candidate);
  const { selectedClient } = useSelector((state) => state.client);

  const location = useLocation().pathname;
  const [mobile, setMobile] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeClientOpen, setComposeClientOpen] = useState(false);
  const [duplicateCsvModal, setDuplicateCsvModal] = useState({
    open: false,
    rowLabel: "",
    candidateName: "",
    mobile: "",
    email: "",
  });
  const slug = localStorage.getItem("slug");
  const debouncedValue = useDebounce(mobile);
  const auth = useSelector((state) => state?.auth);
  const importTriggerRef = useRef(null);
  const duplicateCsvResolveRef = useRef(null);

  useEffect(() => {
    if (typeof setFilterData === "function") {
      if (debouncedValue) {
        setFilterData({ mobile: debouncedValue });
      } else {
        setFilterData({});
      }
    }
  }, [debouncedValue, setFilterData]);
  // useEffect(() => {
  //   if (filterData?.mobile) {
  //     setMobile(filterData?.mobile);
  //   } else {
  //     setMobile("");
  //   }
  // }, [filterData]);

  // const debounceOnChangeForMobileNumber = useCallback(
  //   debounce((q) => {
  //     if (q) {
  //       setFilterData({ mobile: q });
  //     } else {
  //       setFilterData({});
  //     }
  //   }, 300),
  //   []
  // );
  const professionalField = [
    "jobCategoryId",
    "industriesId",
    "course",
    "field",
    "designation",
    "experienceInyear",
    "expectedsalary",
    "skill",
    "noticePeriod",
    "highestQualification",
    "currentlyWorking",
    "currentSalary",
    "currentEmployer",
  ];

  const headers = [
    { label: "firstname", key: "firstname" },
    { label: "lastname", key: "lastname" },
    { label: "email", key: "email" },
    { label: "mobile", key: "mobile" },
    { label: "street", key: "street" },
    { label: "city", key: "city" },
    { label: "state", key: "state" },
    { label: "zip", key: "zip" },
    { label: "alternateMobile", key: "alternateMobile" },
    { label: "comments", key: "comments" },
    { label: "gender", key: "gender" },
    { label: "image", key: "image" },
    { label: "resume", key: "resume" },
    { label: "industriesId", key: "industriesId" },
    { label: "jobCategoryId", key: "jobCategoryId" },
    { label: "course", key: "course" },
    { label: "field", key: "field" },
    { label: "designation", key: "designation" },
    { label: "experienceInyear", key: "experienceInyear" },
    { label: "expectedsalary", key: "expectedsalary" },
    { label: "skill", key: "skill" },
    { label: "noticePeriod", key: "noticePeriod" },
    { label: "highestQualification", key: "highestQualification" },
    { label: "currentlyWorking", key: "currentlyWorking" },
    { label: "currentSalary", key: "currentSalary" },
    { label: "currentEmployer", key: "currentEmployer" },
  ];

  const data = [
    {
      firstname: "john",
      lastname: "denial",
      email: "john@gmail.com",
      mobile: "9876543210",
      street: "Ring Road",
      city: "Surat",
      state: "Gujarat",
      zip: "395002",
      alternateMobile: "9876500001",
      comments: "Interested in sales role",
      gender: "male",
      image: "",
      resume: "",
      industriesId: "industry-001",
      jobCategoryId: "jobcat-001",
      course: "B.Com",
      field: "Commerce",
      designation: "Sales Executive",
      experienceInyear: "1-3 year",
      expectedsalary: "25000",
      skill: "Sales, Communication, Excel",
      noticePeriod: "15 Days",
      highestQualification: "Graduate",
      currentlyWorking: "Yes",
      currentSalary: "22000",
      currentEmployer: "ABC Traders",
    },
    {
      firstname: "same",
      lastname: "Shah",
      email: "shah@example.com",
      mobile: "9876543211",
      street: "Vesu Main Road",
      city: "Surat",
      state: "Gujarat",
      zip: "395007",
      alternateMobile: "9876500002",
      comments: "Immediate joining available",
      gender: "female",
      image: "",
      resume: "",
      industriesId: "industry-002",
      jobCategoryId: "jobcat-002",
      course: "MBA",
      field: "Marketing",
      designation: "HR Executive",
      experienceInyear: "0-1 year",
      expectedsalary: "20000",
      skill: "Recruitment, MS Office, Communication",
      noticePeriod: "Immediate",
      highestQualification: "Post Graduate",
      currentlyWorking: "No",
      currentSalary: "0",
      currentEmployer: "",
    },
  ];
  function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(store[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  // function downloadCSV(array) {

  //   console.info('--------------------')
  //   console.info('array => ', array )
  //   console.info('--------------------')

  //   const link = document.createElement('a')
  //   let csv = convertArrayOfObjectsToCSV(array)
  //   console.info('--------------------')
  //   console.info('csv => ', csv )
  //   console.info('--------------------')
  //   if (csv === null) return

  //   const filename = 'export.csv'

  //   if (!csv.match(/^data:text\/csv/i)) {
  //     csv = `data:text/csvcharset=utf-8,${csv}`
  //   }

  //   link.setAttribute('href', encodeURI(csv))
  //   link.setAttribute('download', filename)

  //   link.click()
  // }

  function downloadCSV(array) {
    // const link = document.createElement('a');
    const csv = convertArrayOfObjectsToCSV(array);
    if (csv === null) return;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const filename = "export.csv";

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  const toggleCompose = () => {
    setComposeOpen(!composeOpen);
  };

  const toggleComposeEmail = () => {
    setComposeClientOpen(!composeClientOpen);
  };
  const askDuplicateCsvAction = (rowLabel, existingCandidate) => {
    const name =
      `${existingCandidate?.firstname || ""} ${
        existingCandidate?.lastname || ""
      }`.trim() || "Existing candidate";
    return new Promise((resolve) => {
      duplicateCsvResolveRef.current = resolve;
      setDuplicateCsvModal({
        open: true,
        rowLabel,
        candidateName: name,
        mobile: existingCandidate?.mobile || "",
        email: existingCandidate?.email || "",
      });
    });
  };
  const closeDuplicateCsvModal = (action) => {
    setDuplicateCsvModal({
      open: false,
      rowLabel: "",
      candidateName: "",
      mobile: "",
      email: "",
    });
    if (duplicateCsvResolveRef.current) {
      duplicateCsvResolveRef.current(action);
      duplicateCsvResolveRef.current = null;
    }
  };
  const handleCandidateCsvImport = async (results) => {
    const csvHeaders = results?.data?.[0];
    const data = [];

    results?.data?.forEach((ele, index) => {
      if (index > 0) {
        const obj = {};
        const professional = {};
        ele.forEach((element, i) => {
          if (
            professionalField.includes(csvHeaders[i]) &&
            String(element || "").length > 0
          ) {
            professional[csvHeaders[i]] = element;
          } else if (String(element || "").length > 0) {
            obj[csvHeaders[i]] = element;
          }
        });

        if (JSON.stringify(obj) !== "{}") {
          obj.professional = professional;
          data.push(obj);
        }
      }
    });

    if (!data.length) {
      tostifyError("No valid rows found in CSV");
      return;
    }

    let addedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    const skipReasons = [];

    for (let index = 0; index < data.length; index += 1) {
      const row = data[index];
      const fileRow = `Row ${index + 2}`;
      const email = String(row?.email || "").trim();
      const mobile = String(row?.mobile || "").trim();

      if (!email || !mobile) {
        skippedCount += 1;
        if (!email && !mobile) {
          skipReasons.push(`${fileRow}: email and phone missing`);
        } else if (!email) {
          skipReasons.push(`${fileRow}: email missing`);
        } else {
          skipReasons.push(`${fileRow}: phone missing`);
        }
        continue;
      }

      const professional = {
        ...(row?.professional || {}),
        jobCategoryId:
          row?.professional?.jobCategoryId || row?.jobCategoryId || "",
        expectedsalary: Number(
          row?.professional?.expectedsalary || row?.expectedsalary || 0
        ),
        currentSalary: Number(
          row?.professional?.currentSalary || row?.currentSalary || 0
        ),
      };
      const industries_relation = String(row?.industriesId || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((industriesId) => ({ industriesId }));

      const payload = {
        ...row,
        email,
        mobile,
        professional,
        industries_relation,
      };

      delete payload.industriesId;
      delete payload.jobCategoryId;

      const duplicateCheck = await checkCandidatePublicAPI({
        email,
        mobile,
      });

      const existingCandidate = duplicateCheck?.existingCandidate || {};
      const isDuplicate = Boolean(duplicateCheck?.duplicate || duplicateCheck?.error);

      if (isDuplicate) {
        const action = await askDuplicateCsvAction(fileRow, existingCandidate);
        if (action !== "update") {
          skippedCount += 1;
          skipReasons.push(`${fileRow}: duplicate skipped`);
          continue;
        }

        const existingId = String(
          existingCandidate?.id || existingCandidate?._id || ""
        ).trim();
        if (!existingId) {
          skippedCount += 1;
          skipReasons.push(`${fileRow}: existing candidate id missing`);
          continue;
        }

        const updateResp = await updateCandidateAPI({
          data: { ...payload, id: existingId },
        });

        if (updateResp?.msg) {
          updatedCount += 1;
        } else {
          skippedCount += 1;
          skipReasons.push(
            `${fileRow}: ${updateResp?.error || "update failed"}`
          );
        }
        continue;
      }

      const createResp = await createCandidateAPI(payload);
      if (createResp?.id) {
        addedCount += 1;
      } else {
        skippedCount += 1;
        skipReasons.push(`${fileRow}: ${createResp?.error || "create failed"}`);
      }
    }

    if (addedCount > 0) {
      tostifySuccess(
        `${addedCount} candidate${addedCount > 1 ? "s" : ""} imported successfully`
      );
    }
    if (updatedCount > 0) {
      tostifySuccess(
        `${updatedCount} duplicate candidate${updatedCount > 1 ? "s" : ""} updated`
      );
    }
    if (skippedCount > 0) {
      tostifyInfo(
        skipReasons.length
          ? skipReasons.slice(0, 2).join(" | ")
          : `${skippedCount} row${skippedCount > 1 ? "s" : ""} skipped`
      );
    }

    if (addedCount > 0 || updatedCount > 0) {
      await dispatch({
        type: actions.GET_CANDIDATE,
        payload: {
          page: 1,
          perPage: 10,
          filterData: [],
        },
      });
    }
  };
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const [hoverIndex, setHoverIndex] = useState(0);
  const profileStyle = {
    backgroundColor: hoverIndex == 1 && `${themecolor}30`,
    color: hoverIndex == 1 && themecolor,
  };
  const SampleStyle = {
    backgroundColor: hoverIndex == 2 && `${themecolor}30`,
    color: hoverIndex == 2 && themecolor,
  };
  const ImportStyle = {
    backgroundColor: hoverIndex == 3 && `${themecolor}30`,
    color: hoverIndex == 3 && themecolor,
  };
  const CSVStyle = {
    backgroundColor: hoverIndex == 4 && `${themecolor}30`,
    color: hoverIndex == 4 && themecolor,
  };

  const MailStyle = {
    backgroundColor: hoverIndex == 5 && `${themecolor}30`,
    color: hoverIndex == 4 && themecolor,
  };

  const [focus, setIsfocus] = useState(null);
  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-50 mb-75">
      <Row>
        <Col xl="6" className="d-flex align-items-center p-0">
          <Col>
            {location === `/${slug}/candidate` ? (
              <div style={{ position: "relative" }}>
                <Input
                  id="filterMobile"
                  type="text"
                  maxLength={10}
                  placeholder="Enter Mobile"
                  value={mobile}
                  onFocus={() => setIsfocus("filterMobile")}
                  onBlur={() => setIsfocus(null)}
                  style={
                    width <= 768
                      ? {
                          width: "180%",
                          borderRadius: "10px",
                          borderColor: focus === "filterMobile" && themecolor,
                        }
                      : {
                          width: "50%",
                          borderColor: focus === "filterMobile" && themecolor,
                        }
                  }
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      setFilterData({
                        mobile: e.target.value.replace(/\D/g, ""),
                      });
                    }
                  }}
                  onChange={(e) => {setMobile(e.target.value.replace(/\D/g, ""));}}
                />
                <Search
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: "7px",
                    right: "52%",
                  }}
                  onClick={() => setFilterData({ mobile: mobile })}
                />
              </div>
            ) : null}
          </Col>

          <Col
            style={
              width < 769
                ? { display: "flex", justifyContent: "end" }
                : { display: "none" }
            }
          >
            {auth?.user?.agency?.isDownloadAble === true && (
              <>
                <UncontrolledDropdown className="chart-dropdown">
                  <DropdownToggle
                    color=""
                    className="bg-transparent btn-sm border-0 p-50"
                  >
                    <MoreVertical size={18} className="cursor-pointer" />
                  </DropdownToggle>
                  <DropdownMenu end>
                    {location === `/${slug}/candidate` ? (
                      <DropdownItem
                        className="w-100"
                        style={SampleStyle}
                        onMouseEnter={() => setHoverIndex(2)}
                        onMouseLeave={() => setHoverIndex(0)}
                      >
                        {" "}
                        {location === `/${slug}/candidate` ? (
                          <CSVLink
                            data={data}
                            headers={headers}
                            style={{
                              color: "#82868b",
                              borderColor: `${themecolor}30`,
                            }}
                          >
                            <Download className="font-small-4 me-50" />
                            <span className="align-middle">
                              Download Sample
                            </span>
                          </CSVLink>
                        ) : null}
                      </DropdownItem>
                    ) : null}{" "}
                    {location === `/${slug}/candidate` ? (
                      <DropdownItem
                        className="w-100"
                        style={ImportStyle}
                        onMouseEnter={() => setHoverIndex(3)}
                        onMouseLeave={() => setHoverIndex(0)}
                      onClick={() => importTriggerRef.current?.click()}
                      >
                      <UploadCloud className="font-small-4 me-50" /> Import
                      </DropdownItem>
                    ) : null}
                    <DropdownItem
                      className="w-100"
                      onClick={() => downloadCSV(store)}
                      style={CSVStyle}
                      onMouseEnter={() => setHoverIndex(4)}
                      onMouseLeave={() => setHoverIndex(0)}
                    >
                      <FileText className="font-small-4 me-50" />
                      <span className="align-middle">Download CSV</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </>
            )}
          </Col>
        </Col>

        <Col
          xl="6"
          className=" align-items-sm-center justify-content-end  flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1"
          style={width < 789 ? { display: "none" } : { display: "flex" }}
        >
          <div className="d-flex align-items-center table-header-actions">
            {auth?.user?.agency?.isDownloadAble === true && (
              <>
                {" "}
                {location === `/${slug}/candidate` ? null : (
                  <>
                    {" "}
                    <UncontrolledDropdown className="me-1">
                      <DropdownToggle color="secondary" caret outline>
                        <Share className="font-small-4 me-50" />
                        <span className="align-middle">Export</span>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          style={profileStyle}
                          onMouseEnter={() => setHoverIndex(1)}
                          onMouseLeave={() => setHoverIndex(0)}
                          className="w-100"
                          onClick={() => downloadCSV(store)}
                        >
                          <FileText className="font-small-4 me-50" />
                          <span className="align-middle">CSV</span>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </>
                )}
                {/* {location === `/${slug}/candidate` ? (
                  <UncontrolledDropdown className="me-1">
                    <CSVReader
                      onUploadAccepted={async (results) => {
                        const headers = results?.data[0];
                        const data = [];
                        results?.data.forEach((ele, index) => {
                          if (index > 0) {
                            const obj = {};
                            const professional = {};
                            ele.forEach((element, i) => {
                              if (
                                professionalField.includes(headers[i]) &&
                                element.length > 0
                              ) {
                                professional[headers[i]] = element;
                              } else if (element?.length > 0) {
                                obj[headers[i]] = element;
                              }
                            });

                            if (JSON.stringify(obj) !== "{}") {
                              obj.professional = professional;
                              data.push(obj);
                            }
                          }
                        });
                        await dispatch({
                          type: actions.CREATE_CANDIDATE_CSV,
                          payload: { data },
                        });
                      }}
                    >
                      {({ getRootProps, acceptedFile, getRemoveFileProps }) => {
                        useEffect(() => {
                          if (acceptedFile?.name?.length > 0) {
                            tostifySuccess(
                              `${acceptedFile?.name?.slice(0, 7)}... Uploaded`
                            );
                          }
                        }, [acceptedFile]);
                        return (
                          <>
                            <Button
                              color="secondary"
                              style={{ cursor: "pointer" }}
                              onClick={() => {}}
                              caret
                              outline
                              {...getRootProps()}
                            >
                              <UploadCloud className="font-small-4 me-50" />
                              <div
                                {...getRemoveFileProps()}
                                style={{
                                  position: "absolute",
                                  left: "47px",
                                  top: "1px",
                                }}
                              >
                                {acceptedFile ? (
                                  <>
                                    <X
                                      color="red"
                                      onClick={() => {
                                        tostifySuccess(
                                          `${acceptedFile?.name?.slice(
                                            0,
                                            7
                                          )}... Removed`
                                        );
                                      }}
                                      size={15}
                                    />
                                  </>
                                ) : null}
                              </div>
                            </Button>
                          </>
                        );
                      }}
                    </CSVReader>
                  </UncontrolledDropdown>
                ) : null} */}
                {/* {selectedCandidates?.mails?.length > 0 && (
                  <Col>
                    <Button
                      onClick={() => setComposeOpen(true)}
                      style={{ cursor: "pointer", marginRight: "10px" }}
                      caret
                      outline
                    >
                      <Mail className="font-small-4 me-50" />
                    </Button>
                  </Col>
                )} */}
                {selectedClient?.mails?.length > 0 && (
                  <Col>
                    <Button
                      onClick={() => setComposeClientOpen(true)}
                      style={{ cursor: "pointer", marginRight: "10px" }}
                      caret
                      outline
                    >
                      <Mail className="font-small-4 me-50" />
                    </Button>
                  </Col>
                )}
              </>
            )}

            {showRecruiterFilter && location === `/${slug}/jobopening` ? (
              <div className="me-1" style={{ minWidth: "180px" }}>
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  isClearable
                  placeholder="Filter by Recruiter"
                  value={recruiterFilter}
                  options={recruiterOptions}
                  onChange={(option) => onRecruiterFilterChange(option)}
                />
              </div>
            ) : null}

            <Button
              style={{
                width: "145px",
                backgroundColor: themecolor ? themecolor : "#323D76",
                color: "white",
              }}
              className="add-new-user"
              color="default"
              disabled={isCandidate && loading == true ? true : false}
              onClick={() => {
                if (typeof onAddNew === "function") {
                  onAddNew();
                } else {
                  setCreate(true);
                  setShow(true);
                }
              }}
            >
              {location === `/${slug}/jobopening` ? (
                <>Post New Job</>
              ) : (
                <>Add New</>
              )}
            </Button>
            {location === `/${slug}/candidate` ? (
              // <UncontrolledDropdown className="me-1">
              //   <Button
              //     color="secondary"
              //     style={{ cursor: "pointer" }}
              //     caret
              //     outline
              //   >
              //     <CSVLink
              //       data={data}
              //       headers={headers}
              //       style={{ color: "#82868b" }}
              //     >
              //       <Download className="font-small-4 me-50" />
              //       <span className="align-middle">Download Sample</span>
              //     </CSVLink>
              //   </Button>
              // </UncontrolledDropdown>
              <UncontrolledDropdown className="chart-dropdown">
                <DropdownToggle
                  color=""
                  className="bg-transparent btn-sm border-0 p-50"
                >
                  <MoreVertical size={18} className="cursor-pointer" />
                </DropdownToggle>
                <DropdownMenu end>
                  {location === `/${slug}/candidate` ? (
                    <DropdownItem
                      className="w-100"
                      style={SampleStyle}
                      onMouseEnter={() => setHoverIndex(2)}
                      onMouseLeave={() => setHoverIndex(0)}
                    >
                      {" "}
                      {location === `/${slug}/candidate` ? (
                        <CSVLink
                          data={data}
                          headers={headers}
                          style={{
                            color: "#82868b",
                            borderColor: `${themecolor}30`,
                          }}
                        >
                          <Download className="font-small-4 me-50" />
                          <span className="align-middle">Download Sample</span>
                        </CSVLink>
                      ) : null}
                    </DropdownItem>
                  ) : null}{" "}
                  {location === `/${slug}/candidate` ? (
                    <DropdownItem
                      className="w-100"
                      style={ImportStyle}
                      onMouseEnter={() => setHoverIndex(3)}
                      onMouseLeave={() => setHoverIndex(0)}
                      onClick={() => importTriggerRef.current?.click()}
                    >
                      <UploadCloud className="font-small-4 me-50" /> Import
                    </DropdownItem>
                  ) : null}
                  <DropdownItem
                    className="w-100"
                    onClick={() => downloadCSV(store)}
                    style={CSVStyle}
                    onMouseEnter={() => setHoverIndex(4)}
                    onMouseLeave={() => setHoverIndex(0)}
                  >
                    <FileText className="font-small-4 me-50" />
                    <span className="align-middle">Download CSV</span>
                  </DropdownItem>
                  {selectedCandidates?.mails?.length > 0 && (
                    <DropdownItem
                      className="w-100"
                      onClick={() => setComposeOpen(true)}
                      style={MailStyle}
                      onMouseEnter={() => setHoverIndex(5)}
                      onMouseLeave={() => setHoverIndex(0)}
                    >
                      <Mail className="font-small-4 me-50" />
                      <span className="align-middle">Mail</span>
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </UncontrolledDropdown>
            ) : null}
          </div>
        </Col>
      </Row>
      {composeOpen && (
        <ComposeEmail toggleCompose={toggleCompose} composeOpen={composeOpen} />
      )}
      {composeClientOpen && (
        <ComposeClientEmail
          toggleCompose={toggleComposeEmail}
          composeOpen={composeClientOpen}
        />
      )}
      <Modal
        className="modal-dialog-centered"
        isOpen={duplicateCsvModal.open}
        toggle={() => closeDuplicateCsvModal("skip")}
      >
        <ModalHeader toggle={() => closeDuplicateCsvModal("skip")}>
          Duplicate Candidate Found
        </ModalHeader>
        <ModalBody>
          <p style={{ marginBottom: "0.75rem" }}>
            <strong>{duplicateCsvModal.rowLabel}</strong> matches an existing
            candidate.
          </p>
          <p style={{ marginBottom: "0.5rem" }}>
            Candidate: <strong>{duplicateCsvModal.candidateName}</strong>
          </p>
          {duplicateCsvModal.email ? (
            <p style={{ marginBottom: "0.5rem" }}>
              Email: <strong>{duplicateCsvModal.email}</strong>
            </p>
          ) : null}
          {duplicateCsvModal.mobile ? (
            <p style={{ marginBottom: "0.5rem" }}>
              Mobile: <strong>{duplicateCsvModal.mobile}</strong>
            </p>
          ) : null}
          <p style={{ marginBottom: 0 }}>
            Do you want to update this candidate, or skip this CSV row?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            style={{ backgroundColor: themecolor, color: "white" }}
            onClick={() => closeDuplicateCsvModal("update")}
          >
            Update
          </Button>
          <Button color="link" onClick={() => closeDuplicateCsvModal("skip")}>
            Skip
          </Button>
        </ModalFooter>
      </Modal>
      {location === `/${slug}/candidate` ? (
        <div style={{ display: "none" }}>
          <CSVReader onUploadAccepted={handleCandidateCsvImport}>
            {({ getRootProps }) => (
              <button type="button" ref={importTriggerRef} {...getRootProps()} />
            )}
          </CSVReader>
        </div>
      ) : null}
    </div>
  );
};

export default CustomHeader;
