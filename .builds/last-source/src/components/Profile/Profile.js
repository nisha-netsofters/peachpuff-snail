// ** React Imports
import { Fragment, useState, useEffect } from "react";
import "cleave.js/dist/addons/cleave-phone.us";
import {
  Row,
  Col,
  Form,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  FormFeedback,
  Alert,
  Progress,
  TabContent,
  TabPane,
} from "reactstrap";
// import { useSelector } from 'react-redux'
import ProfileTabs from "./ProfileTabs";
import ProfileDetails from "./ProfileDetalis";
import AgencyDetails from "./AgencyDetails";
import { useSelector, useDispatch } from "react-redux";
import ApplyLink from "./ApplyLink";
import WhatsApp from "./WhatsApp";
import Billingaddress from "./Billingaddress";
import CandidateProfessionalProfile from "./CandidateProfessionalProfile";
import candidateActions from "../../redux/candidate/actions";
// import userActions from "../../redux/user/actions";
const AccountTabs = () => {
  // const role = useSelector(state => state.role)
  const auth = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab) => {
    setActiveTab(tab);
  };
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );

  // Fetch candidate profile when user is a Candidate
  useEffect(() => {
    if (auth?.user?.role?.name === "Candidate") {
      dispatch({
        type: candidateActions.GET_CANDIDATE_PROFILE,
      });
    }
  }, [auth?.user?.role?.name, dispatch]);

  return (
    <>
      {auth?.user?.role?.name === "Admin" ? (
        <>
          <Fragment>
            <Card>
              <CardHeader
                className="border-bottom"
                style={{ paddingBottom: "0px" }}
              >
                <CardTitle tag="h4">
                  {" "}
                  <Row>
                    <Col xs={12}>
                      <ProfileTabs
                        className="mb-2"
                        activeTab={activeTab}
                        toggleTab={toggleTab}
                        themecolor={themecolor}
                      />

                      <TabContent activeTab={activeTab}>
                        <TabPane tabId="1"></TabPane>
                        <TabPane tabId="2"></TabPane>
                        <TabPane tabId="3"></TabPane>
                        <TabPane tabId="4"></TabPane>
                      </TabContent>
                    </Col>
                  </Row>
                </CardTitle>
              </CardHeader>
              {activeTab == "1" && <ProfileDetails />}
              {activeTab == "2" && <AgencyDetails />}
              {activeTab == "3" && <WhatsApp />}
              {activeTab == "4" && <Billingaddress />}
            </Card>
          </Fragment>
          <Fragment>
            <Card>
              <ApplyLink />
            </Card>
          </Fragment>
        </>
      ) : (
        <Fragment>
          {/* Primary profile details card */}
          <Card>
            <CardHeader className="border-bottom d-flex justify-content-between">
              <CardTitle tag="h4">Profile Details</CardTitle>
              {auth?.user?.role?.name !== "Candidate" && (
                <CardTitle tag="h4">Billing Details</CardTitle>
              )}
            </CardHeader>
            <ProfileDetails />
          </Card>

          {/* Separate box/card for Other Details & Professional Information */}
          {auth?.user?.role?.name === "Candidate" && (
            <Card className="mt-2">
              <CandidateProfessionalProfile />
            </Card>
          )}
        </Fragment>
      )}
    </>
  );
};

export default AccountTabs;
