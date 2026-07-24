import React from "react";
import { useSelector } from "react-redux";
import { Button, CardBody, Col, Input, Label, Row } from "reactstrap";

const SuperAdminProfileDetails = () => {
//   const themecolor = "#323D76";

  const user = useSelector((state) => state?.auth?.user);

  return (
    <CardBody className="py-2 my-25">
   
      <Row className="gy-1 pt-75">
        <Col lg={6} xs={12} xl={6}>
          <div>
            <Label id="name">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              className="w-100"
              type="text"
              value={user?.name}
              disabled
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={6}>
          <div>
            <Label id="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              className="w-100"
              type="text"
              value={user?.email}
              disabled
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={6}>
          <div>
            <Label id="mobile">
              Mobile
            </Label>
            <Input
              id="mobile"
              name="mobile"
              className="w-100"
              type="text"
              value={user?.mobile}
              disabled
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={6}>
          <div>
            <Label id="role">
              Role
            </Label>
            <Input
              id="role"
              name="role"
              className="w-100"
              type="text"
              value={user?.role?.name}
              disabled
            />
          </div>
        </Col>
      </Row>
    </CardBody>
  );
};

export default SuperAdminProfileDetails;
