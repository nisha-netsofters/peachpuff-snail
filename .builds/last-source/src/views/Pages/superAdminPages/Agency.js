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
  FileText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "react-feather";
import {
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
import CustomHeader from "../../../components/Header/CustomHeader";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { tostify, tostifyInfo } from "../../../components/Tostify";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
// import { uploadFiles } from './../../helper/fileUpload'
import Loader from "./../../../components/Dialog/Loader";
import { toast } from "react-toastify";
import { awsUploadAssetsWithResp } from "../../../helper/awsUploadAssets";
import NewAgency from "../../../components/superAdminComponents/Dialog/agency/NewAgency";
import agencyActions from "../../../redux/agency/actions";
import AgencyFilter from "../../../components/superAdminComponents/Filter/agency/AgencyFilter";
import {
  agencyStatus,
  createAgency,
  deleteAgency,
  updateAgency,
} from "../../../apis/agency";
import { Checkbox } from "antd";
import useBreakpoint from "../../../utility/hooks/useBreakpoints";
import UpdatePlan from "../../../components/superAdminComponents/Dialog/agency/UpdatePlan";

const Agency = () => {
  const dispatch = useDispatch();
  const { width } = useBreakpoint();
  const { allAgency, isLoading } = useSelector((state) => state.agency);
  const [show, setShow] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
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
    allAgency?.results?.map(() => false) ?? []
  );
  const toggle = (index) => {
    const newCollapseStates = [...isOpen];
    newCollapseStates[index] = !newCollapseStates[index];
    setIsOpen(newCollapseStates);
  };
  console.info("----------------------------");
  console.info("showPlan =>", showPlan);
  console.info("----------------------------");
  const clearStates = () => {
    setAgency([]);
    setLoading(false);
    setCreate(false);
    setUpdate(false);
    setShow(false);
  };

  useEffect(() => {
    if (allAgency?.constraint) {
      setLoading(false);
      toast.error("Email is Exist");
    } else if (allAgency?.error) {
      setLoading(false);
      toast.error("Email is Exist");
    } else {
      if (allAgency?.isSuccess) clearStates();
      if (allAgency?.data?.length >= 0) {
        setLoading(false);
        setAgencyList(allAgency?.data || []);
        setTotalRows(allAgency?.total);
      }
    }
  }, [allAgency]);

  const getAgency = async (page) => {
    await dispatch({
      type: agencyActions.GET_AGENCY,
      payload: {
        filterData,
        page,
        perPage,
      },
    });
  };

  useEffect(() => {
    if (!show) setAgency([]);
  }, [show]);

  useEffect(() => {
    getAgency(0);
  }, [filterData]);

  useEffect(() => {
    setTotalRows(allAgency?.total);
  }, [allAgency?.total]);

  const deleteUser = async (row) => {
    if (row?.isDeleted == false || row?.isDeleted == undefined) {
      setLoading(true);
      const resp = await deleteAgency({ id: row.id });
      if (resp) {
        if (resp?.isSuccess) {
          setLoading(false);
          await getAgency(0);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
      // await dispatch({
      //   type: agencyActions.DELETE_AGENCY,
      //   payload: { id: row.id },
      // });
    } else if (row?.isDeleted == true) {
      tostifyInfo("Agency Already Deleted");
    }
  };

  const handleInActiveAgency = async (row) => {
    if (row?.email != "uniqueworldjobs@gmail.com") {
      setLoading(true);
      const resp = await agencyStatus(row || {});
      if (resp) {
        if (resp?.msg == "success") {
          getAgency(0);
        }
        setLoading(false);
      }
    }
  };

  const columns = [
    {
      name: "Action",
      minWidth: "110px",
      cell: (row) => (
        <div div className="column-action d-flex align-items-center">
          {row.fullname}
          <span
            style={
              // row.isDeleted == true
              // ? { pointerEvents: "none", opacity: "0.5" }
              { cursor: "pointer" }
            }
            onClick={() => {
              // if (row.isDeleted != true) {
              setAgency(row);
              setUpdate(true);
              setShow(true);
              // }
            }}
          >
            <Edit size={17} className="mx-1" />
          </span>
          {/* <span
            style={{ cursor: "pointer" }}
            onClick={() => handleDeleteClick(row)}
          >
            <Trash size={17} className="mx-1" />
          </span> */}
        </div>
      ),
    },
    {
      name: "Active",
      minWidth: "150px",
      selector: (row) => (
        <div
          class="form-check form-switch"
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        >
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckChecked"
            // disabled={row?.email == "uniqueworldjobs@gmail.com"}
            // style={{ cursor: "pointer" }}
            value={row.isDeleted == true ? false : true}
            checked={row.isDeleted == true ? false : true}
            // onClick={() => handleInActiveAgency(row)}
          />
          <div style={row.isDeleted == true ? { opacity: "0.5" } : {}}>
            {row.isDeleted
              ? row.isDeleted == true
                ? "InActive"
                : "Active"
              : "Active"}
          </div>
        </div>
      ),
    },
    {
      name: "Create_AT",
      selector: (row) => row?.createdAt?.slice(0, 10),
      conditionalCellStyles: [
        {
          when: (row) => row.isDeleted == true,
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "Expire_AT",
      selector: (row) =>
        row?.exprireDate ? row?.exprireDate?.slice(0, 10) : "-",
      conditionalCellStyles: [
        {
          when: (row) => row.isDeleted == true,
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "Slug",
      selector: (row) => row?.slug,
      conditionalCellStyles: [
        {
          when: (row) => row.isDeleted == true,
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "Agency Code",
      selector: (row) => row?.agencyCode,
      conditionalCellStyles: [
        {
          when: (row) => row.isDeleted == true,
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "Agency Name",
      selector: (row) => row?.name,
      conditionalCellStyles: [
        {
          when: (row) => row.isDeleted == true,
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "Owner Name",
      selector: (row) => row?.ownersName,
      conditionalCellStyles: [
        {
          when: (row) => row.isDeleted == true,
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "Mobile Number",
      selector: (row) => row?.mobileNumber,
      conditionalCellStyles: [
        {
          when: (row) => row.isDeleted == true,
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "Phone Number",
      selector: (row) => row?.phoneNumber,
      conditionalCellStyles: [
        {
          when: (row) => row.isDeleted == true,
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "Email",
      selector: (row) => row?.email,
      conditionalCellStyles: [
        {
          when: (row) => row.isDeleted == true,
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "Address",
      selector: (row) => row?.address,
      conditionalCellStyles: [
        {
          when: (row) => row.isDeleted == true,
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "Country",
      selector: (row) => row?.country,
      conditionalCellStyles: [
        {
          when: (row) => row.isDeleted == true,
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "State",
      selector: (row) => row?.state,
      conditionalCellStyles: [
        {
          when: (row) => row.isDeleted == true,
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "City",
      selector: (row) => row?.city,
      conditionalCellStyles: [
        {
          when: (row) => row.isDeleted == true,
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "Theme Color",
      selector: (row) => (
        <div
          className="rounded-pill text-white"
          style={{ backgroundColor: row?.themecolor, padding: "0.2rem 0.5rem" }}
        >
          {row.themecolor}
        </div>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.isDeleted == true,
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "Whatsapp Number",
      selector: (row) => row?.whatsapp,
      conditionalCellStyles: [
        {
          when: (row) => row.isDeleted == true,
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "GST Number",
      selector: (row) => row?.gstNo,
      conditionalCellStyles: [
        {
          when: (row) => row.isDeleted == true,
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "Pancard Number",
      selector: (row) => row?.pancardNo,
      conditionalCellStyles: [
        {
          when: (row) => row.isDeleted == true,
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "CIN Number",
      selector: (row) => row?.cinNumber,
      conditionalCellStyles: [
        {
          when: (row) => row.isDeleted == true,
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "Uniqueworld",
      selector: (row) => (
        <Checkbox checked={row?.permission?.dataMerge?.uniqueworld} />
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.isDeleted != undefined,
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "All Agency",
      selector: (row) => (
        <Checkbox checked={row?.permission?.dataMerge?.allAgency} />
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.isDeleted != undefined,
          style: {
            opacity: "0.5",
          },
        },
      ],
    },
    {
      name: "Update Validity",
      cell: (row) => (
        <Button
          disabled={row?.interview_request?.isdisabled == true ? true : false}
          onClick={() => {
            setShowPlan(true);
            setAgency(row);
          }}
          style={{
            padding: "10px",
            backgroundColor: "#bc4094",
            color: "white",
          }}
          color="default"
        >
          Upgrade Plan
        </Button>
      ),
    },
  ];

  const agencyCreateHandler = async () => {
    setLoading(true);
    if (agency?.logo) {
      const resp = await awsUploadAssetsWithResp(agency?.logo);
      agency.logo = `${resp.url}`;
    }
    const resp = await createAgency(agency);
    if (resp) {
      if (resp?.isSuccess) {
        setLoading(false);
        await getAgency(0);
        setShow(false);
        setCreate(false);
      } else {
        tostify(resp?.error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
    // await dispatch({
    //   type: agencyActions.CREATE_AGENCY,
    //   payload: agency,
    // });
  };

  const agencyUpdateHandler = async () => {
    setLoading(true);
    if (
      typeof agency?.logo == "object" &&
      agency?.logo != {} &&
      agency?.logo != undefined &&
      agency?.logo != null
    ) {
      const resp = await awsUploadAssetsWithResp(agency?.logo);
      agency.logo = `${resp.url}`;
    }
    const resp = await updateAgency(agency);
    if (resp) {
      if (resp?.isSuccess) {
        setLoading(false);
        await getAgency(0);
        setShow(false);
        setUpdate(false);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
    // await dispatch({
    //   type: agencyActions.UPDATE_AGENCY,
    //   payload: agency,
    // });
  };
  const Validations = async () => {
    const error = false;
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (agency?.length == 0) {
      return tostify("Please Enter Agency Details", error);
    } else if (agency == {}) {
      return tostify("Please Enter Agency Details", error);
    } else if (
      agency?.slug == "" ||
      agency?.slug == null ||
      agency?.slug == undefined
    )
      return tostify("Please Enter Agency Slug", error);
    // else if (
    //   agency?.agencyCode == "" ||
    //   agency?.agencyCode == null ||
    //   agency?.agencyCode == undefined
    // )
    //   return tostify("Please Enter Agency Code", error);
    else if (
      agency?.name == "" ||
      agency?.name == null ||
      agency?.name == undefined ||
      agency?.name.length < 2
    )
      return tostify("Please Enter Agency Name", error);
    else if (
      agency?.ownersName == "" ||
      agency?.ownersName == null ||
      agency?.ownersName == undefined ||
      agency?.ownersName.length < 2
    )
      return tostify("Please Enter Owner Name", error);
    else if (
      agency?.mobileNumber == "" ||
      agency?.mobileNumber == null ||
      agency?.mobileNumber == undefined ||
      agency?.mobileNumber.length !== 10
    )
      return tostify("Please Enter Valid Mobile Number", error);
    // else if (
    //   agency?.phoneNumber == "" ||
    //   agency?.phoneNumber == null ||
    //   agency?.phoneNumber == undefined ||
    //   agency?.phoneNumber.length !== 10
    // )
    //   return tostify("Please Enter Valid Phone Number", error);
    else if (
      agency?.email == "" ||
      agency?.email == null ||
      agency?.email == undefined ||
      regex.test(agency?.email) === false
    )
      return tostify("Please Enter Valid Email", error);
    else if (
      agency?.password == "" ||
      agency?.password == null ||
      agency?.password == undefined ||
      agency?.password.length < 8
    )
      return tostify("Please Enter 8 Character password", error);
    else if (
      agency?.address == "" ||
      agency?.address == null ||
      agency?.address == undefined
    )
      return tostify("Please Enter Valid Address", error);
    else if (
      agency?.country == "" ||
      agency?.country == null ||
      agency?.country == undefined
    )
      return tostify("Please Select Country", error);
    else if (
      agency?.state == "" ||
      agency?.state == null ||
      agency?.state == undefined
    )
      return tostify("Please Select State", error);
    else if (
      agency?.city == "" ||
      agency?.city == null ||
      agency?.city == undefined
    )
      return tostify("Please Select City", error);
    else if (
      agency?.themecolor == "" ||
      agency?.themecolor == null ||
      agency?.themecolor == undefined
    )
      return tostify("Please Select Theme Color", error);
    // else if (
    //   agency?.emailAppPassword == "" ||
    //   agency?.emailAppPassword == null ||
    //   agency?.emailAppPassword == undefined
    // )
    //   return tostify("Please Enter Valid Email App Password", error);
    else if (
      agency?.whatsapp == "" ||
      agency?.whatsapp == null ||
      agency?.whatsapp == undefined
    ) {
      return tostify("Please Enter Valid Whatsapp Number", error);
    } else if (
      agency?.permission?.areas != undefined &&
      agency?.permission?.areas?.length != 0
    ) {
      if (
        agency?.permission?.areas?.length == 0 ||
        agency?.permission?.areas == null ||
        agency?.permission?.areas == undefined
      )
        return tostify("Please Select States Permission", error);
      if (
        agency?.permission?.areas[0]?.cities?.length == 0 ||
        agency?.permission?.areas[0]?.cities == null ||
        agency?.permission?.areas[0]?.cities == undefined
      )
        return tostify("Please Select Valid Cities Permission", error);
    }
    return error;
  };

  const agencyActionHandler = async () => {
    const err = await Validations();
    if (update === true && err === false) {
      await agencyUpdateHandler();
    }
    if (create === true && err === false) {
      await agencyCreateHandler();
    }
  };

  // const handlePageChange = (page) => {
  //     getUser(page);
  // };
  // const handlePerRowsChange = async (newPerPage, page) => {
  //     setLoading(true);
  //     await dispatch({
  //         type: "GET_USER",
  //         payload: {
  //             filterData,
  //             page,
  //             perPage: newPerPage,
  //         },
  //     });
  //     setPerPage(newPerPage);
  //     // setLoading(false)
  // };

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
  const renderStates = (allAgency) => {
    const statesArr = [
      {
        title: "Slug",
        value: allAgency?.slug || "-",
      },
      {
        title: "Agency Code",
        value: allAgency?.agencyCode || "-",
      },
      {
        title: "Agency Name",
        value: allAgency?.name || "-",
      },
      {
        title: "Owner Name",
        value: allAgency?.ownersName || "-",
      },
      {
        title: "Mobile Number",
        value: allAgency?.mobileNumber || "-",
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

  const renderStatesMore = (allAgency) => {
    const statesArr = [
      {
        title: "Phone Number",
        value: allAgency?.phoneNumber || "-",
      },
      {
        title: "Email",
        value: allAgency?.email || "-",
      },
      {
        title: "Address",
        value: allAgency?.address || "-",
      },
      {
        title: "Country",
        value: allAgency?.country || "-",
      },
      {
        title: "State",
        value: allAgency?.state || "-",
      },
      {
        title: "City",
        value: allAgency?.city || "-",
      },
      {
        title: "Whatsapp Number",
        value: allAgency?.whatsapp || "-",
      },
      {
        title: "GST Number",
        value: allAgency?.gstNo || "-",
      },

      {
        title: "Pancard Number",
        value: allAgency?.pancardNo || "-",
      },
      {
        title: "CIN Number",
        value: allAgency?.cinNumber || "-",
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
  const [agencyToDelete, setAgencyToDelete] = useState(null);

  const handleDeleteClick = (result) => {
    setAgencyToDelete(result);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    deleteUser(agencyToDelete);
    setShowDeleteModal(false);
  };

  const totalPages = Math.ceil(allAgency?.total / perPage);
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
    const keys = Object.keys(agencyList);

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
          <b>Agency</b>
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
                onClick={() => downloadCSV(agencyList)}
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
          <AgencyFilter
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
          {allAgency?.data?.length > 0 ? (
            <>
              {allAgency?.data?.map((result, index) => {
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
                          <div
                            className="rounded-pill text-white"
                            style={{
                              backgroundColor: result?.themecolor,
                              padding: "0.2rem 0.5rem",
                              fontSize: "12px",
                            }}
                          >
                            {result.themecolor}
                          </div>
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
                        {result?.jobDescriptionFile && (
                          <div
                            style={{
                              color: "#7F8487",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              window.open(result?.jobDescriptionFile)
                            }
                          >
                            <FileText className="mx-1" size={17} />
                          </div>
                        )}
                      </div>
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
                            onClick={() => {
                              setAgency(result);
                              setUpdate(true);
                              setShow(true);
                            }}
                          >
                            Edit
                          </DropdownItem>
                          {/* <DropdownItem
                            className="w-100"
                            onClick={() => handleDeleteClick(result)}
                          >
                            Delete
                          </DropdownItem> */}
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
                                style={{ color: "#cf509b", cursor: "pointer" }}
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
                                style={{ color: "#cf509b", cursor: "pointer" }}
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
              <CardHeader style={{ padding: "0px", justifyContent: "center" }}>
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
          {width <= 768 && !filterToggleMode && allAgency?.data?.length > 0 && (
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
                // onChangeRowsPerPage={handlePerRowsChange}
                // onChangePage={handlePageChange}
                paginationTotalRows={totalRows}
                paginationServer
                allowRowEvents
                highlightOnHover={true}
                columns={columns}
                className="react-dataTable"
                data={allAgency?.data}
                subHeaderComponent={
                  <CustomHeader
                    setShow={setShow}
                    setCreate={setCreate}
                    store={agencyList}
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
        <ModalBody>Are you sure to delete this Agency?</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={confirmDelete}>
            Yes, Delete
          </Button>
          <Button color="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      {show === true ? (
        <>
          <NewAgency
            loading={loading}
            agency={agency}
            setAgency={setAgency}
            show={show}
            setShow={setShow}
            update={update}
            setUpdate={setUpdate}
            setCreate={setCreate}
            agencyActionHandler={agencyActionHandler}
            getAgency={getAgency}
          />
        </>
      ) : null}
      {showPlan === true ? (
        <>
          <UpdatePlan
            loading={loading}
            agency={agency}
            setAgency={setAgency}
            show={showPlan}
            setShow={setShowPlan}
            update={update}
            setUpdate={setUpdate}
            setCreate={setCreate}
            agencyActionHandler={agencyActionHandler}
            getAgency={getAgency}
          />
        </>
      ) : null}
    </>
  );
};

export default Agency;
