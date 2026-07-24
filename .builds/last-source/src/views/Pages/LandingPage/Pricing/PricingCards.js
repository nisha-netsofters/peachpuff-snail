import classnames from "classnames";

import {
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  Badge,
  ListGroup,
  ListGroupItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
// import style from "../index.module.scss";
// import classNames from "classnames";
const PricingCards = ({
  data,
  bordered,
  fullWidth,

  // createOrderInstance = () => {},
}) => {
  const colsProps = { md: 3, xs: 12 };
  const themecolor = "#ecaa48";
  const currentUrl = window.origin;

  const handleContactUs = () => {
    const newUrl = `${currentUrl}/uniqueworld/client-registration`;
    window.open(newUrl, "_blank");
  };
  const renderPricingCards = () => {
    return data?.map((item, index) => {
      if (item?.planName != "Trial") {
        return (
          <Col key={index} {...colsProps}>
            <Card
              style={{ height: "100%", textTransform: "capitalize" }}
              className={classnames("text-center", {
                border: bordered,
                "shadow-none": bordered,
                popular: item?.popular === true,
                "border-primary": bordered && item?.popular === true,
                [`${item?.title?.toLowerCase()}-pricing`]: item?.title,
              })}
            >
              <CardBody>
                {item?.popular === true ? (
                  <div className="pricing-badge text-end">
                    <Badge color="light-primary" pill>
                      Popular
                    </Badge>
                  </div>
                ) : null}
                {/* <img className={imgClasses} src={item?.img} alt='pricing svg' /> */}
                <h3>{item?.planName}</h3>
                <CardText>{item?.subtitle}</CardText>
                <div className="annual-plan">
                  <div className="plan-price mt-2">
                    <sup
                      className="font-medium-1 fw-bold  me-25"
                      style={{ color: "#843762" }}
                    >
                      ₹
                    </sup>
                    <span
                      className={`pricing-${item?.title?.toLowerCase()}-value fw-bolder `}
                      style={{ color: "#843762" }}
                    >
                      {item?.price}
                    </span>
                  </div>
                </div>
                <div>
                  <Button
                    color="deafult"
                    style={{
                      width: "100%",
                      backgroundColor: themecolor,
                      color: "#000",
                      transition: "background-color 0.3s ease",
                    }}
                    onClick={handleContactUs}
                  >
                    <span style={{ fontWeight: 600 }}>Subscribe Now</span>
                  </Button>
                  {/* <button className={classNames(style["btn-submit"])}>
                    Subscribe Now
                  </button> */}
                </div>
                <ListGroup
                  tag="ul"
                  className="list-group-circle text-start mt-2"
                >
                  {item?.planFeature?.interview_count !== undefined ? (
                    <ListGroupItem tag="li">
                      Unlimited Interview Request*
                    </ListGroupItem>
                  ) : null}
                  {item?.planFeature?.validate_days !== null ? (
                    <ListGroupItem tag="li">
                      Validate for {item?.planFeature?.validate_days} days
                    </ListGroupItem>
                  ) : null}
                  {item?.planFeature?.upgrade_profile_top ? (
                    <ListGroupItem tag="li">
                      New Upgrade Profile Shown on Top Priority
                    </ListGroupItem>
                  ) : null}
                  {item?.planFeature?.export_candidate_lists ? (
                    <ListGroupItem tag="li">
                      Downloading with Saved Profile
                    </ListGroupItem>
                  ) : (
                    <ListGroupItem tag="li">
                      5 Downloading with Saved Profile
                    </ListGroupItem>
                  )}
                  {item?.planFeature?.mail_notification ? (
                    <ListGroupItem tag="li">
                      Unlimited New Candidates Response by Mail Notification
                    </ListGroupItem>
                  ) : null}
                  {item?.planFeature?.whatsapp_notification ? (
                    <ListGroupItem tag="li">
                      Unlimited New Candidates Response by WhatsApp Notification
                    </ListGroupItem>
                  ) : null}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
        );
      }
    });
  };

  const defaultCols = {
    sm: { offset: 2, size: 10 },
    lg: { offset: 2, size: 10 },
  };

  return (
    <>
      <Row className="pricing-card">
        <Col
          {...(!fullWidth ? defaultCols : {})}
          className={classnames({ "mx-auto": !fullWidth })}
        >
          <Row>{renderPricingCards()}</Row>
        </Col>
      </Row>
    </>
  );
};

export default PricingCards;
