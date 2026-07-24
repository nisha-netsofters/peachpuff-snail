import { Breadcrumb } from "antd";
import React, { useState } from "react";
import Tabs from "../../../components/superAdminComponents/Profile/Tabs";
import { Col, Row, TabContent, TabPane } from "reactstrap";
import SuperAdminProfile from "../../../components/superAdminComponents/Profile/SuperAdminProfile";
import SuperAdminSecurity from "../../../components/superAdminComponents/Profile/SuperAdminSecurity";
export const CustomBreadcrumbItem = ({ title, color, fontWeight }) => (
  <span
    style={{
      fontFamily: "Montserrat, Helvetica, Arial, serif",
      fontWeight: fontWeight,
      color,
    }}
  >
    {title}
  </span>
);

const ProfilePage = () => {
  const themecolor = "#323D76";

  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab) => {
    setActiveTab(tab);
  };
  console.info("--------------------");
  console.info("themecolor => ", themecolor);
  console.info("--------------------");

  return (
    <>
      <div style={{ display: "flex" }}>
        <h2
          style={{
            fontWeight: "500px",
            color: "#636363",
            paddingRight: "1rem",
            // borderRight: "1px solid #d6dce1",
            marginBottom: "1.5rem",
          }}
        >
          Profile
        </h2>
      </div>
      <Row>
        <Col xs={12}>
          <Tabs
            className="mb-2"
            activeTab={activeTab}
            toggleTab={toggleTab}
            themecolor={themecolor}
          />

          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <SuperAdminProfile />
            </TabPane>
            <TabPane tabId="2">
              <SuperAdminSecurity />
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </>
  );
};

export default ProfilePage;
