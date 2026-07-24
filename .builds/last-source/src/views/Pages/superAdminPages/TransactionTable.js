/*eslint-disable */
import DataTable from "react-data-table-component";
import {
  Eye,
  Filter as FilterIcon,
  UserPlus,
  ChevronLeft,
  X,
  ChevronRight,
} from "react-feather";
import {
  Badge,
  Button,
  Card,
  Col,
  Modal,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomHeader from "../../../components/Header/CustomHeader";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
// import { uploadFiles } from './../../helper/fileUpload'
import Loader from "./../../../components/Dialog/Loader";
import { toast } from "react-toastify";
import agencyActions from "../../../redux/agency/actions";
import AgencyFilter from "../../../components/superAdminComponents/Filter/agency/AgencyFilter";
import useBreakpoint from "../../../utility/hooks/useBreakpoints";
import { documentationImageLink } from "../../../configs/config";
import { useHistory } from "react-router-dom";
import InvoiceDownload from "./InvoiceDownload";
import { addDays } from "date-fns";
import { useOnClickOutside } from "./../../../utility/hooks/useOnClickOutside";
import Filter from "./Filter";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
function DatePicker({ handleClear, setState, setFilterData, state }) {
  return (
    <div>
      <DateRangePicker
        placement="auto"
        onClean={() => handleClear()}
        onChange={(e) => setState(e)}
        value={state}
      />
    </div>
  );
}

const TransactionTable = () => {
  const themecolor = localStorage.getItem("themecolor");
  const { user } = useSelector((state) => state.auth);
  console.info("----------------------------");
  console.info("----------------------------");
  const dispatch = useDispatch();
  const [state, setState] = useState([]);

  console.info("state =>", state);
  const { width } = useBreakpoint();
  const { isLoading, clientsTransactions } = useSelector(
    (state) => state.agency
  );

  useEffect(() => {
    async function callapi() {
      if (state && state?.length > 0) {
        setFilterData({ startDate: state[0], endDate: state[1] });
      }
    }
    callapi();
  }, [state]);

  const [show, setShow] = useState(false);
  const [download, setdownload] = useState(false);
  const [agency, setAgency] = useState([]);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState();
  const [perPage, setPerPage] = useState(10);
  const [filterToggleMode, setFilterToggleMode] = useState(false);
  const [agencyList, setAgencyList] = useState();
  const [isOpen, setIsOpen] = useState(
    clientsTransactions?.results?.map(() => false) ?? []
  );

  const toggle = (index) => {
    const newCollapseStates = [...isOpen];
    newCollapseStates[index] = !newCollapseStates[index];
    setIsOpen(newCollapseStates);
  };

  const clearStates = () => {
    setAgency([]);
    setLoading(false);
    setShow(false);
  };
  const history = useHistory();

  useEffect(() => {
    if (clientsTransactions?.constraint) {
      setLoading(false);
      toast.error("Email is Exist");
    } else if (clientsTransactions?.error) {
      setLoading(false);
      toast.error("Email is Exist");
    } else {
      if (clientsTransactions?.isSuccess) clearStates();
      if (clientsTransactions?.data?.length >= 0) {
        setLoading(false);
        setAgencyList(clientsTransactions?.data || []);
        setTotalRows(clientsTransactions?.total);
      }
    }
  }, [clientsTransactions]);

  const getAgency = async (page) => {
    console.log("NO way herer");
    await dispatch({
      type: agencyActions.GET_TRANSACTION,
      payload: {
        filterData,
        page: page - 1,
        perPage,
      },
    });
  };

  useEffect(() => {
    if (!show) setAgency([]);
  }, [show]);

  useEffect(() => {
    if (Object.keys(filterData)?.length) {
      getAgency(1);
    }
  }, [filterData]);

  useEffect(() => {
    getAgency(1);
  }, []);

  useEffect(() => {
    setTotalRows(clientsTransactions?.total);
  }, [clientsTransactions?.total]);

  const previewColumn =
    user?.email == "uniqueworldjobs@gmail.com"
      ? {
          name: "Preview",
          minWidth: "110px",
          cell: (row) => (
            <div className="column-action d-flex align-items-center">
              <span
                style={
                  row?.servertoserverRes?.state !== "COMPLETED"
                    ? { pointerEvents: "none", opacity: "0.5" }
                    : { cursor: "pointer" }
                }
                onClick={() => {
                  if (row?.servertoserverRes?.state === "COMPLETED") {
                    setAgency(row);
                    setUpdate(true);
                    setShow(true);
                  }
                }}
              >
                <Eye size={17} className="mx-1" />
              </span>
            </div>
          ),
        }
      : null;
  const columns = [
    ...(previewColumn ? [previewColumn] : []),
    {
      name: "Create_AT",
      selector: (row) => row?.createdAt?.slice(0, 10),
    },
    {
      name: "Status",
      minWidth: "150px",
      selector: (row) => {
        let statuss = row?.servertoserverRes?.state
          ? row?.servertoserverRes?.state
          : "PENDING";
        let color = "light-success";
        console.info("statuss =>", statuss);
        if (statuss == "PENDING") color = "light-warning";
        // else if (row?.interviewStatus === "rejected") color = "light-danger";
        else if (statuss == "COMPLETED") color = "light-success";
        else color = "light-danger";
        return (
          <Badge
            Badge
            pill
            color={color}
            className="column-action d-flex align-items-center"
            style={{ textTransform: "capitalize" }}
          >
            {statuss}
          </Badge>
        );
        {
          /* <div className="column-action d-flex align-items-center">
        {row?.servertoserverRes?.state
          ? row?.servertoserverRes?.state
          : "PENDING"}
        </div> */
        }
      },
    },
    {
      name:
        user?.email == "uniqueworldjobs@gmail.com"
          ? "Invoice To"
          : "Client Name",
      selector: (row) => {
        let invoiceto = "";
        if (
          row?.Company !== null &&
          row?.Company !== "" &&
          row?.Company !== "null" &&
          row?.Company !== undefined
        ) {
          invoiceto = row?.Company;
        } else {
          invoiceto = `${
            row?.firstname && row?.firstname !== null ? row?.firstname : ""
          } ${row?.lastname && row?.lastname !== null ? row?.lastname : ""}`;
        }
        return invoiceto;
      },
    },
    {
      name: "Agency Name",
      selector: (row) => row?.agency?.name,
    },
    {
      name: "Transaction Id",
      selector: (row) => row?.merchantTransactionId,
    },
    {
      name: "Plans",
      selector: (row) => row?.plans?.planName,
    },
    {
      name: "TotalAmount",
      selector: (row) => row?.TotalAmount,
    },
    {
      name: "Address",
      selector: (row) => row?.address,
    },
    {
      name: "State",
      selector: (row) => row?.state,
    },
    {
      name: "City",
      selector: (row) => row?.city,
    },
  ];

  const handlePageChange = (page) => {
    getAgency(page);
  };
  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    await dispatch({
      type: agencyActions.GET_TRANSACTION,
      payload: {
        filterData,
        page: page - 1,
        perPage: newPerPage,
      },
    });
    setPerPage(newPerPage);
    setLoading(false);
  };

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
    setState([]);
    setFilterData({});
    setclear(true);
    await dispatch({
      type: agencyActions.GET_TRANSACTION,
      payload: {
        filterData: [],
        page: 0,
        perPage: 10,
      },
    });
  };
  const setclearstate = (clear) => {
    setclear(clear);
  };

  function filterKey(data) {
    const notIncludedKeys = ["endDate"];
    return Object.keys(data).filter((key) => !notIncludedKeys.includes(key));
  }

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

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(clientsTransactions?.total / perPage);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  const visiblePageNumbers = pageNumbers.slice(startPage - 1, endPage);
  let invoiceto = "";
  if (
    agency?.Company !== null &&
    agency?.Company !== "" &&
    agency?.Company !== "null" &&
    agency?.Company !== undefined
  ) {
    invoiceto = agency?.Company;
  } else {
    invoiceto = `${
      agency?.firstname && agency?.firstname !== null ? agency?.firstname : ""
    } ${agency?.lastname && agency?.lastname !== null ? agency?.lastname : ""}`;
  }
  const closeModal = () => {
    setShow(false);
  };

  return (
    <>
      <Modal
        isOpen={show}
        toggle={() => setShow(false)}
        className="modal-dialog-centered modal-xl"
      >
        <div
          className="position-absolute"
          style={{
            right: "1px",
            cursor: "pointer",
            zIndex: "555",
            backgroundColor: "lightgray",
            borderRadius: "5rem",
            margin: "1rem",
          }}
          onClick={() => setShow(false)}
        >
          <X onClick={() => setShow(false)} size={30} />
        </div>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              right: "1rem",
              top: "1rem",
              zIndex: "50",
              padding: "1.8rem",
            }}
          >
            <h3 className="invoice-title" style={{ textAlign: "right" }}>
              <b>Invoice</b>
            </h3>
            <p
              className="invoice-title"
              style={{ textAlign: "right", marginBottom: "0" }}
            >
              Invoice no: <b>{`# ${agency?.invoicenumber}`}</b>
            </p>
            <div className="invoice-date-wrapper d-flex gap-1">
              <p className="invoice-date-title">Date Issued:</p>
              <p className="invoice-date">{agency?.createdAt?.slice(0, 10)}</p>
            </div>
          </div>
          <div className="content-wrapper p-0 animate__animated animate__fadeIn">
            <div className="invoice-preview-wrapper">
              <div className="invoice-preview row">
                <div className="col-12">
                  <div className="invoice-preview-card card">
                    <div className="invoice-padding pb-0 card-body">
                      <div className="d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0">
                        <div>
                          <p className="mb-25 card-text mt-5"></p>
                          <h4 className="invoice-title">From:</h4>
                          <p className="mb-25 card-text">Unique World</p>
                          <p className="mb-25 card-text">
                            335-336, Fortune High Street, <br /> Green City
                            Road,
                            <br /> Near Madhuvan Circle, <br /> Adajan, Surat -
                            395009
                          </p>
                          <p className="mb-25 card-text">
                            GST No: 24AMVPG6524E1Z0
                          </p>
                        </div>
                      </div>
                    </div>
                    <hr className="invoice-spacing" />
                    <div className="d-flex justify-content-between px-2">
                      <div>
                        <div className="d-flex justify-content-between flex-md-row flex-column invoice-spacing mb-2">
                          <div>
                            <h4 className="invoice-title">To:</h4>
                            <p className="mb-25 card-text">{invoiceto}</p>
                            {agency?.gst && (
                              <p className="mb-25 card-text">
                                GST No: {agency?.gst}
                              </p>
                            )}
                            <p className="mb-25 card-text">
                              State: {agency?.state}
                            </p>
                            <p className="mb-25 card-text">
                              City: {agency?.city}
                            </p>
                            <p className="mb-25 card-text">
                              Address: {agency?.address}
                            </p>
                            <p className="mb-25 card-text">
                              Pincode: {agency?.pincode}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="d-flex justify-content-between flex-md-row flex-column invoice-spacing mb-2">
                          <div>
                            <h4 className="invoice-title">Payment Agency:</h4>
                            <p className="mb-25 card-text">
                              Payment state:
                              <span
                                style={{
                                  color:
                                    agency?.servertoserverRes?.state ===
                                    "COMPLETED"
                                      ? "green"
                                      : "red",
                                  fontWeight:
                                    agency?.servertoserverRes?.state ===
                                    "COMPLETED"
                                      ? "bold"
                                      : "normal",
                                }}
                              >
                                {agency?.servertoserverRes?.state}
                              </span>
                            </p>
                            <p className="mb-25 card-text">
                              Type:{" "}
                              {
                                agency?.servertoserverRes?.paymentInstrument
                                  ?.type
                              }
                            </p>
                            <p className="mb-25 card-text">
                              MerchantTransactionId:{" "}
                              {agency?.servertoserverRes?.merchantTransactionId}
                            </p>
                            <p className="mb-25 card-text">
                              TransactionId:{" "}
                              {agency?.servertoserverRes?.transactionId}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="py-1">Plan Name</th>
                            <th className="py-1">Price</th>
                            <th className="py-1">Tax</th>
                            <th className="py-1">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-1">
                              <b className="card-text fw-bold mb-25">
                                {agency?.plans?.planName}
                              </b>
                            </td>
                            <td className="py-1">
                              <span className="fw-bold">{`₹ ${agency?.plans?.price}`}</span>
                            </td>
                            <td className="py-1">
                              <span className="fw-bold">{`${agency?.tax} %`}</span>
                            </td>
                            <td className="py-1">
                              <span className="fw-bold">{`₹ ${agency?.TotalAmount}`}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
            zIndex: "55",
          }}
        >
          <button
            onClick={() => setdownload(true)}
            // style={{ padding: "10px", color: "black" }}
            style={{
              backgroundColor: "#CF509B",
              padding: "0.6rem 2.5rem",
              color: "white",
              borderRadius: "5px",
              border: "none",
              fontWeight: "bold",
              outline: "none",
            }}
          >
            Download Invoice
          </button>
        </div>
      </Modal>
      <div style={{ display: "flex", alignItems: "end" }}>
        <h3 className="text-primary">
          <b style={themecolor && { color: themecolor }}>Transaction Table</b>
        </h3>
        {filterKey(filterData).length > 0 ? (
          <div
            style={{ marginLeft: "auto", display: "flex", alignItems: "end" }}
          >
            {width > 786 ? (
              <h3 style={{ fontSize: "16px", marginBottom: "9px" }}>
                No Of Filter Applied : {filterKey(filterData).length}
              </h3>
            ) : null}

            <Button
              className="add-new-user "
              color="link"
              onClick={handleClear}
              style={themecolor && { color: themecolor }}
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
                  backgroundColor: themecolor ? themecolor : "#CF509B",
                  color: "white",
                }
              : {
                  width: "60px",
                  marginLeft:
                    Object.keys(filterData).length > 0 ? "10px" : "auto",
                  backgroundColor: themecolor ? themecolor : "#CF509B",
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
          {width <= 768 &&
            !filterToggleMode &&
            clientsTransactions?.data?.length > 0 && (
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
                      style={{ borderRadius: "0.5rem " }}
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
              <Loader loading={loading} />
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
                progressPending={loading || isLoading}
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
                data={clientsTransactions?.results}
                subHeaderComponent={
                  <DatePicker
                    state={state}
                    setState={setState}
                    setFilterData={setFilterData}
                    handleClear={handleClear}
                  />
                }
              />
            </div>
          </Card>
        </Col>
      </Row>
      {download && (
        <InvoiceDownload setdownload={setdownload} details={agency} />
      )}
    </>
  );
};

export default TransactionTable;
