/*eslint-disable*/
import DataTable from "react-data-table-component";
import {
  Edit,
  Delete,
  FileText,
  Image,
  Check,
  X,
  Filter as FilterIcon,
  Trash,
  UserPlus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "react-feather";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Client from "../../components/Dialog/Client";
import ClientActions from "../../redux/client/actions";
import CustomHeader from "../../components/Header/CustomHeader";
import Filter from "../../components/Forms/Clients/filter";
// import { IMAGE_URL } from '../../configs/config'
import { tostify } from "../../components/Tostify";
import { toast } from "react-toastify";
import ComponentSpinner from "../../@core/components/spinner/Loading-spinner";
import jobCategoryActions from "../../redux/jobCategory/actions";
import Loader from "./../../components/Dialog/Loader";
import actions from "../../redux/industries/actions";
import useBreakpoint from "../../utility/hooks/useBreakpoints";
import _ from "lodash";

const Clients = () => {
  const auth = useSelector((state) => state.auth);
  const { width } = useBreakpoint();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const clients = useSelector((state) => state.client);
  const [client, setClient] = useState([]);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [filterToggleMode, setFilterToggleMode] = useState(false);
  const [email, setEmail] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [industriesData, setIndustriesData] = useState([]);
  const [promiseLoading, setPromiseLoading] = useState(false);
  const [jobCategoryData, setJobCategoryData] = useState([]);
  const [isOpen, setIsOpen] = useState(
    clients?.results?.map(() => false) ?? []
  );
  const toggle = (index) => {
    const newCollapseStates = [...isOpen];
    newCollapseStates[index] = !newCollapseStates[index];
    setIsOpen(newCollapseStates);
  };
  const getClients = async (page) => {
    setLoading(true);
    await dispatch({
      type: ClientActions.GET_CLIENT,
      payload: {
        filterData,
        page,
        perPage,
      },
    });
  };

  useEffect(() => {
    setLoading(false);
    if (clients?.constraint) {
      tostify("User Email Id is exist");
      getClients(1);
    }
  }, [clients]);

  useEffect(() => {
    if (create === true) {
      setUpdate(false);
      // getClients(1)
    }
  }, [create]);

  useEffect(() => {
    if (!show) {
      setClient([]);
      setIndustriesData([]);
      setJobCategoryData([]);
    }
  }, [show]);

  useEffect(() => {
    dispatch({
      type: actions.GET_ALL_INDUSTRIES,
    });
    dispatch({
      type: jobCategoryActions.GET_ALL_JOBCAT,
    });
  }, []);

  function filterKey(data) {
    const notIncludedKeys = [];
    if (auth?.user?.clients) {
      notIncludedKeys.push("jobCategoryId");
    }
    return Object.keys(data).filter((key) => !notIncludedKeys.includes(key));
  }

  const clearStates = () => {
    if (clients?.constraint === "clients_email_unique") {
      tostify("Email Already Exist");
    } else if (clients?.constraint === "clients_mobile_unique") {
      tostify("Mobile Number Already Exist");
    } else if (clients.isSuccess === true) {
      setClient([]);
      setShow(false);
      setClient([]);
      setUpdate(false);
      setIndustriesData([]);
      setLoading(false);
      setCreate(false);
      setJobCategoryData([]);
      setShow(false);
    }
  };

  useEffect(() => {
    getClients(1);
  }, []);

  useEffect(() => {
    if (filterKey(filterData).length) {
      getClients(1);
    }
    console.info("---------------");
    console.info("filterData00000000000", filterData);
    console.info("---------------");
  }, [filterData]);
  // useEffect(() => {
  //   if (create === false && update === false) {
  //     getClients(currentPage);
  //   }
  // }, [create, update]);
  useEffect(() => {
    setTotalRows(clients.total);
  }, [clients]);

  useEffect(() => {
    if (update === true || create === true) {
      clearStates();
    }
  }, [clients]);

  const deleteClient = (row) => {
    setLoading(true);
    dispatch({
      type: ClientActions.DELETE_CLIENT,
      payload: { id: row.id },
      setLoading,
    });
  };

  console.info("--------------------");
  console.info("client9999999999999 => ", client);
  console.info("--------------------");

  const columns = [
    {
      name: "Action",
      minWidth: "110px",
      cell: (row) => (
        <div div className="column-action d-flex align-items-center">
          {row.fullname}
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              setClient(row);
              setEmail(row.email);
              setTimeout(() => {
                setIndustriesData(row?.industries_relation);
                setJobCategoryData(row?.jobCategory_relation);
              }, 200);
              setUpdate(true);
              setShow(true);
            }}
          >
            <Edit size={17} className="mx-1" />
          </span>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => handleDeleteClick(row)}
          >
            <Trash size={17} className="mx-1" />
          </span>
        </div>
      ),
    },
    {
      name: "Approve ",
      minWidth: "110px",
      cell: (row) => (
        <div div className="column-action d-flex align-items-center">
          {row.fullname}
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (row.action !== "approved") {
                setLoading(true);
                dispatch({
                  type: ClientActions.APPROVE_CLIENT,
                  payload: row,
                  setLoading,
                });
              } else {
                toast.warn("Client already approved");
              }
            }}
          >
            <Check size={17} className="mx-1" />
          </span>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (row.action !== "declined") {
                setLoading(true);
                dispatch({
                  type: ClientActions.DECLINED_CLIENT,
                  payload: row,
                  setLoading,
                });
              } else {
                toast.warn("Client already Declined");
              }
            }}
          >
            <X size={17} className="mx-1" />
          </span>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => row?.action,
      cell: (row) => {
        let color = "light-success";
        if (row.action === "declined") color = "light-danger";
        else if (row.action === "approved") color = "light-success";
        else if (row.action === "pending") color = "light-info";
        return (
          <Badge
            Badge
            pill
            color={color}
            className="column-action d-flex align-items-center"
            style={{ textTransform: "capitalize" }}
          >
            {row.action}
          </Badge>
        );
      },
    },
    {
      name: "Create_AT",
      selector: (row) => row?.createdAt?.slice(0, 10),
    },
    {
      name: "companyName",
      selector: (row) => row?.companyName,
    },
    {
      name: "company owner",
      selector: (row) => row?.companyowner,
    },
    {
      name: "mobile",
      selector: (row) => row?.mobile,
    },
    {
      name: "email",
      selector: (row) => row?.email,
    },
    {
      name: "website",
      selector: (row) => row?.website,
    },

    {
      name: "street",
      selector: (row) => row?.street,
    },
    {
      name: "city",
      selector: (row) => row?.city,
    },
    {
      name: "state",
      selector: (row) => row?.state,
    },
    // {
    //   name: 'country',
    //   selector: (row) => row?.country
    // },
    {
      name: "Pin",
      selector: (row) => row?.zip,
    },
    // {
    //   name: 'comments',
    //   selector: (row) => row?.comments
    // },
    // {
    //   name: 'File',
    //   cell: (row) => {
    //     return row.file ? (
    //       <>
    //         <div style={{ color: "#7F8487", cursor: "pointer" }} onClick={() => window.open(row.file)} ><FileText /></div>
    //       </>
    //     ) : (
    //       'null'
    //     )
    //   }
    // }
  ];

  const ClientCreateHandler = () => {
    setLoading(true);
    // const fm = client;
    // fm.industries_relation = JSON.stringify(client?.industries_relation);
    // fm.jobCategory_relation = JSON.stringify(client?.jobCategory_relation);
    dispatch({
      type: ClientActions.CREATE_CLIENT,
      payload: {
        data: client,
        setLoading,
        page: currentPage,
        perPage: perPage,
        filterData: filterData,
      },
    });
  };

  const ClientUpdateHandler = () => {
    // setLoading(true);
    // const fm = client;
    // fm.jobCategory_relation = JSON.stringify(client?.jobCategory_relation);
    // fm.industries_relation = JSON.stringify(client?.industries_relation);
    const data = clients?.results?.filter((item) => item?.id == client?.id);
    const ObjData = Object.assign({}, ...data);
    const isMatch = _.isMatch(ObjData, client);
    if (isMatch == false) {
      dispatch({
        type: ClientActions.UPDATE_CLIENT,
        payload: {
          id: client.id,
          data: client,
          setLoading,
          page: currentPage,
          perPage: perPage,
          filterData: filterData,
        },
      });
    }
  };

  const Validations = async () => {
    const error = false;

    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (client?.companyName === undefined || client?.companyName?.length < 2)
      return tostify("Please Enter Valid Company Name", error);
    else if (
      client?.companyowner === undefined ||
      client?.companyowner?.length < 2
    )
      return tostify(" Please Enter Valid Company Owner Name", error);
    else if (
      client?.industries_relation?.length === 0 ||
      client?.industries_relation === undefined
    )
      return tostify(" Please Select Industries", error);
    else if (
      client?.jobCategory_relation?.length === 0 ||
      client?.jobCategory_relation === undefined
    )
      return tostify(" Please Select Job Category", error);
    else if (!email || regex.test(email) === false)
      return tostify("Please Enter Valid Email", error);
    else if (client?.mobile?.length !== 10 || client?.mobile === undefined)
      return tostify("Please Enter Valid Contact Number", error);
    else if (
      client?.state == undefined ||
      client?.state?.length === 0 ||
      client?.state == "" ||
      client?.stateId == undefined ||
      client?.stateId?.length === 0 ||
      client?.stateId == ""
    )
      return tostify("Please Enter Valid State", error);
    else if (
      client?.city == undefined ||
      client?.city?.length === 0 ||
      client?.city == "" ||
      client?.cityId == undefined ||
      client?.cityId?.length === 0 ||
      client?.cityId == ""
    )
      return tostify("Please Enter Valid City", error);

    return error;
  };
  const ClientActionHandler = async () => {
    const err = await Validations();
    if (update === true && err === false) {
      ClientUpdateHandler();
    }
    if (create === true && err === false) {
      ClientCreateHandler();
    }
  };

  const handlePageChange = (page) => {
    setLoading(true);
    setCurrentPage(page);
    getClients(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    dispatch({
      type: ClientActions.GET_CLIENT,
      payload: {
        filterData,
        page,
        perPage: newPerPage,
      },
    });
    setPerPage(newPerPage);
    setLoading(false);
  };

  //filter
  const handleFilter = (filter) => {
    setFilterData(filter);
    if (width < 769) {
      filterToggle();
    }
  };
  const handleFilterToggleMode = (filter) => {
    setFilterToggleMode(filter);
  };
  const [clear, setclear] = useState(false);
  const handleClear = () => {
    setclear(true);
  };
  const setclearstate = (clear) => {
    setclear(clear);
  };

  const filterToggle = () => {
    setFilterToggleMode(!filterToggleMode);
  };
  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Escape") {
        setFilterToggleMode(false);
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  const renderStates = (clients) => {
    const statesArr = [
      {
        title: "Company name",
        value: clients?.companyName || "-",
      },
      {
        title: "Company Owner",
        value: clients?.companyOwner || "-",
      },
      {
        title: "Contact Number",
        value: clients?.mobile || "-",
      },
      {
        title: "Email",
        value: clients?.email || "-",
      },
      {
        title: "website",
        value: clients?.website || "-",
      },
    ];

    return statesArr.map((state) => (
      <>
        <div
          key={state.title}
          className="browser-states"
          style={{ marginTop: "5px" }}
        >
          <div className="state-col">
            <strong
              style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}
            >
              {state.title}:{" "}
            </strong>
            <strong style={{ fontSize: "12px" }}>{state.value}</strong>
          </div>
        </div>
      </>
    ));
  };

  const renderStatesMore = (clients) => {
    const statesArr = [
      {
        title: "street",
        value: clients?.street || "-",
      },
      {
        title: "city",
        value: clients?.city || "-",
      },
      {
        title: "state",
        value: clients?.state || "-",
      },
      {
        title: "zip",
        value: clients?.zip || "-",
      },
    ];

    return statesArr.map((state) => (
      <>
        <div
          key={state.title}
          className="browser-states"
          style={{ marginTop: "5px" }}
        >
          <div className="state-col">
            <strong
              style={{ fontSize: "13px", color: "black", fontWeight: "bold" }}
            >
              {state.title}:{" "}
            </strong>
            <strong style={{ fontSize: "12px" }}>{state.value}</strong>
          </div>
        </div>
      </>
    ));
  };
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientToDelete, setClientToDelete] = useState(null);

  const handleDeleteClick = (result) => {
    setClientToDelete(result);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    deleteClient(clientToDelete);
    setShowDeleteModal(false);
  };

  const totalPages = Math.ceil(clients?.total / perPage);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  const visiblePageNumbers = pageNumbers.slice(startPage - 1, endPage);
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const customStyles = {
    headCells: {
      style: {
        justifyContent: "center",
        width: "150px",
        backgroundColor: `${themecolor}10`,
      },
    },
    cells: {
      style: {
        justifyContent: "center",
        fontWeight: "bold",
      },
    },
  };
  const [hoverIndex, setHoverIndex] = useState(0);
  const CSVStyle = {
    backgroundColor: hoverIndex == 1 && `${themecolor}30`,
    color: hoverIndex == 1 && themecolor,
  };
  const editStyle = {
    backgroundColor: hoverIndex == 2 && `${themecolor}30`,
    color: hoverIndex == 2 && themecolor,
  };
  const deleteStyle = {
    backgroundColor: hoverIndex == 3 && `${themecolor}30`,
    color: hoverIndex == 3 && themecolor,
  };

  function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(clients?.results[0]);

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

  function downloadCSV(array) {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv === null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csvcharset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);

    // doc.autoPrint(csv)
    link.click();
  }

  const handleselected = (rows) => {
 console.log('---------------------');
 console.log('rows =>', rows);
 console.log('---------------------');
    let mails = [];
    new Promise(() => {
      setTimeout(() => {
        mails = rows.selectedRows?.map((ele) => {
          const obj = {};
          obj.label = `${ele?.companyName} ${ele?.companyowner}`;
          obj.email = ele.email;
          return obj;
        }, 3000);
      });
    });
    new Promise(() => {
      setTimeout(() => {
        dispatch({
          type: ClientActions.SET_SELECTED_FOR_EMAIL_CLIENT,
          payload: { mails, totalRows: rows.selectedCount },
        });
        setPromiseLoading(false);
      }, 3000);
    });
  };
  return (
    <>
      <div style={{ display: "flex", alignItems: "end" }}>
        <h3 style={{ color: themecolor }}>
          <b>Clients</b>
        </h3>
        {Object.keys(filterData).length > 0 ? (
          <div
            style={{ marginLeft: "auto", display: "flex", alignItems: "end" }}
          >
            {width > 786 ? (
              <h3 style={{ fontSize: "16px", marginBottom: "9px" }}>
                No Of Filter Applied : {Object.keys(filterData).length}
              </h3>
            ) : null}

            <Button
              className="add-new-user "
              color="link"
              onClick={handleClear}
              style={{ color: themecolor }}
            >
              {width > 786 ? "Clear" : "Clear Filter"}
            </Button>
            {/* <X size={17} className="mx-1" onClick={handleClear} /> */}
          </div>
        ) : null}
        <Button
          style={
            width > 769
              ? {
                  width: "145px",
                  marginLeft:
                    Object.keys(filterData).length > 0 ? "10px" : "auto",
                  backgroundColor: themecolor,
                  color: "white",
                }
              : {
                  width: "60px",
                  marginLeft:
                    Object.keys(filterData).length > 0 ? "10px" : "auto",
                  backgroundColor: themecolor,
                  color: "white",
                }
          }
          color="default"
          onClick={() => {
            setFilterData([]);
            filterToggle();
          }}
        >
          {width > 769 ? "Filter Data" : <FilterIcon size={17} />}
        </Button>
        {auth?.user?.clients ? (
          <></>
        ) : (
          <Button
            style={
              width > 769
                ? {
                    display: "none",
                    backgroundColor: themecolor,
                    color: "white",
                  }
                : {
                    width: "60px",
                    marginLeft: "10px",
                    backgroundColor: themecolor,
                    color: "white",
                  }
            }
            className="add-new-user"
            color="default"
            onClick={() => {
              setCreate(true);
              setShow(true);
            }}
          >
            <UserPlus size={17} />
          </Button>
        )}
        <div style={width > 768 ? { display: "none" } : { marginLeft: "10px" }}>
          {auth?.user?.agency?.isDownloadAble === true && (
            <>
              {" "}
              <UncontrolledDropdown className="chart-dropdown">
                <DropdownToggle
                  color=""
                  className="bg-transparent btn-sm border-0 p-50"
                >
                  <MoreVertical size={18} className="cursor-pointer" />
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem
                    className="w-100"
                    style={CSVStyle}
                    onMouseEnter={() => setHoverIndex(1)}
                    onMouseLeave={() => setHoverIndex(0)}
                    onClick={() => downloadCSV(clients?.results)}
                  >
                    <FileText className="font-small-4 me-50" />
                    <span className="align-middle">Download CSV</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </>
          )}
        </div>
      </div>

      <Row className="mt-1" style={{ transition: "all 0.5s ease-in-out" }}>
        <Col
          sm={12}
          md={3}
          lg={3}
          xl={3}
          style={{
            transition: "all 0.5s ease-in-out",
            display: filterToggleMode ? "block" : "none",
          }}
        >
          <Filter
            handleFilterToggleMode={handleFilterToggleMode}
            clear={clear}
            setclear={setclearstate}
            open={filterToggleMode}
            toggleSidebar={filterToggle}
            filterData={filterData}
            setFilterToggleMode={setFilterToggleMode}
            setFilterData={setFilterData}
            handleFilter={handleFilter}
            filterKey={filterKey}
          />
        </Col>
        <Col
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={
            width <= 768
              ? {
                  paddingLeft: 0,
                  paddingRight: 0,
                  overflowY: "auto",
                  maxHeight: "600px",
                }
              : { paddingLeft: 0, paddingRight: 0 }
          }
        >
          {width < 786 && loading == true ? (
            <ComponentSpinner
              isClientCandidate={true}
              theamcolour={themecolor}
            />
          ) : (
            <>
              {clients?.results?.length > 0 ? (
                <>
                  {clients?.results?.map((result, index) => {
                    let color = "light-success";
                    if (result.action === "declined") color = "light-danger";
                    else if (result.action === "approved")
                      color = "light-success";
                    else if (result.action === "pending") color = "light-info";
                    return (
                      <>
                        <Card
                          key={index}
                          className={`card-browser-states`}
                          style={
                            width > 769
                              ? { display: "none" }
                              : filterToggleMode
                              ? { display: "none" }
                              : {
                                  borderRadius: "5px",
                                  padding: "10px",
                                  marginBottom: "1rem",
                                }
                          }
                        >
                          <CardHeader
                            style={{ padding: "0px", justifyContent: "left" }}
                          >
                            <div className="d-flex gap-1 flex-column">
                              <CardTitle
                                tag="h4"
                                className="d-flex gap-1 align-items-center"
                              >
                                <Badge
                                  Badge
                                  pill
                                  style={{
                                    fontSize: "12px",
                                  }}
                                  color={color}
                                  className="column-action d-flex align-items-center"
                                >
                                  {result?.action}
                                </Badge>
                              </CardTitle>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginLeft: "auto",
                              }}
                            >
                              <div
                                style={{
                                  color: "#7F8487",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  if (result.action !== "approved") {
                                    setLoading(true);
                                    dispatch({
                                      type: ClientActions.APPROVE_CLIENT,
                                      payload: result,
                                    });
                                  } else {
                                    toast.warn("Client already approved");
                                  }
                                }}
                              >
                                <Check size={17} className="mx-1" />
                              </div>
                              <div
                                style={{
                                  color: "#7F8487",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  if (result.action !== "declined") {
                                    setLoading(true);
                                    dispatch({
                                      type: ClientActions.DECLINED_CLIENT,
                                      payload: result,
                                    });
                                  } else {
                                    toast.warn("Client already Declined");
                                  }
                                }}
                              >
                                <X size={17} className="mx-1" />
                              </div>
                            </div>
                            <UncontrolledDropdown className="chart-dropdown">
                              <DropdownToggle
                                color=""
                                className="bg-transparent btn-sm border-0 p-50"
                              >
                                <MoreVertical
                                  size={18}
                                  className="cursor-pointer"
                                />
                              </DropdownToggle>
                              <DropdownMenu end>
                                <DropdownItem
                                  style={editStyle}
                                  onMouseEnter={() => setHoverIndex(2)}
                                  onMouseLeave={() => setHoverIndex(0)}
                                  className="w-100"
                                  onClick={() => {
                                    setClient(result);
                                    setEmail(result.email);
                                    setTimeout(() => {
                                      setIndustriesData(
                                        result?.industries_relation
                                      );
                                      setJobCategoryData(
                                        result?.jobCategory_relation
                                      );
                                    }, 200);
                                    setUpdate(true);
                                    setShow(true);
                                  }}
                                >
                                  Edit
                                </DropdownItem>
                                <DropdownItem
                                  className="w-100"
                                  style={deleteStyle}
                                  onMouseEnter={() => setHoverIndex(3)}
                                  onMouseLeave={() => setHoverIndex(0)}
                                  onClick={() => handleDeleteClick(result)}
                                >
                                  Delete
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </CardHeader>
                          <CardBody
                            style={{
                              padding: "0.5rem 0.5rem",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            {renderStates(result)}{" "}
                            <div>
                              <Collapse isOpen={isOpen[index]}>
                                {renderStatesMore(result)}{" "}
                              </Collapse>
                              <div
                                className="d-flex align-items-center justify-content-center"
                                style={{ marginTop: "10px" }}
                              >
                                {isOpen[index] ? (
                                  <>
                                    <div
                                      className="view-collapse"
                                      onClick={() => toggle(index)}
                                      style={{
                                        color: themecolor,
                                        cursor: "pointer",
                                      }}
                                    >
                                      View Less
                                      <ChevronUp size={17} />{" "}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className="view-collapse"
                                      onClick={() => toggle(index)}
                                      style={{
                                        color: themecolor,
                                        cursor: "pointer",
                                      }}
                                    >
                                      View More
                                      <ChevronDown size={17} />
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </>
                    );
                  })}
                </>
              ) : (
                <Card
                  className={`card-browser-states`}
                  style={
                    width > 769
                      ? { display: "none" }
                      : filterToggleMode
                      ? { display: "none" }
                      : {
                          borderRadius: "5px",
                          padding: "10px",
                          marginBottom: "1rem",
                        }
                  }
                >
                  <CardHeader
                    style={{ padding: "0px", justifyContent: "center" }}
                  >
                    <div className="d-flex gap-1 flex-column">
                      <CardTitle
                        tag="h4"
                        className="d-flex gap-1 align-items-center"
                      >
                        There are no records to display
                      </CardTitle>
                    </div>
                  </CardHeader>
                </Card>
              )}
            </>
          )}

          {width <= 768 &&
            !filterToggleMode &&
            clients?.results?.length > 0 && (
              <Pagination className="d-flex mt-3 align-items-center justify-content-center">
                <PaginationItem>
                  <PaginationLink
                    previous
                    href="#"
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                  >
                    <ChevronLeft size={15} /> Prev
                  </PaginationLink>
                </PaginationItem>

                {visiblePageNumbers?.map((pageNumber) => (
                  <PaginationItem
                    key={pageNumber}
                    active={pageNumber === currentPage}
                  >
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      style={{
                        borderRadius: "0.5rem ",
                        backgroundColor:
                          pageNumber === currentPage && themecolor,
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationLink
                    next
                    href="#"
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                  >
                    Next <ChevronRight size={15} />
                  </PaginationLink>
                </PaginationItem>
              </Pagination>
            )}
          <Card
            className="overflow-hidden"
            style={width < 769 ? { display: "none" } : {}}
          >
            <div className="react-dataTable">
              {/* <Loader loading={loading} /> */}
              <DataTable
                paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
                fixedHeader={true}
                selectableRows={true}
                onSelectedRowsChange={(e) => {
                  setTimeout(() => {
                    setPromiseLoading(true);
                  }, 10);
                  handleselected(e);
                }}
                fixedHeaderScrollHeight="500px"
                noHeader
                subHeader
                sortServer
                pagination
                responsive
                progressPending={loading}
                progressComponent={
                  <ComponentSpinner
                    isClientCandidate={true}
                    theamcolour={themecolor}
                  />
                }
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                paginationTotalRows={totalRows}
                paginationServer
                allowRowEvents
                customStyles={customStyles}
                highlightOnHover={true}
                columns={columns}
                className="react-dataTable"
                data={clients?.results}
                subHeaderComponent={
                  <CustomHeader
                    setShow={setShow}
                    setCreate={setCreate}
                    store={clients?.results}
                  />
                }
              />
            </div>
          </Card>
        </Col>
      </Row>
      <Modal
        className="modal-dialog-centered"
        isOpen={showDeleteModal}
        toggle={() => setShowDeleteModal(!showDeleteModal)}
      >
        <ModalHeader toggle={() => setShowDeleteModal(!showDeleteModal)}>
          Confirm
        </ModalHeader>
        <ModalBody>Are you sure to delete this Client?</ModalBody>
        <ModalFooter>
          <Button
            color="default"
            style={{ backgroundColor: themecolor, color: "white" }}
            onClick={confirmDelete}
          >
            Yes, Delete
          </Button>
          <Button color="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      {show === true ? (
        <>
          <Client
            loading={loading}
            industriesData={industriesData}
            show={show}
            jobCategoryData={jobCategoryData}
            setShow={setShow}
            setClient={setClient}
            client={client}
            update={update}
            setUpdate={setUpdate}
            setCreate={setCreate}
            setEmail={setEmail}
            ClientHandler={ClientActionHandler}
          />
        </>
      ) : null}
    </>
  );
};

export default Clients;
