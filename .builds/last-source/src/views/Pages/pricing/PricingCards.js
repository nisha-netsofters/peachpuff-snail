/*eslint-disable */
import classnames from "classnames";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
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
import qrCode from "../../../assets/images/code.jpeg";
import { useSelector } from "react-redux";
// import { createPayment } from "../../../apis/payment";

const PricingCards = ({
  data,
  bordered,
  fullWidth,
  plan_feature_id,
  planId,
  // createOrderInstance = () => {},
}) => {
  console.log('---------------------');
  console.log('data =>', data);
  console.log('---------------------');
  const colsProps = { md: 3, xs: 12 };
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const [disabledIndexes, setDisabledIndexes] = useState([]);
  console.log('---------------------');
  console.log('disabledIndexes =>', disabledIndexes);
  console.log('---------------------');
  const [isOpenPaymentQR, setIsOpenPaymentQR] = useState(false);

  useEffect(() => {
    const newDisabledIndexes = data?.reduce((indexes, item, index) => {
      if (item?.id === planId) {
        indexes = Array.from({ length: index + 1 }, (_, i) => {
          return i == 0 ? 1 : i;
        });
      }
      return indexes;
    }, []);
    setDisabledIndexes(newDisabledIndexes);
  }, [data, planId]);
  
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
                      style={{ color: themecolor }}
                    >
                      ₹
                    </sup>
                    <span
                      className={`pricing-${item?.title?.toLowerCase()}-value fw-bolder `}
                      style={{ color: themecolor }}
                    >
                      {item?.price}
                    </span>
                  </div>
                </div>
                <div>
                  <Button
                    onClick={async () => {
                      //  createOrderInstance(item)
                      item?.planName == "Enterprises" ||
                      item?.planName == "Professionals"
                        ? history.push(`/${slug}/payment/create/${item?.id}`)
                        : null;
                      // let resp = await createPayment(item);
                      // window.open(resp?.data);
                      // setIsOpenPaymentQR(true);
                    }}
                    block
                    disabled={disabledIndexes.includes(index)}
                    outline={item?.planName !== "Enterprises"}
                    color={
                      item?.plan_feature_id === plan_feature_id
                        ? "success"
                        : "default"
                    }
                    style={{ backgroundColor: themecolor, color: "white" }}
                  >
                    {item?.plan_feature_id === plan_feature_id
                      ? "Your current plan"
                      : "Subscribe Now"}
                  </Button>
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
      <Modal
        isOpen={isOpenPaymentQR}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          toggle={() => {
            setIsOpenPaymentQR(false);
          }}
          className="bg-transparent"
        ></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <div className="overflow-hidden d-flex justify-content-center">
            <img
              src={qrCode}
              alt="QR code"
              style={{ maxWidth: "500px", width: "100%" }}
            />
          </div>
          <div style={{ marginTop: "20px", color: "red" }}>
            <p>
              Note: Please share your payment screenshot on +91-9974877260
              number after payment successful. Your plan will be activated in 24
              hours after receiving your payment. Thanks.
            </p>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default PricingCards;
