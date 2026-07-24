import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import actions from "../../redux/payment/actions";
import { Button } from "reactstrap";

const Paymentpreiview = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const details = useSelector(
    (state) => state?.payment?.paymentDetails?.response
  );
  let invoiceto = "";
  if (
    details?.Company !== null &&
    details?.Company !== "" &&
    details?.Company !== "null" &&
    details?.Company !== undefined
  ) {
    invoiceto = details?.Company;
  } else {
    invoiceto = `${
      details?.firstname && details?.firstname != null
        ? details?.firstname
        : null
    } ${
      details?.lastname && details?.lastname != null ? details?.lastname : null
    }`;
  }
  const slug = localStorage.getItem("slug");
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      await dispatch({
        type: actions.GET_PAYMENTS_DETAILS,
        payload: { transactionId: params?.merchantTransactionid },
      });
    };
    fetchPaymentDetails();
  }, []);
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  return (
    <>
      <div className="d-flex gap-3">
        <div
          style={{
            marginTop: "0.5rem",
          }}
        >
          <p
            onClick={() => history.push(`/${slug}/pricing`)}
            style={{
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Go back
          </p>
        </div>
      </div>
      <div
        style={{
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "3rem",
            top: "1rem",
            zIndex: "99999999999",
          }}
        >
          <h3
            style={{
              textAlign: "right",
            }}
            className="invoice-title"
          >
            <b>Invoice</b>
          </h3>
          <p
            style={{
              textAlign: "right",
              marginBottom: "0",
            }}
            className="invoice-title"
          >
            Invoice no:<b> {`# ${details?.invoicenumber}`}</b>
          </p>
          <div className="invoice-date-wrapper d-flex gap-1">
            <p className="invoice-date-title">Date Issued:</p>
            <p className="invoice-date">{details?.createdAt?.slice(0, 10)}</p>
          </div>
        </div>
        <div className="content-wrapper p-0 animate__animated animate__fadeIn">
          <div className="invoice-preview-wrapper">
            <div className="invoice-preview row">
              <div className="col-sm-12 col-md-12 col-xl-12">
                <div className="invoice-preview-card card">
                  <div className="invoice-padding pb-0 card-body">
                    <div className="d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0">
                      <div>
                        <p className="mb-25 card-text mt-5"> </p>
                        <h4 className="invoice-title">From:</h4>
                        <p className="mb-25 card-text">Unique World</p>
                        <p className="mb-25 card-text">
                          335-336, Fortune High Street, <br /> Green City Road,
                          <br /> Near Madhuvan Circle, <br />
                          Adajan, Surat - 395009
                        </p>
                        <p className="mb-25 card-text">
                          GST No: 24AMVPG6524E1Z0
                        </p>
                      </div>
                    </div>
                  </div>
                  <hr className="invoice-spacing" />
                  <div className="d-flex justify-content-between px-2">
                    <div>
                      <div className="d-flex justify-content-between flex-md-row flex-column invoice-spacing mb-2">
                        <div>
                          <h4 className="invoice-title">To:</h4>
                          <p className="mb-25 card-text">{invoiceto}</p>
                          <p class="mb-25 card-text">
                            {details?.gst !== "" &&
                            details?.gst !== null &&
                            details?.gst !== undefined
                              ? `GST No: ${details?.gst}`
                              : null}
                          </p>

                          <p className="mb-25 card-text">
                            State: {details?.state}
                          </p>
                          <p className="mb-25 card-text">
                            City: {details?.city}
                          </p>
                          <p className="mb-25 card-text">
                            Address: {details?.address}
                          </p>
                          <p className="mb-25 card-text">
                            pincode: {details?.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="d-flex justify-content-between flex-md-row flex-column invoice-spacing mb-2">
                        <div>
                          <h4 className="invoice-title">Payment Details:</h4>
                          <p className="mb-25 card-text">
                            Payment state:
                            <span
                              style={
                                details?.servertoserverRes?.state == "COMPLETED"
                                  ? {
                                      color: "green",
                                      fontWeight: "bold",
                                    }
                                  : { color: "red" }
                              }
                            >
                              {details?.servertoserverRes?.state}
                            </span>
                          </p>
                          <p className="mb-25 card-text">
                            Type:{" "}
                            {
                              details?.servertoserverRes?.paymentInstrument
                                ?.type
                            }
                          </p>
                          <p className="mb-25 card-text">
                            MerchantTransactionId: <br />
                            {details?.servertoserverRes?.merchantTransactionId}
                          </p>
                          <p className="mb-25 card-text">
                            TransactionId: <br />
                            {details?.servertoserverRes?.transactionId}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="py-1">Plan Name</th>
                          <th className="py-1">Price</th>
                          <th className="py-1">Tax</th>
                          <th className="py-1">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-1">
                            <b className="card-text fw-bold mb-25">
                              {details?.plans?.planName}
                            </b>
                          </td>
                          <td className="py-1">
                            <span className="fw-bold">{`₹ ${details?.plans?.price}`}</span>
                          </td>
                          <td className="py-1">
                            <span className="fw-bold">{`${details?.tax} %`}</span>
                          </td>
                          <td className="py-1">
                            <span className="fw-bold">{`₹ ${details?.TotalAmount}`}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          onClick={() =>
            history.push(`/${slug}/invoice/${params?.merchantTransactionid}`)
          }
          style={{
            padding: "10px",
            backgroundColor: themecolor,
            color: "white",
          }}
          color="default"
        >
          Download Invoice
        </Button>
      </div>
    </>
  );
};

export default Paymentpreiview;
