import React from "react";
import { GetQeCode } from "../../apis/profile";
import { Skeleton } from "antd";
import { Card, Col, Row } from "reactstrap";

import imgboywithskates from "../../assets/images/hrdocs/boyskating.png";

const WhatsApp = () => {
  // const [qrImage, setQrImage] = useState("");
  // const [status, setStatus] = useState(null)
  // const [isLoading, setIsLoading] = useState(false)

  // useEffect(() => {
  //   (async () => {
  //       setIsLoading(true)
  //     const resp = await GetQeCode();
  //     if (resp?.data?.info?.isSuccess) {
  //       if (resp?.data?.data?.qr) {
  //         setQrImage(resp?.data?.data?.qr);
  //       }
  //       if (resp?.data?.data?.isConnected != undefined) {
  //           setStatus(resp?.data?.data?.isConnected)
  //       }
  //       setIsLoading(false)
  //     } else {
  //       setIsLoading(false)
  //     }
  //   })();
  // }, []);

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
                height: "35rem",
                margin: "1rem",
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

export default WhatsApp;
