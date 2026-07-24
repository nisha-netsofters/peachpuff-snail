import React, { useEffect } from "react";
import { Card, Col, Row } from "reactstrap";
// import { documentationImageLink } from '../../configs/config'
import imgboywithskates from "../../assets/images/hrdocs/boyskating.png";
import userActions from "../../redux/user/actions";
import { useDispatch, useSelector } from "react-redux";

const HrDocumantation = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.clients?.id) {
      dispatch({
        type: userActions.GET_LOGIN_USER_DETAIL,
        payload: user?.id,
      });
    }
  }, []);

  return (
    <>
      <Row>
        <Col className="d-flex justify-content-center align-items-top mt-1">
          <div
            style={{
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "2rem",
              }}
            >
              We are launching it soon
            </p>
            <img
              style={{
                height: "40rem",
              }}
              className="img-fluid"
              src={imgboywithskates}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default HrDocumantation;
