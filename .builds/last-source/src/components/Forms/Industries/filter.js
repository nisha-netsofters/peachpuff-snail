import React, { Fragment, useState, useEffect } from "react";
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
import { useDispatch } from "react-redux";
import Scrollbars from "react-custom-scrollbars";
import actions from "../../../redux/industries/actions";
import useBreakpoint from "../../../utility/hooks/useBreakpoints";

const initialState = {
  industryCategory: "",
};

const Filter = ({
  setFilterData,
  setFilterToggleMode,
  toggleSidebar,
  open,
  handleFilterToggleMode = () => {},
  handleFilter = () => {},
  clear,
  setclear = () => {},
}) => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(initialState);
  const { width } = useBreakpoint();
  const handleFilterChange = (id, value) => {
    setFilter({ ...filter, [id]: value });
  };

  const handleFilterData = async () => {
    const filterdata = {};
    for (const key in filter) {
      if (filter[key].length > 0) {
        filterdata[key] = filter[key];
      }
    }
    handleFilter(filterdata);
    handleFilterToggleMode(false);
    // await dispatch({
    //     type: jobCatActions.FILTER_JOBCAT,
    //     payload: filterdata
    // })
  };

  const handleClear = async () => {
    setFilter(initialState);
    // const token = localStorage.getItem('token')
    await dispatch({
      type: actions.GET_INDUSTRIES,
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
                  width < 576 ? { marginLeft: "12px" } : { marginLeft: "140px" }
                }
              >
                Search
              </Button>
              <Button
                className="add-new-user "
                color="link"
                onClick={handleClear}
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
              <Label id="industryCategory">Industries</Label>
              <Input
                id="industryCategory"
                name="industryCategory"
                className="w-100"
                type="text"
                maxLength={200}
                placeholder={"Enter Category Name"}
                value={filter?.industryCategory}
                onChange={(e) =>
                  handleFilterChange(
                    e.target.id,
                    e.target.value.replace(/[^a-z 0-9 "/"]/gi, "")
                  )
                }
              />
            </Col>
          </Row>
        </Fragment>
      </Sidebar>
    </>
  );
};

export default Filter;
