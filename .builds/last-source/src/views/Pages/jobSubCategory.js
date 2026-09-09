import DataTable from "react-data-table-component";
import { Edit, Trash, UserPlus } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import JobSubCateDialog from "../../components/Dialog/JobSubCate";
import jobSubCatActions from "../../redux/jobSubCategory/actions";
import jobCatActions from "../../redux/jobCategory/actions";
import { tostify } from "../../components/Tostify";
import Loader from "../../components/Dialog/Loader";
import "@styles/react/libs/tables/react-dataTable-component.scss";

const JobSubCategory = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const jobSubCategory = useSelector((state) => state.jobSubCategory);
  const jobCategory = useSelector((state) => state.jobCategory);

  const [show, setShow] = useState(false);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobSubCat, setJobSubCat] = useState({});
  const [nameValidation, setNameValidation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const categoryOptions = useMemo(() => {
    const list = jobCategory?.results || [];
    return list.map((c) => ({
      value: c.id,
      label: c.jobCategory,
    }));
  }, [jobCategory?.results]);

  const clearStates = () => {
    setJobSubCat({});
    setCreate(false);
    setUpdate(false);
    setLoading(false);
    setShow(false);
    setNameValidation("");
  };

  const fetchList = (page = currentPage, size = perPage) => {
    setLoading(true);
    dispatch({
      type: jobSubCatActions.GET_JOBSUBCAT,
      payload: { page, perPage: size, filterData: {} },
    });
  };

  useEffect(() => {
    dispatch({ type: jobCatActions.GET_ALL_JOBCAT });
    fetchList(1, perPage);
  }, []);

  useEffect(() => {
    if (jobSubCategory?.results) setLoading(false);
    if (jobSubCategory?.isSuccess) clearStates();
  }, [jobSubCategory]);

  const columns = [
    {
      name: "Action",
      minWidth: "110px",
      cell: (row) => (
        <div className="column-action d-flex align-items-center">
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              setJobSubCat(row);
              setNameValidation(row?.jobSubCategory || "");
              setUpdate(true);
              setShow(true);
            }}
          >
            <Edit size={17} className="mx-1" />
          </span>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              setRowToDelete(row);
              setShowDeleteModal(true);
            }}
          >
            <Trash size={17} className="mx-1" />
          </span>
        </div>
      ),
    },
    {
      name: "Job Category",
      selector: (row) => row?.jobCategory?.jobCategory || "-",
      wrap: true,
    },
    {
      name: "Sub Category",
      selector: (row) => row?.jobSubCategory || "",
      wrap: true,
    },
    {
      name: "Created",
      selector: (row) => row?.createdAt?.slice(0, 10) || "-",
    },
  ];

  const handler = () => {
    if (!jobSubCat?.jobCategoryId) {
      return tostify("Please Select Job Category");
    }
    if (!String(nameValidation || jobSubCat?.jobSubCategory || "").trim()) {
      return tostify("Please Enter Valid Sub Category name");
    }
    setLoading(true);
    if (update) {
      dispatch({
        type: jobSubCatActions.UPDATE_JOBSUBCAT,
        payload: {
          id: jobSubCat.id,
          data: jobSubCat,
          page: currentPage,
          perPage,
        },
      });
    } else if (create) {
      dispatch({
        type: jobSubCatActions.CREATE_JOBSUBCAT,
        payload: { data: jobSubCat, page: currentPage, perPage },
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Job Sub Category</CardTitle>
          {!auth?.user?.clients ? (
            <Button
              color="primary"
              onClick={() => {
                setJobSubCat({});
                setNameValidation("");
                setCreate(true);
                setUpdate(false);
                setShow(true);
              }}
            >
              <UserPlus size={15} />
              <span className="align-middle ms-50">Add Sub Category</span>
            </Button>
          ) : null}
        </CardHeader>
        <CardBody className="pt-1">
          {loading ? <Loader loading={loading} /> : null}
          <DataTable
            noHeader
            pagination
            paginationServer
            columns={columns}
            data={jobSubCategory?.results || []}
            paginationTotalRows={jobSubCategory?.total || 0}
            paginationPerPage={perPage}
            onChangePage={(page) => {
              setCurrentPage(page);
              fetchList(page, perPage);
            }}
            onChangeRowsPerPage={(newPerPage, page) => {
              setPerPage(newPerPage);
              setCurrentPage(page);
              fetchList(page, newPerPage);
            }}
          />
        </CardBody>
      </Card>

      <JobSubCateDialog
        show={show}
        setShow={setShow}
        jobSubCat={jobSubCat}
        setJobSubCat={setJobSubCat}
        categoryOptions={categoryOptions}
        setCreate={setCreate}
        setUpdate={setUpdate}
        setNameValidation={setNameValidation}
        loading={loading}
        handler={handler}
      />

      <Modal isOpen={showDeleteModal} toggle={() => setShowDeleteModal(false)}>
        <ModalHeader toggle={() => setShowDeleteModal(false)}>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          Delete sub category{" "}
          <b>{rowToDelete?.jobSubCategory || ""}</b>?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            color="danger"
            onClick={() => {
              dispatch({
                type: jobSubCatActions.DELETE_JOBSUBCAT,
                payload: {
                  id: rowToDelete?.id,
                  page: currentPage,
                  perPage,
                },
              });
              setShowDeleteModal(false);
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default JobSubCategory;
