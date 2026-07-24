import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "react-feather";
import {
  Badge,
  Button,
  CardBody,
  CardHeader,
  CardTitle,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Pagination,
  PaginationItem,
  PaginationLink,
  UncontrolledDropdown,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Card, Col, Modal, Row } from "reactstrap";
import ComponentSpinner from "../../@core/components/spinner/Loading-spinner";
import CustomHeader from "../../components/Header/CustomHeader";
import actions from "../../redux/candidate/actions";
import userActions from "../../redux/user/actions";

import useBreakpoint from "../../utility/hooks/useBreakpoints";

const Hire = () => {
  const { width } = useBreakpoint();
  const { clients } = useSelector((state) => state?.auth?.user);
  const { candidate } = useSelector((state) => state);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [candidateList, setCandidateList] = useState([]);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(
    candidate?.results?.map(() => false) ?? []
  );
  const toggle = (index) => {
    const newCollapseStates = [...isOpen];
    newCollapseStates[index] = !newCollapseStates[index];
    setIsOpen(newCollapseStates);
  };
  useEffect(() => {
    dispatch({
      type: actions.SET_CANDIDATE,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (user?.clients?.id) {
      dispatch({
        type: userActions.GET_LOGIN_USER_DETAIL,
        payload: user?.id,
      });
    }
  }, []);

  const getCandidates = async (page) => {
    dispatch({
      type: actions.HIRED_CANDIDATE,
      payload: {
        userId: clients.id,
        page,
        perPage,
      },
    });
  };
  useEffect(() => {
    setLoading(false);
    getCandidates(1);
  }, []);

  useEffect(() => {
    setCandidateList(candidate?.results);
    setTotalRows(candidate?.total);
    if (candidate?.results?.length > 0) {
      setLoading(false);
    }
  }, [candidate]);

  const handlePageChange = (page) => {
    setLoading(true);
    setCurrentPage(page);
    getCandidates(page);
  };

  const columns = [
    // {
    //     name: 'Interview Date',
    //     selector: (row) => row?.interviews?.date
    // },
    // {
    //   name: 'Interview Company',
    //   selector: (row) => row?.interviews?.company?.companyName
    // },
    {
      name: "Create_AT",
      selector: (row) => row?.candidates?.createdAt?.slice(0, 10),
    },
    {
      name: "First Name",
      selector: (row) => row?.candidates?.firstname,
    },
    {
      name: "Last Name",
      selector: (row) => row?.candidates?.lastname,
    },
    {
      name: "Email-id",
      selector: (row) => row?.candidates?.email,
    },
    {
      name: "Contact number",
      selector: (row) => row?.candidates?.mobile,
    },
    {
      name: "Gender",
      selector: (row) => row?.candidates?.gender,
    },
    {
      name: "City",
      selector: (row) => row?.candidates?.city,
    },
    {
      name: "Job Category",
      selector: (row) =>
        row?.candidates?.professional?.jobCategory?.jobCategory,
    },
    {
      name: "Experience",
      selector: (row) => row?.candidates?.professional?.experienceInyear,
    },
    {
      name: "Qualification",
      selector: (row) => row?.candidates?.professional?.highestQualification,
    },
  ];
  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    await dispatch({
      type: actions.HIRED_CANDIDATE,
      payload: {
        userId: clients.id,
        page,
        perPage: newPerPage,
      },
    });
    setPerPage(newPerPage);
    setLoading(false);
  };
  const renderStates = (candidate) => {
    const statesArr = [
      {
        title: "Name",
        value: `${candidate?.firstname} ${candidate?.lastname}` || "-",
      },
      {
        title: "Email",
        value: candidate?.email || "-",
      },
      {
        title: "Contact",
        value: candidate?.mobile || "-",
      },
      {
        title: "City",
        value: candidate?.city || "-",
      },
      {
        title: "Job Category",
        value: candidate?.professional?.jobCategory?.jobCategory || "-",
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
        {/* <div
          key={state.title}
          className="browser-states"
          style={{ marginTop: "5px" }}
        >
          <div className="d-flex">
            <h6
              className="align-self-center mb-0 "
              style={{ fontSize: "12px", color: "black", fontWeight: "bold" }}
            >
              {state.title}
            </h6>
          </div>
          <div className="d-flex align-items-center">
            <div
              className="fw-bold text-body-heading "
              style={{ fontSize: "12px" }}
            >
              {state.value}
            </div>
          </div>
        </div> */}
        {/* <hr
          className="invoice-spacing"
          style={{ margin: 0, height: "0.5px" }}
        /> */}
      </>
    ));
  };

  const renderStatesMore = (candidate) => {
    const statesArr = [
      {
        title: "Qualification Held",
        value: candidate?.professional?.highestQualification || "-",
      },
      {
        title: "Experience",
        value: candidate?.professional?.experienceInyear || "-",
      },
      {
        title: "Gender",
        value: candidate?.gender || "-",
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
        {/* <div
          key={state.title}
          className="browser-states"
          style={{ marginTop: "5px" }}
        >
          <div className="d-flex">
            <h6
              className="align-self-center mb-0 "
              style={{ fontSize: "12px", color: "black", fontWeight: "bold" }}
            >
              {state.title}
            </h6>
          </div>
          <div className="d-flex align-items-center">
            <div
              className="fw-bold text-body-heading "
              style={{ fontSize: "12px" }}
            >
              {state.value}
            </div>
          </div>
        </div> */}
      </>
    ));
  };
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(candidate?.total / perPage);
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

  return (
    <>
      <>
        <div
          style={{
            display: "flex",
            alignItems: "end",
          }}
        >
          <h3 style={{ color: themecolor }}>
            <b>Hired Candidate</b>
          </h3>
        </div>

        <Row
          className="mt-1"
          style={{ height: "100%", transition: "all 0.5s ease-in-out" }}
        >
          <Col
            sm={12}
            style={
              width <= 768
                ? {
                    paddingLeft: 0,
                    paddingRight: 0,
                    overflow: "auto",
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
                {candidate?.results?.length > 0 ? (
                  <>
                    {candidate?.results?.map((result, index) => {
                      return (
                        <Card
                          key={index}
                          className={`card-browser-states`}
                          style={
                            width > 769
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
                    {/* </InfiniteScroll> */}
                  </>
                ) : (
                  <Card
                    className={`card-browser-states`}
                    style={
                      width > 769
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

            {width <= 768 && candidate?.results?.length > 0 && (
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
                <DataTable
                  paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
                  fixedHeader={true}
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
                  data={candidateList}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </>
    </>
  );
};

export default Hire;
