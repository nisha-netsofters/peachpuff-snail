import React, { Fragment } from "react";
import { Card, CardHeader, CardTitle } from "reactstrap";
import SuperAdminProfileDetails from "./SuperAdminProfileDetails";

const SuperAdminProfile = () => {
  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4"> Profile Details</CardTitle>
        </CardHeader>
        <SuperAdminProfileDetails />
      </Card>
    </Fragment>
  );
};

export default SuperAdminProfile;
