import React, { Fragment, useState, useEffect } from "react";
import Select from "react-select";
import Sidebar from "@components/sidebar";
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  CardBody,
  CardTitle,
  CardHeader,
  Button,
} from "reactstrap";

import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useDispatch, useSelector } from "react-redux";
import Scrollbars from "react-custom-scrollbars";
import { selectThemeColors } from "../../../utility/Utils";
import actions from "./../../../redux/feedBack/actions";
import useBreakpoint from "../../../utility/hooks/useBreakpoints";

const initialState = {
  onBoardingId: "",
};

const Filter = ({
  setFilterData,
  setFilterToggleMode,
  handleFilter = () => {},
  toggleSidebar,
  open,
  handleFilterToggleMode = () => {},
  clear,
  setclear = () => {},
}) => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(initialState);
  const onBoardings = useSelector((state) => state.onBoarding.results);
  const [selectCompany, setSelectCompany] = useState();
  const [company, setCompany] = useState();
  const test = [];
  const { width } = useBreakpoint();
  useEffect(() => {
    if (onBoardings !== undefined) {
      onBoardings.filter((item) => {
        test.push({
          value: item.id,
          id: "onBoardingId",
          label: item.companyName,
        });
      });
    }
    setCompany(test);
  }, [onBoardings]);

  const handleFilterData = async () => {
    const filterdata = {};
    for (const key in filter) {
      if (filter[key].length > 0) {
        filterdata[key] = filter[key];
      }
    }
    if (selectCompany?.value) {
      filterdata.onBoardingId = selectCompany?.value;
    }
    handleFilter(filterdata);
    handleFilterToggleMode(false);
  };

  const handleClear = async () => {
    setSelectCompany({ value: "", label: "Select Company" });
    setFilter(initialState);
    await dispatch({
      type: actions.GET_FEEDBACK,
      payload: {
        filterData: [],
        page: 1,
        perPage: 10,
      },
    });
    setFilterData([]);
    handleFilterToggleMode(false);
    setclear(false);
  };
  useEffect(() => {
    if (clear == true) {
      handleClear();
    }
  }, [clear]);
  useEffect(() => {
    const keyDownHandler = async (event) => {
      if (event.key === "Escape") {
        setFilterToggleMode(false);
      }
      if (event.key === "Enter") {
        document.getElementById("handleFilterData")?.click();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  return (
    <>
      <Sidebar
        size="lg"
        open={open}
        title={
          <>
            <div>
              Filter
              <Button
                id="handleFilterData"
                className="add-new-user"
                color="link"
                onClick={handleFilterData}
                style={
                  width < 576
                    ? { marginLeft: "12px", color: themecolor }
                    : { marginLeft: "140px", color: themecolor }
                }
              >
                Search
              </Button>
              <Button
                className="add-new-user "
                color="link"
                onClick={handleClear}
                style={{ color: themecolor }}
              >
                Clear
              </Button>
            </div>
          </>
        }
        headerClassName="mb-1"
        contentClassName="pt-0"
        toggleSidebar={toggleSidebar}
        // onClosed={handleFilterToggleMode(false)}
      >
        <Fragment>
          <Row noGutters>
            <Col md="12" className="mt-1">
              <Label id="companyName">Company Name</Label>
              <Select
                menuPlacement="auto"
                id="gender"
                value={selectCompany}
                placeholder="Select Company"
                options={company}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(e) => {
                  setSelectCompany(e);
                }}
              />
            </Col>
          </Row>
        </Fragment>
      </Sidebar>
    </>
  );
};

export default Filter;
