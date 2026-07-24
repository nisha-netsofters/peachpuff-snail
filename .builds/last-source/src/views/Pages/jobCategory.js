import DataTable from "react-data-table-component";
import {
  Edit,
  Delete,
  Trash,
  Filter as FilterIcon,
  UserPlus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
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
  UncontrolledDropdown,
  Row,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomHeader from "../../components/Header/CustomHeader";
import Filter from "../../components/Forms/JobCate/filter";
import JobCate from "../../components/Dialog/JobCate";
import jobCatActions from "../../redux/jobCategory/actions";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { tostify } from "../../components/Tostify";
import ComponentSpinner from "../../@core/components/spinner/Loading-spinner";
import Loader from "../../components/Dialog/Loader";
import useBreakpoint from "../../utility/hooks/useBreakpoints";

const JobCategory = () => {
  const { width } = useBreakpoint();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const jobCategory = useSelector((state) => state.jobCategory);
  const [jobCat, setJobCat] = useState([]);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [categoryValidation, setCategoryValidation] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filterToggleMode, setFilterToggleMode] = useState(false);
  const [jobCategoryList, setJobCategoryList] = useState([]);

  const clearStates = () => {
    setJobCat([]);
    setCreate(false);
    setUpdate(false);
    setLoading(false);
    setShow(false);
  };

  useEffect(() => {
    if (jobCategory?.results?.length >= 0) {
      setJobCategoryList(jobCategory?.results);
      setLoading(false);
    }
    if (jobCategory?.isSuccess) {
      clearStates();
    }
  }, [jobCategory?.results]);

  const getJobCat = async (page) => {
    setLoading(true);
    await dispatch({
      type: "GET_JOBCAT",
      payload: {
        filterData,
        page,
        perPage,
      },
    });
    // setLoading(false)
  };

  useEffect(() => {
    if (!show) setJobCat([]);
  }, [show]);

  useEffect(() => {
    setJobCategoryList([]);
    getJobCat(1);
  }, [filterData]);

  useEffect(() => {
    setTotalRows(jobCategory.total);
  }, [jobCategory]);

  const deleteJobCat = async (row) => {
    setLoading(true);
    await dispatch({
      type: jobCatActions.DELETE_JOBCAT,
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
              setJobCat(row);
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
      name: "id",
      selector: (row) => row?.id,
    },
    {
      name: "Create_AT",
      selector: (row) => row?.createdAt?.slice(0, 10),
    },
    {
      name: "Category",
      selector: (row) => row?.jobCategory,
    },
  ];

  const jobCatCreateHandler = async () => {
    setLoading(true);
    await dispatch({
      type: jobCatActions.CREATE_JOBCAT,
      payload: { data: jobCat, page: currentPage, perPage: perPage },
    });
  };

  const jobCatUpdateHandler = async () => {
    await dispatch({
      type: jobCatActions.UPDATE_JOBCAT,
      payload: {
        id: jobCat.id,
        data: jobCat,
        page: currentPage,
        perPage: perPage,
      },
    });
  };

  const jobCatHandler = () => {
    if (update === true) {
      if (categoryValidation.length < 2)
        tostify("Please Enter Valid Category name");
      else jobCatUpdateHandler();
    }
    if (create === true) {
      if (categoryValidation.length < 2)
        tostify("Please Enter Valid Category name");
      else jobCatCreateHandler();
    }
  };

  const handlePageChange = (page) => {
    setLoading(true);
    setCurrentPage(page);
    getJobCat(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    await dispatch({
      type: "GET_JOBCAT",
      payload: {
        filterData,
        page,
        perPage: newPerPage,
      },
    });
    setPerPage(newPerPage);
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
  const customStyles = {
    headCells: {
      style: {
        justifyContent: "center",
      },
    },
    cells: {
      style: {
        justifyContent: "center",
        fontWeight: "bold",
      },
    },
  };

  const filterToggle = () => {
    setFilterToggleMode(!filterToggleMode);
  };

  const renderStates = (jobCat) => {
    const statesArr = [
      {
        title: "Category",
        value: jobCat?.jobCategory || "-",
      },
      {
        title: "Create_AT",
        value: jobCat?.createdAt?.slice(0, 10) || "-",
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
  const [showDeleteModal2, setShowDeleteModal2] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobCatToDelete, setJobCatToDelete] = useState(null);
  const handleDeleteClick = (result) => {
    setJobCatToDelete(result);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    setShowDeleteModal(false);
    setShowDeleteModal2(true);
  };
  const confirmDelete2 = () => {
    deleteJobCat(jobCatToDelete);
    setShowDeleteModal(false);
    setShowDeleteModal2(false);
  };
  const totalPages = Math.ceil(jobCategory?.total / perPage);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  const visiblePageNumbers = pageNumbers.slice(startPage - 1, endPage);

  function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(jobCategory?.results[0]);

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
        <h3 className="text-primary">
          <b>Job Category</b>
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
                }
              : {
                  width: "60px",
                  marginLeft:
                    Object.keys(filterData).length > 0 ? "10px" : "auto",
                }
          }
          color="primary"
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
                ? { display: "none" }
                : { width: "60px", marginLeft: "10px" }
            }
            className="add-new-user"
            color="primary"
            onClick={() => {
              setCreate(true);
              setShow(true);
            }}
          >
            <UserPlus size={17} />
          </Button>
        )}
        <div style={width > 768 ? { display: "none" } : { marginLeft: "10px" }}>
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
                onClick={() => downloadCSV(jobCategory?.results)}
              >
                <FileText className="font-small-4 me-50" />
                <span className="align-middle">Download CSV</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
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
            <ComponentSpinner isClientCandidate={true} />
          ) : (
            <>
              {jobCategory?.results?.length > 0 ? (
                <>
                  {jobCategory?.results?.map((result, index) => {
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
                          ></div>
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
                                onClick={() => {
                                  setJobCat(result);
                                  setUpdate(true);
                                  setShow(true);
                                }}
                              >
                                Edit
                              </DropdownItem>
                              <DropdownItem
                                className="w-100"
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
            jobCategory?.results?.length > 0 && (
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
                progressComponent={
                  <ComponentSpinner isClientCandidate={true} />
                }
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                paginationTotalRows={totalRows}
                paginationServer
                allowRowEvents
                highlightOnHover={true}
                columns={columns}
                className="react-dataTable"
                data={jobCategoryList}
                subHeaderComponent={
                  <CustomHeader
                    setShow={setShow}
                    setCreate={setCreate}
                    store={jobCategory?.results}
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
        <ModalBody>Are you sure to delete this Job Category?</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={confirmDelete}>
            Yes, Delete
          </Button>
          <Button color="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        className="modal-dialog-centered"
        isOpen={showDeleteModal2}
        toggle={() => setShowDeleteModal2(!showDeleteModal2)}
      >
        <ModalHeader toggle={() => setShowDeleteModal2(!showDeleteModal2)}>
          Confirm
        </ModalHeader>
        <ModalBody>
          This action can effect Database. Sure want to process?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={confirmDelete2}>
            Yes, Delete
          </Button>
          <Button color="secondary" onClick={() => setShowDeleteModal2(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      {show === true ? (
        <>
          <JobCate
            loading={loading}
            show={show}
            setShow={setShow}
            jobCat={jobCat}
            setJobCat={setJobCat}
            jobCatHandler={jobCatHandler}
            setUpdate={setUpdate}
            setCreate={setCreate}
            setCategoryValidation={setCategoryValidation}
          />
        </>
      ) : null}
    </>
  );
};

export default JobCategory;
