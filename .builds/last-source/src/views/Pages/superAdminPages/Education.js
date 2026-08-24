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
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectThemeColors } from "@utils";
import actions from "../../../redux/education/actions";
import { tostify } from "../../../components/Tostify";
import Loader from "../../../components/Dialog/Loader";
import { QUALIFICATION_HELD_OPTIONS, qualificationLabel } from "../../../utility/qualificationOptions";
import { getEducationsAPI } from "../../../apis/education";
import "@styles/react/libs/tables/react-dataTable-component.scss";

const emptyEducation = { name: "", qualification: "" };
const emptyCourse = {
  name: "",
  educationId: "",
  educationName: "",
  qualification: "",
};

const Education = () => {
  const dispatch = useDispatch();
  const educationState = useSelector((state) => state.education);
  const [activeTab, setActiveTab] = useState("education");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [create, setCreate] = useState(false);
  const [form, setForm] = useState(emptyEducation);
  const [courseForm, setCourseForm] = useState(emptyCourse);
  const [filterData, setFilterData] = useState({});
  const [courseFilterData, setCourseFilterData] = useState({});
  const [filterDraft, setFilterDraft] = useState({ qualification: "", name: "" });
  const [courseFilterDraft, setCourseFilterDraft] = useState({
    qualification: "",
    educationId: "",
    name: "",
  });
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursePerPage, setCoursePerPage] = useState(10);
  const [coursePage, setCoursePage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState("education");
  const [educationDropdown, setEducationDropdown] = useState([]);
  const [filterEducationDropdown, setFilterEducationDropdown] = useState([]);

  const fetchEducation = (page = 1, size = perPage, filter = filterData) => {
    setLoading(true);
    dispatch({
      type: actions.GET_EDUCATIONS,
      payload: { page, perPage: size, filterData: filter },
    });
  };

  const fetchCourses = (
    page = 1,
    size = coursePerPage,
    filter = courseFilterData
  ) => {
    setLoading(true);
    dispatch({
      type: actions.GET_COURSES,
      payload: { page, perPage: size, filterData: filter },
    });
  };

  const mapEducationOptions = (resp) => {
    const list = Array.isArray(resp?.data) ? resp.data : [];
    return list.map((item) => ({
      label: item.name,
      value: item.id,
      qualification: item.qualification,
    }));
  };

  const loadEducationDropdown = async (qualification = "") => {
    const resp = await getEducationsAPI({ qualification });
    setEducationDropdown(mapEducationOptions(resp));
  };

  const loadFilterEducationDropdown = async (qualification = "") => {
    const resp = await getEducationsAPI({ qualification });
    setFilterEducationDropdown(mapEducationOptions(resp));
  };

  useEffect(() => {
    fetchEducation(1, perPage, filterData);
    setCurrentPage(1);
  }, [filterData]);

  useEffect(() => {
    fetchCourses(1, coursePerPage, courseFilterData);
    setCoursePage(1);
  }, [courseFilterData]);

  useEffect(() => {
    loadFilterEducationDropdown(courseFilterDraft.qualification || "");
  }, [courseFilterDraft.qualification]);

  useEffect(() => {
    if (show && activeTab === "course") {
      loadEducationDropdown(courseForm.qualification || "");
    }
  }, [show, activeTab, courseForm.qualification]);

  useEffect(() => {
    setLoading(false);
    if (educationState?.isSuccess || educationState?.courseSuccess) {
      setShow(false);
      setCreate(false);
      setForm(emptyEducation);
      setCourseForm(emptyCourse);
    }
  }, [
    educationState?.results,
    educationState?.courseResults,
    educationState?.isSuccess,
    educationState?.courseSuccess,
  ]);

  const openCreate = () => {
    if (activeTab === "education") {
      setForm(emptyEducation);
    } else {
      setCourseForm(emptyCourse);
    }
    setCreate(true);
    setShow(true);
  };

  const openEditEducation = (row) => {
    setForm({
      id: row.id,
      name: row.name || "",
      qualification: row.qualification || "",
    });
    setCreate(false);
    setShow(true);
  };

  const openEditCourse = (row) => {
    setCourseForm({
      id: row.id,
      name: row.name || "",
      educationId: row.educationId || "",
      educationName: row.educationName || "",
      qualification: row.qualification || "",
    });
    setCreate(false);
    setShow(true);
  };

  const onSubmit = () => {
    if (activeTab === "education") {
      if (!form.qualification) return tostify("Please select Qualification Held");
      if (!form.name || form.name.trim().length < 2)
        return tostify("Please enter Education name");
      setLoading(true);
      dispatch({
        type: create ? actions.CREATE_EDUCATION : actions.UPDATE_EDUCATION,
        payload: create
          ? { data: form, filterData }
          : { id: form.id, data: form, filterData },
      });
      return;
    }
    if (!courseForm.qualification)
      return tostify("Please select Qualification Held");
    if (!courseForm.educationId) return tostify("Please select Education");
    if (!courseForm.name || courseForm.name.trim().length < 2)
      return tostify("Please enter Course name");
    setLoading(true);
    dispatch({
      type: create ? actions.CREATE_COURSE : actions.UPDATE_COURSE,
      payload: create
        ? { data: courseForm, filterData: courseFilterData }
        : { id: courseForm.id, data: courseForm, filterData: courseFilterData },
    });
  };

  const confirmDelete = () => {
    if (!rowToDelete?.id) return;
    setLoading(true);
    if (deleteType === "education") {
      dispatch({
        type: actions.DELETE_EDUCATION,
        payload: { id: rowToDelete.id, filterData },
      });
    } else {
      dispatch({
        type: actions.DELETE_COURSE,
        payload: { id: rowToDelete.id, filterData: courseFilterData },
      });
    }
    setShowDeleteModal(false);
    setRowToDelete(null);
  };

  const educationColumns = [
    {
      name: "Action",
      minWidth: "110px",
      cell: (row) => (
        <div className="column-action d-flex align-items-center">
          <span style={{ cursor: "pointer" }} onClick={() => openEditEducation(row)}>
            <Edit size={17} className="mx-1" />
          </span>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              setDeleteType("education");
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
      name: "Qualification Held",
      selector: (row) => qualificationLabel(row?.qualification),
    },
    { name: "Education", selector: (row) => row?.name || "-" },
  ];

  const courseColumns = [
    {
      name: "Action",
      minWidth: "110px",
      cell: (row) => (
        <div className="column-action d-flex align-items-center">
          <span style={{ cursor: "pointer" }} onClick={() => openEditCourse(row)}>
            <Edit size={17} className="mx-1" />
          </span>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              setDeleteType("course");
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
      name: "Qualification Held",
      selector: (row) => qualificationLabel(row?.qualification),
    },
    { name: "Education", selector: (row) => row?.educationName || "-" },
    { name: "Course", selector: (row) => row?.name || "-" },
  ];

  const themecolor = localStorage.getItem("themecolor") || "#323D76";
  const qualificationValue =
    QUALIFICATION_HELD_OPTIONS.find((o) => o.value === form.qualification) ||
    null;
  const courseQualificationValue =
    QUALIFICATION_HELD_OPTIONS.find(
      (o) => o.value === courseForm.qualification
    ) || null;
  const courseEducationValue =
    educationDropdown.find((o) => o.value === courseForm.educationId) ||
    (courseForm.educationId
      ? { label: courseForm.educationName, value: courseForm.educationId }
      : null);

  return (
    <div>
      <Loader loading={loading} />
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Education & Course</CardTitle>
          <Button color="primary" onClick={openCreate}>
            <UserPlus size={15} />
            <span className="align-middle ms-50">
              {activeTab === "education" ? "Add Education" : "Add Course"}
            </span>
          </Button>
        </CardHeader>
        <CardBody className="pt-1">
          <Nav tabs>
            <NavItem>
              <NavLink
                active={activeTab === "education"}
                onClick={() => setActiveTab("education")}
                style={{ cursor: "pointer" }}
              >
                Education
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab === "course"}
                onClick={() => setActiveTab("course")}
                style={{ cursor: "pointer" }}
              >
                Course
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="education">
              <Row className="mb-1 g-1 mt-1">
                <Col md={3}>
                  <Label>Qualification Held</Label>
                  <Select
                    options={QUALIFICATION_HELD_OPTIONS}
                    value={
                      QUALIFICATION_HELD_OPTIONS.find(
                        (o) => o.value === filterDraft.qualification
                      ) || null
                    }
                    placeholder="All"
                    isClearable
                    className="react-select"
                    classNamePrefix="select"
                    theme={selectThemeColors}
                    onChange={(e) =>
                      setFilterDraft({
                        ...filterDraft,
                        qualification: e?.value || "",
                      })
                    }
                  />
                </Col>
                <Col md={3}>
                  <Label>Education</Label>
                  <Input
                    value={filterDraft.name}
                    placeholder="Filter education"
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
                      setFilterDraft({ qualification: "", name: "" });
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
                  columns={educationColumns}
                  data={educationState?.results || []}
                  paginationTotalRows={educationState?.total || 0}
                  paginationDefaultPage={currentPage}
                  paginationPerPage={perPage}
                  onChangePage={(page) => {
                    setCurrentPage(page);
                    fetchEducation(page, perPage, filterData);
                  }}
                  onChangeRowsPerPage={(newPerPage, page) => {
                    setPerPage(newPerPage);
                    setCurrentPage(page);
                    fetchEducation(page, newPerPage, filterData);
                  }}
                />
              </div>
            </TabPane>

            <TabPane tabId="course">
              <Row className="mb-1 g-1 mt-1">
                <Col md={3}>
                  <Label>Qualification Held</Label>
                  <Select
                    options={QUALIFICATION_HELD_OPTIONS}
                    value={
                      QUALIFICATION_HELD_OPTIONS.find(
                        (o) => o.value === courseFilterDraft.qualification
                      ) || null
                    }
                    placeholder="All"
                    isClearable
                    className="react-select"
                    classNamePrefix="select"
                    theme={selectThemeColors}
                    onChange={(e) =>
                      setCourseFilterDraft({
                        ...courseFilterDraft,
                        qualification: e?.value || "",
                        educationId: "",
                      })
                    }
                  />
                </Col>
                <Col md={3}>
                  <Label>Education</Label>
                  <Select
                    options={filterEducationDropdown}
                    value={
                      filterEducationDropdown.find(
                        (o) => o.value === courseFilterDraft.educationId
                      ) || null
                    }
                    placeholder="All"
                    isClearable
                    className="react-select"
                    classNamePrefix="select"
                    theme={selectThemeColors}
                    onChange={(e) =>
                      setCourseFilterDraft({
                        ...courseFilterDraft,
                        educationId: e?.value || "",
                      })
                    }
                  />
                </Col>
                <Col md={3}>
                  <Label>Course</Label>
                  <Input
                    value={courseFilterDraft.name}
                    placeholder="Filter course"
                    onChange={(e) =>
                      setCourseFilterDraft({
                        ...courseFilterDraft,
                        name: e.target.value,
                      })
                    }
                  />
                </Col>
                <Col md={3} className="d-flex align-items-end gap-1">
                  <Button
                    color="primary"
                    onClick={() => setCourseFilterData({ ...courseFilterDraft })}
                  >
                    Search
                  </Button>
                  <Button
                    outline
                    onClick={() => {
                      setCourseFilterDraft({
                        qualification: "",
                        educationId: "",
                        name: "",
                      });
                      setCourseFilterData({});
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
                  columns={courseColumns}
                  data={educationState?.courseResults || []}
                  paginationTotalRows={educationState?.courseTotal || 0}
                  paginationDefaultPage={coursePage}
                  paginationPerPage={coursePerPage}
                  onChangePage={(page) => {
                    setCoursePage(page);
                    fetchCourses(page, coursePerPage, courseFilterData);
                  }}
                  onChangeRowsPerPage={(newPerPage, page) => {
                    setCoursePerPage(newPerPage);
                    setCoursePage(page);
                    fetchCourses(page, newPerPage, courseFilterData);
                  }}
                />
              </div>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>

      <Modal isOpen={show} toggle={() => setShow(false)} className="modal-dialog-centered">
        <ModalHeader toggle={() => setShow(false)}>
          {activeTab === "education"
            ? create
              ? "Add Education"
              : "Edit Education"
            : create
              ? "Add Course"
              : "Edit Course"}
        </ModalHeader>
        <ModalBody>
          {activeTab === "education" ? (
            <>
              <Label>Qualification Held<span style={{ color: "red" }}>*</span></Label>
              <Select
                options={QUALIFICATION_HELD_OPTIONS}
                value={qualificationValue}
                placeholder="Select Qualification Held"
                className="react-select mb-1"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) =>
                  setForm({ ...form, qualification: e?.value || "" })
                }
              />
              <Label>Education<span style={{ color: "red" }}>*</span></Label>
              <Input
                value={form.name}
                placeholder="e.g. B.Tech/B.E."
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </>
          ) : (
            <>
              <Label>
                Qualification Held<span style={{ color: "red" }}>*</span>
              </Label>
              <Select
                options={QUALIFICATION_HELD_OPTIONS}
                value={courseQualificationValue}
                placeholder="Select Qualification Held"
                className="react-select mb-1"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) =>
                  setCourseForm({
                    ...courseForm,
                    qualification: e?.value || "",
                    educationId: "",
                    educationName: "",
                  })
                }
              />
              <Label>
                Education<span style={{ color: "red" }}>*</span>
              </Label>
              <Select
                options={educationDropdown}
                value={courseEducationValue}
                placeholder={
                  courseForm.qualification
                    ? "Select Education"
                    : "Select Qualification first"
                }
                isDisabled={!courseForm.qualification}
                className="react-select mb-1"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) =>
                  setCourseForm({
                    ...courseForm,
                    educationId: e?.value || "",
                    educationName: e?.label || "",
                  })
                }
              />
              <Label>
                Course<span style={{ color: "red" }}>*</span>
              </Label>
              <Input
                value={courseForm.name}
                placeholder="e.g. Computers"
                onChange={(e) =>
                  setCourseForm({ ...courseForm, name: e.target.value })
                }
              />
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            style={{ backgroundColor: themecolor, border: "none" }}
            onClick={onSubmit}
          >
            {create ? "Save" : "Update"}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={showDeleteModal} toggle={() => setShowDeleteModal(false)}>
        <ModalHeader toggle={() => setShowDeleteModal(false)}>
          Delete {deleteType === "education" ? "Education" : "Course"}?
        </ModalHeader>
        <ModalBody>
          {deleteType === "education"
            ? "This will also hide related courses."
            : "This course will be removed from dropdowns."}
        </ModalBody>
        <ModalFooter>
          <Button outline onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Education;
