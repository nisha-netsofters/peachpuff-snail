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
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomHeader from "../../components/Header/CustomHeader";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import actions from "../../redux/industries/actions";
import { tostify } from "../../components/Tostify";
import ComponentSpinner from "../../@core/components/spinner/Loading-spinner";
import IndustriesDialog from "../../components/Dialog/IndustriesDialog";
import Filter from "../../components/Forms/Industries/filter";
import Loader from "../../components/Dialog/Loader";
import useBreakpoint from "../../utility/hooks/useBreakpoints";

const Industries = () => {
  const auth = useSelector((state) => state.auth);
  const { width } = useBreakpoint();

  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const industries = useSelector((state) => state.industries);
  const [industriesCategory, setIndustriesCategory] = useState([]);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [categoryValidation, setCategoryValidation] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filterToggleMode, setFilterToggleMode] = useState(false);
  const [industriesList, setIndustriesList] = useState([]);

  const clearStates = () => {
    setLoading(false);
    setCreate(false);
    setUpdate(false);
    setIndustriesCategory([]);
    setShow(false);
  };

  useEffect(() => {
    if (industries?.results?.length >= 0) {
      setIndustriesList(industries?.results);
      setLoading(false);
    }
    if (industries.isSuccess === true) {
      clearStates();
    }
  }, [industries?.results]);

  const getIndustries = async (page) => {
    setLoading(true);
    await dispatch({
      type: actions.GET_INDUSTRIES,
      payload: {
        filterData,
        page,
        perPage,
      },
    });
  };

  useEffect(() => {
    if (!show) setIndustriesCategory([]);
  }, [show]);

  useEffect(() => {
    setIndustriesList([]);
    getIndustries(1);
  }, [filterData]);

  useEffect(() => {
    setTotalRows(industries.total);
  }, [industries]);

  const deleteIndustries = async (row) => {
    setLoading(true);
    await dispatch({
      type: actions.DELETE_INDUSTRIES,
      payload: { id: row.id },
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
              setIndustriesCategory(row);
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
      name: "industryCategory",
      selector: (row) => row?.industryCategory,
    },
  ];
  const industriesCreateHandler = async () => {
    setLoading(true);
    await dispatch({
      type: actions.CREATE_INDUSTRIES,
      payload: { data: industriesCategory },
    });
  };

  const industriesUpdateHandler = async () => {
    setLoading(true);
    await dispatch({
      type: actions.UPDATE_INDUSTRIES,
      payload: { id: industriesCategory.id, data: industriesCategory },
    });
  };

  const industriesHandler = () => {
    if (update === true) {
      if (categoryValidation.length < 2)
        tostify("Please Enter Valid Industry name");
      else industriesUpdateHandler();
    }
    if (create === true) {
      if (categoryValidation.length < 2)
        tostify("Please Enter Valid Industry name");
      else industriesCreateHandler();
    }
  };

  const handlePageChange = (page) => {
    setLoading(true);
    setCurrentPage(page);
    getIndustries(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    await dispatch({
      type: actions.GET_INDUSTRIES,
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
        // width: "200px"
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
  const renderStates = (industries) => {
    const statesArr = [
      {
        title: "Company Name",
        value: industries?.industryCategory || "-",
      },
      {
        title: "Create_AT",
        value: industries?.createdAt?.slice(0, 10) || "-",
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
  const [industriesToDelete, setIndustriesToDelete] = useState(null);
  const handleDeleteClick = (result) => {
    setIndustriesToDelete(result);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    setShowDeleteModal(false);
    setShowDeleteModal2(true);
  };
  const confirmDelete2 = () => {
    deleteIndustries(industriesToDelete);
    setShowDeleteModal(false);
    setShowDeleteModal2(false);
  };
  const totalPages = Math.ceil(industries?.total / perPage);
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
    const keys = Object.keys(industries?.results[0]);

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
          <b>Industries</b>
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
                onClick={() => downloadCSV(industries?.results)}
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
              {industries?.results?.length > 0 ? (
                <>
                  {industries?.results?.map((result, index) => {
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
                                  setIndustriesCategory(result);
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
            industries?.results?.length > 0 && (
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
                paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
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
                  <ComponentSpinner isClientCandidate={true} />
                }
                highlightOnHover={true}
                columns={columns}
                className="react-dataTable"
                data={industriesList}
                subHeaderComponent={
                  <CustomHeader
                    setShow={setShow}
                    setCreate={setCreate}
                    store={industries?.results}
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
        <ModalBody>Are you sure to delete this Industries?</ModalBody>
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
          <IndustriesDialog
            loading={loading}
            show={show}
            setShow={setShow}
            industriesCategory={industriesCategory}
            setIndustriesCategory={setIndustriesCategory}
            industriesHandler={industriesHandler}
            setUpdate={setUpdate}
            setCreate={setCreate}
            setCategoryValidation={setCategoryValidation}
          />
        </>
      ) : null}
    </>
  );
};

export default Industries;
