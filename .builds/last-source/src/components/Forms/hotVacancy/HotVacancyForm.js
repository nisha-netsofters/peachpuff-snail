import React from "react";
import InputPasswordToggle from "@components/input-password-toggle";
import Select from "react-select";
import { Row, Col, Input, Label } from "reactstrap";
import moment from "moment/moment";

const HotVacancyForm = ({ user }) => {
  return (
    <>
      <Row className="gy-1 pt-75 mt-75">
        <div>
          <h4>Company Details</h4>
        </div>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="healthPolicy">company Name</Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={user?.clients?.companyName}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="pf_esic">Company Owner</Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={user?.clients?.companyowner}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="companyemail">Email</Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={user?.clients?.email}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="PL_SL_CL">Mobile</Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={user?.clients?.mobile}
            />
          </div>
        </Col>
      </Row>
      <Row className="gy-1 pt-75 mt-75">
        <div>
          <h4>Job Description</h4>
        </div>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label>Industries </Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={user?.industries?.industryCategory}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="jobCategoryId">jobCategory</Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={user?.jobCategory?.jobCategory}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="numberOfVacancy">
              No. of Vacancy<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={user?.numberOfVacancy}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="noOfVacancy">
              Job Time Start <span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={moment(user?.jobStartTime).format("h:mmA")}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="noOfVacancy">
              Job Time End <span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={moment(user?.jobEndTime).format("h:mmA")}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label for="role-select">Sunday</Label>
          <Input
            disabled={true}
            id="numberOfVacancy"
            name="numberOfVacancy"
            className="w-100"
            type="text"
            maxLength={6}
            value={user?.sunday}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="experience">
              Min. Experience (In Years)
              <span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={user?.minExperienceYears}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label for="role-select">
            Gender<span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            disabled={true}
            id="numberOfVacancy"
            name="numberOfVacancy"
            className="w-100"
            type="text"
            maxLength={6}
            value={user?.gender}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label for="workType">
            Work<span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            disabled={true}
            id="numberOfVacancy"
            name="numberOfVacancy"
            className="w-100"
            type="text"
            maxLength={6}
            value={user?.workType}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="qualification">
            Qualification<span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            disabled={true}
            id="numberOfVacancy"
            name="numberOfVacancy"
            className="w-100"
            type="text"
            maxLength={6}
            value={user?.qualification}
          />
        </Col>

        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label>Education</Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={user?.field}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label>Course</Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={user?.course}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="designation">Designation</Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={user?.designation}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="salaryRangeStart">
            Salary Range Start<span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            disabled={true}
            id="numberOfVacancy"
            name="numberOfVacancy"
            className="w-100"
            type="text"
            maxLength={6}
            value={user?.salaryRangeStart}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label id="salaryRangeStart">
            Salary Range End<span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            disabled={true}
            id="numberOfVacancy"
            name="numberOfVacancy"
            className="w-100"
            type="text"
            maxLength={6}
            value={user?.salaryRangeEnd}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <Label for="role-select">
            Negotiable<span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            disabled={true}
            id="numberOfVacancy"
            name="numberOfVacancy"
            className="w-100"
            type="text"
            maxLength={6}
            value={user?.negotiable}
          />
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="jobLocation">
              Job Location (Full Address)
              <span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={user?.jobLocation}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="basicSkill">
              Basic Skills<span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={user?.basicSkill}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="keyRole">
              Key Role and Responsibilities
              <span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={user?.keyRole}
            />
          </div>
        </Col>
      </Row>
      <Row className="gy-1 pt-75 mt-75">
        <div>
          <h4>If Any Benefits From Company For Employees </h4>
        </div>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="workingDays">Working Days</Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={user?.workingDays}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="PL_SL_CL">PL/SL/CL (Paid/Sick/Casual leave)</Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={user?.plSlCl}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="healthPolicy">Health Policy</Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={user?.healthPolicy}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="pf_esic">PF/ESIC</Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={user?.pfEsic}
            />
          </div>
        </Col>
        <Col lg={6} xs={12} xl={4}>
          <div>
            <Label id="other">Other</Label>
            <Input
              disabled={true}
              id="numberOfVacancy"
              name="numberOfVacancy"
              className="w-100"
              type="text"
              maxLength={6}
              value={user?.other}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default HotVacancyForm;
