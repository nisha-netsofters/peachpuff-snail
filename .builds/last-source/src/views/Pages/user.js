/*eslint-disable */
import DataTable from "react-data-table-component";
import {
  Edit,
  Delete,
  Image,
  Trash,
  Filter as FilterIcon,
  UserPlus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText,
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
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomHeader from "../../components/Header/CustomHeader";
import Filter from "../../components/Forms/User/filter";
import JobCate from "../../components/Dialog/JobCate";
import userActions from "../../redux/user/actions";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import UserDialog from "../../components/Dialog/UserDialog";
import { tostify } from "../../components/Tostify";
import ComponentSpinner from "../../@core/components/spinner/Loading-spinner";
// import { uploadFiles } from './../../helper/fileUpload'
import Loader from "./../../components/Dialog/Loader";
import { toast } from "react-toastify";
import { awsUploadAssetsWithResp } from "../../helper/awsUploadAssets";
import planActions from "../../redux/plan/actions";
import useBreakpoint from "../../utility/hooks/useBreakpoints";

const User = () => {
  const auth = useSelector((state) => state.auth);
  const { width } = useBreakpoint();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user);
  const plans = useSelector((state) => state.plans?.plans);
  const [show, setShow] = useState(false);
  const [user, setUser] = useState([]);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [nameValidation, setNameValidation] = useState("");
  const [emailValidation, setEmailValidation] = useState("");
  const [passwordValidation, setPasswordValidation] = useState("");
  const [mobileValidation, setMobileValidation] = useState("");
  const [addressValidation, setAddressValidation] = useState("");
  const [rolevalidation, setRolevalidation] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(false);

  console.info("nameValidation => ", nameValidation);

  const [totalRows, setTotalRows] = useState();
  const [perPage, setPerPage] = useState(10);
  const [filterToggleMode, setFilterToggleMode] = useState(false);
  const [usersList, setUsersList] = useState();
  const [isOpen, setIsOpen] = useState(users?.results?.map(() => false) ?? []);
  const toggle = (index) => {
    const newCollapseStates = [...isOpen];
    newCollapseStates[index] = !newCollapseStates[index];
    setIsOpen(newCollapseStates);
  };
  useEffect(() => {
    if (update === true) {
      setNameValidation(user?.name);
      setEmailValidation(user?.email);
      setPasswordValidation(user?.password);
      setMobileValidation(user?.mobile);
      setRolevalidation(user?.role?.name);
      setAddressValidation(user?.address);
    }
  }, [update]);

  const clearStates = () => {
    setUser([]);
    setLoading(false);
    setCreate(false);
    setUpdate(false);
    setShow(false);
  };

  useEffect(() => {
    if (users?.constraint) {
      setLoading(false);
      toast.error("Email is Exist");
    } else if (users?.error) {
      setLoading(false);
      toast.error("Email is Exist");
    } else {
      if (users?.users?.isSuccess) clearStates();
      if (users?.users?.results?.length >= 0) {
        setLoading(false);
        setUsersList(users?.users?.results);
        setTotalRows(users?.users?.total);
      }
    }
    // if (users?.users?.results?.length >= 0) {
    //     setLoading(false)
    //     setUsersList(users?.users?.results)
    // } else if (users?.constraint) {
    //     setLoading(false)
    //     toast.error("Email is Exist")
    // } else if (users?.error) {
    //     setLoading(false)
    //     toast.error("Email is Exist")
    // } else (users?.users?.isSuccess)
    // {
    //     clearStates()
    // }
  }, [users]);

  useEffect(() => {
    dispatch({ type: "ROLES" });
    dispatch({
      type: planActions.GET_ALL_PLANS,
    });
  }, []);
  const getUser = async (page) => {
    console.log("getUser", getUser);
    setLoading(true);
    await dispatch({
      type: userActions.GET_USER,
      payload: {
        filterData,
        page,
        perPage,
      },
    });
  };

  useEffect(() => {
    if (!show) setUser([]);
  }, [show]);

  useEffect(() => {
    if (filterData && Object.keys(filterData).length > 0) {
      getUser(1);
    }
  }, [filterData]);

  useEffect(() => {
    getUser(1);
  }, []);

  useEffect(() => {
    setTotalRows(users.total);
  }, [users.total]);

  const deleteUser = async (row) => {
    setLoading(true);
    await dispatch({
      type: userActions.DELETE_USER,
      payload: { id: row.id, page: currentPage, perPage: perPage },
    });
  };

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
              setUser(row);
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
      name: "Create_AT",
      selector: (row) => row?.createdAt?.slice(0, 10),
    },
    {
      name: "Plan",
      selector: (row) => row?.subscription?.plan?.planName,
    },
    {
      name: "Name",
      selector: (row) => row?.name,
    },
    {
      name: "Company Name",
      selector: (row) => row?.clients?.companyName || "-",
    },
    {
      name: "Email",
      selector: (row) => row?.email,
    },
    {
      name: "Contact Number",
      selector: (row) => row?.mobile,
    },
    {
      name: "Role",
      selector: (row) => row?.role?.name,
    },
    {
      name: "Address",
      selector: (row) => row?.address,
    },
    {
      name: "image",
      cell: (row) => {
        return row.image ? (
          <>
            <div
              style={{ color: "#7F8487", cursor: "pointer" }}
              onClick={() => window.open(row.image)}
            >
              <Image />
            </div>
          </>
        ) : (
          "null"
        );
      },
    },
  ];

  const userCreateHandler = async () => {
    setLoading(true);
    if (user?.image) {
      // const resp = await uploadFiles(user?.image)
      const resp = await awsUploadAssetsWithResp(user?.image);

      user.image = `${resp.url}`;
    }
    const fm = new FormData();

    for (const key in user) {
      fm.append(key, user[key]);
    }
    await dispatch({
      type: userActions.CREATE_USER,
      payload: { data: fm, page: currentPage, perPage: perPage },
      setLoading: setLoading,
    });
  };

  const userUpdateHandler = async () => {
    const freePlanId = plans?.filter((item) => {
      if (item?.planName == "free" && item?.id == user?.planId) {
        return item;
      }
    });

    setLoading(true);
    if (typeof user?.image === "object" && user?.image !== null) {
      const resp = await awsUploadAssetsWithResp(user?.image);

      user.image = `${resp?.url}`;
    }
    // if (freePlanId?.length) {
    //     await dispatch({
    //         type : userActions.CREATE_FREE_PLAN,
    //         payload : { id : user?.id}
    //     })
    // }
    await dispatch({
      type: userActions.UPDATE_USER,
      payload: { id: user.id, data: user, page: currentPage, perPage: perPage },
    });
  };

  // const userHandler = () => {
  const Validations = async () => {
    const error = false;
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (
      rolevalidation == "" ||
      rolevalidation == undefined ||
      rolevalidation == null ||
      rolevalidation == "null"
    )
      return tostify("Please Select Role", error);

    if (!nameValidation || nameValidation.length < 2)
      return tostify(" Please Enter Valid Name", error);

    if (!emailValidation || regex.test(emailValidation) === false)
      return tostify("Please Enter Valid Email", error);

    if (!passwordValidation || passwordValidation.length < 8)
      return tostify("Please Enter 8 Character password", error);

    if (!mobileValidation || mobileValidation.length !== 10)
      return tostify("Please Enter Valid Contact Number", error);

    if (
      !user?.state ||
      user.state.length === 0 ||
      !user.stateId ||
      user.stateId.length === 0
    )
      return tostify("Please Enter Valid State", error);

    if (
      !user?.city ||
      user.city.length === 0 ||
      !user.cityId ||
      user.cityId.length === 0
    )
      return tostify("Please Enter Valid City", error);



    return error;
  };

  const UserActionHandler = async () => {
    const err = await Validations();
    console.info("----------------------------");
    console.info("err =>", err);
    console.info("----------------------------");
    if (update === true && err === false) {
      userUpdateHandler();
    }
    if (create === true && err === false) {
      userCreateHandler();
    }
  };

  const handlePageChange = (page) => {
    setLoading(true);
    setCurrentPage(page);
    getUser(page);
  };
  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    await dispatch({
      type: "GET_USER",
      payload: {
        filterData,
        page,
        perPage: newPerPage,
      },
    });
    setPerPage(newPerPage);
    // setLoading(false)
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
  const handleClear = async () => {
    setclear(true);
  };
  const setclearstate = (clear) => {
    setclear(clear);
  };

  const filterToggle = () => {
    setFilterToggleMode(!filterToggleMode);
  };

  const renderStates = (users) => {
    const statesArr = [
      {
        title: "Plan",
        value: users?.subscription?.plan?.planName || "-",
      },
      {
        title: "Name",
        value: users?.name || "-",
      },
      {
        title: "Company Name",
        value: users?.clients?.companyName || "-",
      },
      {
        title: "Email",
        value: users?.email || "-",
      },
      {
        title: "Contact Number",
        value: users?.mobile || "-",
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

  const renderStatesMore = (users) => {
    const statesArr = [
      {
        title: "Role",
        value: users?.role?.name || "-",
      },
      {
        title: "Address",
        value: users?.address || "-",
      },
      {
        title: "Create_AT",
        value: users?.createdAt?.slice(0, 10) || "-",
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
  const [usersToDelete, setUsersToDelete] = useState(null);

  const handleDeleteClick = (result) => {
    setUsersToDelete(result);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    deleteUser(usersToDelete);
    setShowDeleteModal(false);
  };

  const totalPages = Math.ceil(users?.users?.total / perPage);
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
    const keys = Object.keys(usersList[0]);

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
  return (
    <>
      <div style={{ display: "flex", alignItems: "end" }}>
        <h3 style={{ color: themecolor }}>
          <b>Users</b>
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
              <UncontrolledDropdown className="chart-dropdown">
                <DropdownToggle
                  color=""
                  className="bg-transparent btn-sm border-0 p-50"
                >
                  <MoreVertical size={18} className="cursor-pointer" />
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem
                    style={CSVStyle}
                    onMouseEnter={() => setHoverIndex(1)}
                    onMouseLeave={() => setHoverIndex(0)}
                    className="w-100"
                    onClick={() => downloadCSV(usersList)}
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
              {users?.users?.results?.length > 0 ? (
                <>
                  {users?.users?.results?.map((result, index) => {
                    return (
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
                            ></CardTitle>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginLeft: "auto",
                            }}
                          >
                            {result?.image && (
                              <div
                                style={{
                                  color: "#7F8487",
                                  cursor: "pointer",
                                }}
                                onClick={() => window.open(result?.image)}
                              >
                                <Image className="mx-1" size={17} />
                              </div>
                            )}
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
                                className="w-100"
                                style={editStyle}
                                onMouseEnter={() => setHoverIndex(2)}
                                onMouseLeave={() => setHoverIndex(0)}
                                onClick={() => {
                                  setUser(result);
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
            users?.users?.results?.length > 0 && (
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
                fixedHeaderScrollHeight="500px"
                noHeader
                subHeader
                sortServer
                pagination
                responsive
                customStyles={customStyles}
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
                highlightOnHover={true}
                columns={columns}
                className="react-dataTable"
                data={usersList}
                subHeaderComponent={
                  <CustomHeader
                    setShow={setShow}
                    setCreate={setCreate}
                    store={usersList}
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
        <ModalBody>Are you sure to delete this Users?</ModalBody>
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
          <UserDialog
            loading={loading}
            show={show}
            setShow={setShow}
            user={user}
            // roles={roles}
            setUser={setUser}
            // userHandler={userHandler}
            update={update}
            setUpdate={setUpdate}
            setCreate={setCreate}
            setNameValidation={setNameValidation}
            setEmailValidation={setEmailValidation}
            setPasswordValidation={setPasswordValidation}
            setMobileValidation={setMobileValidation}
            setAddressValidation={setAddressValidation}
            setRolevalidation={setRolevalidation}
            UserActionHandler={UserActionHandler}
          />
        </>
      ) : null}
    </>
  );
};

export default User;
