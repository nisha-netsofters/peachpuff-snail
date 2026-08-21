import DataTable from "react-data-table-component";
import { Edit, Trash, UserPlus } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { City, State } from "country-state-city";
import actions from "../../../redux/areas/actions";
import { tostify } from "../../../components/Tostify";
import AreasDialog from "../../../components/Dialog/AreasDialog";
import Loader from "../../../components/Dialog/Loader";
import "@styles/react/libs/tables/react-dataTable-component.scss";

const emptyForm = { state: "", city: "", name: "" };

const Areas = () => {
  const dispatch = useDispatch();
  const areasState = useSelector((state) => state.areas);
  const [show, setShow] = useState(false);
  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [filterData, setFilterData] = useState({});
  const [filterDraft, setFilterDraft] = useState({
    state: "",
    city: "",
    name: "",
  });
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cities, setCities] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const fetchList = (page = 1, size = perPage, filter = filterData) => {
    setLoading(true);
    dispatch({
      type: actions.GET_AREAS,
      payload: { page, perPage: size, filterData: filter },
    });
  };

  useEffect(() => {
    fetchList(1, perPage, filterData);
    setCurrentPage(1);
  }, [filterData]);

  useEffect(() => {
    setLoading(false);
    if (areasState?.isSuccess) {
      setShow(false);
      setCreate(false);
      setUpdate(false);
      setForm(emptyForm);
      setSelectedState(null);
      setSelectedCity(null);
      setCities([]);
    }
  }, [areasState?.results, areasState?.isSuccess]);

  const openCreate = () => {
    setForm(emptyForm);
    setSelectedState(null);
    setSelectedCity(null);
    setCities([]);
    setCreate(true);
    setUpdate(false);
    setShow(true);
  };

  const openEdit = (row) => {
    setForm({
      id: row.id,
      state: row.state || "",
      city: row.city || "",
      name: row.name || "",
    });
    const st = State.getStatesOfCountry("IN").find(
      (s) => s.name.toLowerCase() === String(row.state || "").toLowerCase()
    );
    if (st) {
      const stateOpt = { ...st, label: st.name, value: st.name };
      setSelectedState(stateOpt);
      const cityList = City.getCitiesOfState("IN", st.isoCode).map((c) => ({
        ...c,
        label: c.name,
        value: c.name,
      }));
      setCities(cityList);
      const ct = cityList.find(
        (c) => c.name.toLowerCase() === String(row.city || "").toLowerCase()
      );
      setSelectedCity(ct || null);
    } else {
      setSelectedState(null);
      setSelectedCity(null);
      setCities([]);
    }
    setUpdate(true);
    setCreate(false);
    setShow(true);
  };

  const onSubmit = () => {
    if (!form.state || form.state.length < 2)
      return tostify("Please select valid State");
    if (!form.city || form.city.length < 2)
      return tostify("Please select valid City");
    if (!form.name || form.name.trim().length < 2)
      return tostify("Please enter valid Area name");

    setLoading(true);
    if (create) {
      dispatch({
        type: actions.CREATE_AREA,
        payload: { data: form, filterData },
      });
    } else if (update) {
      dispatch({
        type: actions.UPDATE_AREA,
        payload: { id: form.id, data: form, filterData },
      });
    }
  };

  const confirmDelete = () => {
    if (!rowToDelete?.id) return;
    setLoading(true);
    dispatch({
      type: actions.DELETE_AREA,
      payload: { id: rowToDelete.id, filterData },
    });
    setShowDeleteModal(false);
    setRowToDelete(null);
  };

  const columns = [
    {
      name: "Action",
      minWidth: "110px",
      cell: (row) => (
        <div className="column-action d-flex align-items-center">
          <span style={{ cursor: "pointer" }} onClick={() => openEdit(row)}>
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
    { name: "State", selector: (row) => row?.state || "-" },
    { name: "City", selector: (row) => row?.city || "-" },
    { name: "Area", selector: (row) => row?.name || "-" },
    {
      name: "Created",
      selector: (row) => row?.createdAt?.slice?.(0, 10) || "-",
    },
  ];

  const themecolor = localStorage.getItem("themecolor") || "#323D76";

  return (
    <div>
      <Loader loading={loading} />
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Areas</CardTitle>
          <div className="d-flex gap-1">
            <Button color="primary" onClick={openCreate}>
              <UserPlus size={15} />
              <span className="align-middle ms-50">Add Area</span>
            </Button>
          </div>
        </CardHeader>
        <CardBody className="pt-1">
          <Row className="mb-1 g-1">
            <Col md={3}>
              <Label>State</Label>
              <Input
                value={filterDraft.state}
                placeholder="Filter state"
                onChange={(e) =>
                  setFilterDraft({ ...filterDraft, state: e.target.value })
                }
              />
            </Col>
            <Col md={3}>
              <Label>City</Label>
              <Input
                value={filterDraft.city}
                placeholder="Filter city"
                onChange={(e) =>
                  setFilterDraft({ ...filterDraft, city: e.target.value })
                }
              />
            </Col>
            <Col md={3}>
              <Label>Area</Label>
              <Input
                value={filterDraft.name}
                placeholder="Filter area"
                onChange={(e) =>
                  setFilterDraft({ ...filterDraft, name: e.target.value })
                }
              />
            </Col>
            <Col md={3} className="d-flex align-items-end gap-1">
              <Button
                color="primary"
                onClick={() => setFilterData({ ...filterDraft })}
              >
                Search
              </Button>
              <Button
                outline
                onClick={() => {
                  setFilterDraft({ state: "", city: "", name: "" });
                  setFilterData({});
                }}
              >
                Clear
              </Button>
            </Col>
          </Row>
          <div className="react-dataTable">
            <DataTable
              noHeader
              pagination
              paginationServer
              columns={columns}
              data={areasState?.results || []}
              paginationTotalRows={areasState?.total || 0}
              paginationDefaultPage={currentPage}
              paginationPerPage={perPage}
              onChangePage={(page) => {
                setCurrentPage(page);
                fetchList(page, perPage, filterData);
              }}
              onChangeRowsPerPage={(newPerPage, page) => {
                setPerPage(newPerPage);
                setCurrentPage(page);
                fetchList(page, newPerPage, filterData);
              }}
            />
          </div>
        </CardBody>
      </Card>

      <AreasDialog
        show={show}
        setShow={setShow}
        loading={loading}
        form={form}
        setForm={setForm}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        cities={cities}
        setCities={setCities}
        onSubmit={onSubmit}
        setCreate={setCreate}
        setUpdate={setUpdate}
      />

      <Modal
        isOpen={showDeleteModal}
        toggle={() => setShowDeleteModal(false)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setShowDeleteModal(false)}>
          Delete Area
        </ModalHeader>
        <ModalBody>
          Delete area <b>{rowToDelete?.name}</b> ({rowToDelete?.city})?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" outline onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button color="danger" style={{ background: themecolor }} onClick={confirmDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Areas;
