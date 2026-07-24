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
  Check,
  X,
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
import Filter from "../../components/Forms/lead/filter";
// import jobCatActions from "../../redux/jobCategory/actions"
import leadActions from "../../redux/lead/actions";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import LeadDialog from "../../components/Dialog/LeadDialog";
import ComponentSpinner from "../../@core/components/spinner/Loading-spinner";
import Loader from "./../../components/Dialog/Loader";
import useBreakpoint from "../../utility/hooks/useBreakpoints";

const Lead = () => {
  // const auth = useSelector((state) => state.auth);
  const { width } = useBreakpoint();

  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const leads = useSelector((state) => state.lead);
  const [lead, setLead] = useState([]);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filterToggleMode, setFilterToggleMode] = useState(false);
  const [leadList, setLeadList] = useState();
  const [isOpen, setIsOpen] = useState(leads?.results?.map(() => false) ?? []);
  const toggle = (index) => {
    const newCollapseStates = [...isOpen];
    newCollapseStates[index] = !newCollapseStates[index];
    setIsOpen(newCollapseStates);
  };
  const clearStates = () => {
    setLoading(false);
    setCreate(update);
    setUpdate(false);
    setLead([]);
    setShow(false);
  };
  useEffect(() => {
    if (leads?.results?.length >= 0) {
      setLeadList(leads?.results);
      setLoading(false);
    }
    if (leads?.isSuccess) {
      clearStates();
    }
  }, [leads?.results]);

  const getLead = async (page) => {
    setLoading(true);
    await dispatch({
      type: leadActions.GET_LEAD,
      payload: {
        filterData,
        page,
        perPage,
      },
    });
  };

  useEffect(() => {
    if (!show) setLead([]);
  }, [show]);

  useEffect(() => {
    if (filterData && Object.keys(filterData).length > 0) {
      getLead(1);
    }
  }, [filterData]);

  useEffect(() => {
    if (create === false && update === false) {
      getLead(currentPage);
    }
  }, [create, update]);
  useEffect(() => {
    setTotalRows(lead.total);
  }, [lead]);

  const deleteLead = async (row) => {
    setLoading(true);
    await dispatch({
      type: leadActions.DELETE_LEAD,
      payload: { id: row.id, page: currentPage, perPage: perPage },
    });
  };

  const columns = [
    // {
    //   name: "Action",
    //   minWidth: "110px",
    //   cell: (row) => (
    //     <div div className="column-action d-flex align-items-center">
    //       {row.fullname}
    //       <span
    //         style={{ cursor: "pointer" }}
    //         onClick={() => {
    //           setLead(row);
    //           setUpdate(true);
    //           setShow(true);
    //         }}
    //       >
    //         <Edit size={17} className="mx-1" />
    //       </span>
    //       <span
    //         style={{ cursor: "pointer" }}
    //         onClick={() => handleDeleteClick(row)}
    //       >
    //         <Trash size={17} className="mx-1" />
    //       </span>
    //     </div>
    //   ),
    // },
    {
      name: "Approve ",
      minWidth: "110px",
      cell: (row) => (
        <div div className="column-action d-flex align-items-center">
          {row.fullname}
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              setLoading(true);
              dispatch({
                type: leadActions.APPROVE_LEAD,
                payload: row,
              });
            }}
          >
            <Check size={17} className="mx-1" />
          </span>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              setLoading(true);
              dispatch({
                type: leadActions.DECLINED_LEAD,
                payload: row,
              });
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
      cell: () => {
        let color = "light-info";

        return (
          <Badge
            Badge
            pill
            color={color}
            className="column-action d-flex align-items-center"
            style={{ textTransform: "capitalize" }}
          >
            Pending
          </Badge>
        );
      },
    },
    {
      name: "Create_AT",
      selector: (row) => row?.createdAt?.slice(0, 10),
    },

    {
      name: "Company Name",
      selector: (row) => row?.companyName,
    },
    {
      name: "company owner",
      selector: (row) => row?.companyowner,
    },

    {
      name: "Contact Number",
      selector: (row) => row?.mobile,
    },
    {
      name: "Email",
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
      name: "City",
      selector: (row) => row?.city,
    },
    {
      name: "state",
      selector: (row) => row?.state,
    },
    {
      name: "Pin",
      selector: (row) => row?.zip,
    },

    // {
    //     name: 'image',
    //     cell: (row) => {
    //         return row.visitingCard ? (
    //             <>
    //                 <div
    //                     style={{ color: '#7F8487', cursor: 'pointer' }}
    //                     onClick={() => window.open(row.visitingCard)}
    //                 >
    //                     <Image />
    //                 </div>
    //             </>
    //         ) : (
    //             'null'
    //         )
    //     }
    // }
  ];

  // const leadCreateHandler = async () => {
  //   setLoading(true);
  //   await dispatch({
  //     type: leadActions.CREATE_LEAD,
  //     payload: { data: lead, page: currentPage, perPage: perPage },
  //   });
  // };

  // const leadUpdateHandler = async () => {
  //   setLoading(true);
  //   delete lead.updated_at;
  //   await dispatch({
  //     type: leadActions.UPDATE_LEAD,
  //     payload: { id: lead.id, data: lead, page: currentPage, perPage: perPage },
  //   });
  // };

  // const leadHandler = () => {
  //   if (update === true) {
  //     leadUpdateHandler();
  //   }
  //   if (create === true) {
  //     leadCreateHandler();
  //   }
  // };

  const handlePageChange = (page) => {
    setLoading(true);
    setCurrentPage(page);
    getLead(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    await dispatch({
      type: "GET_LEAD",
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
  // const handleClear = () => {
  //   setclear(true);
  // };
  const setclearstate = (clear) => {
    setclear(clear);
  };

  const filterToggle = () => {
    setFilterToggleMode(!filterToggleMode);
  };
  const renderStates = (leads) => {
    const statesArr = [
      {
        title: "Company name",
        value: leads?.companyName || "-",
      },
      {
        title: "company owner",
        value: leads?.companyowner || "-",
      },
      {
        title: "Contact Number",
        value: leads?.mobile || "-",
      },
      {
        title: "Email",
        value: leads?.email || "-",
      },
      {
        title: "website",
        value: leads?.website || "-",
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

  const renderStatesMore = (leads) => {
    const statesArr = [
      {
        title: "street",
        value: leads?.street || "-",
      },
      {
        title: "City",
        value: leads?.city || "-",
      },
      {
        title: "state",
        value: leads?.state || "-",
      },
      {
        title: "Pin",
        value: leads?.zip || "-",
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
  // const [leadToDelete, setOnLeadToDelete] = useState(null);

  // const handleDeleteClick = (result) => {
  //   setOnLeadToDelete(result);
  //   setShowDeleteModal(true);
  // };
  const confirmDelete = () => {
    deleteLead(leadToDelete);
    setShowDeleteModal(false);
  };

  const totalPages = Math.ceil(leads?.total / perPage);
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
  // const [hoverIndex, setHoverIndex] = useState(0);
  // const CSVStyle = {
  //   backgroundColor: hoverIndex == 1 && `${themecolor}30`,
  //   color: hoverIndex == 1 && themecolor,
  // };
  // const editStyle = {
  //   backgroundColor: hoverIndex == 2 && `${themecolor}30`,
  //   color: hoverIndex == 2 && themecolor,
  // };
  // const deleteStyle = {
  //   backgroundColor: hoverIndex == 3 && `${themecolor}30`,
  //   color: hoverIndex == 3 && themecolor,
  // };

  // function convertArrayOfObjectsToCSV(array) {
  //   let result;

  //   const columnDelimiter = ",";
  //   const lineDelimiter = "\n";
  //   const keys = Object.keys(leads?.results[0]);

  //   result = "";
  //   result += keys.join(columnDelimiter);
  //   result += lineDelimiter;

  //   array.forEach((item) => {
  //     let ctr = 0;
  //     keys.forEach((key) => {
  //       if (ctr > 0) result += columnDelimiter;

  //       result += item[key];

  //       ctr++;
  //     });
  //     result += lineDelimiter;
  //   });

  //   return result;
  // }

  // function downloadCSV(array) {
  //   const link = document.createElement("a");
  //   let csv = convertArrayOfObjectsToCSV(array);
  //   if (csv === null) return;

  //   const filename = "export.csv";

  //   if (!csv.match(/^data:text\/csv/i)) {
  //     csv = `data:text/csvcharset=utf-8,${csv}`;
  //   }

  //   link.setAttribute("href", encodeURI(csv));
  //   link.setAttribute("download", filename);

  //   // doc.autoPrint(csv)
  //   link.click();
  // }
  return (
    <>
      <div style={{ display: "flex", alignItems: "end" }}>
        <h3 style={{ color: themecolor }}>
          <b>Lead</b>
        </h3>
        {/* {Object.keys(filterData).length > 0 ? (
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
              style={{ color: themecolor }}
              onClick={handleClear}
            >
              {width > 786 ? "Clear" : "Clear Filter"}
            </Button>
            <X size={17} className="mx-1" onClick={handleClear} />
          </div>
        ) : null} */}
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
              {leads?.results?.length > 0 ? (
                <>
                  {leads?.results?.map((result, index) => {
                    let color = "light-success";
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
                                Pending
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
                            {" "}
                            <div
                              style={{
                                color: "#7F8487",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setLoading(true);
                                dispatch({
                                  type: leadActions.APPROVE_LEAD,
                                  payload: result,
                                });
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
                                setLoading(true);
                                dispatch({
                                  type: leadActions.DECLINED_LEAD,
                                  payload: result,
                                });
                              }}
                            >
                              <X size={17} className="mx-1" />
                            </div>
                          </div>
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

          {width <= 768 && !filterToggleMode && leads?.results?.length > 0 && (
            <Pagination className="d-flex mt-3 align-items-center justify-content-center">
              <PaginationItem>
                <PaginationLink
                  previous
                  href="#"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
                      backgroundColor: pageNumber === currentPage && themecolor,
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
                fixedHeader={true}
                fixedHeaderScrollHeight="500px"
                noHeader
                subHeader
                sortServer
                pagination
                responsive
                customStyles={customStyles}
                progressPending={loading}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                paginationTotalRows={totalRows}
                paginationServer
                allowRowEvents
                progressComponent={
                  <ComponentSpinner
                    isClientCandidate={true}
                    theamcolour={themecolor}
                  />
                }
                highlightOnHover={true}
                columns={columns}
                className="react-dataTable"
                data={leadList}
                // subHeaderComponent={
                //   <CustomHeader
                //     setShow={setShow}
                //     setCreate={setCreate}
                //     store={leads?.results}
                //   />
                // }
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
        <ModalBody>Are you sure to delete this Lead?</ModalBody>
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
      {/* {show === true ? (
        <>
          <LeadDialog
            loading={loading}
            show={show}
            setShow={setShow}
            lead={lead}
            setLead={setLead}
            leadHandler={leadHandler}
            setUpdate={setUpdate}
            setCreate={setCreate}
          />
        </>
      ) : null} */}
    </>
  );
};

export default Lead;
