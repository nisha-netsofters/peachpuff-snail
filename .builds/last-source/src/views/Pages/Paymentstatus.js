import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import actions from "../../redux/payment/actions";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { ImCross } from "react-icons/im";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { Spinner } from "reactstrap";

function Paymentstatus() {
  const dispatch = useDispatch();
  const params = useParams();
  useEffect(() => {
    dispatch({
      type: actions.PAYMENT_SET_STATE,
      payload: { paymentstatus: null },
    });
    dispatch({
      type: actions.PAYMENT_STATUS,
      payload: { transactionId: params?.merchantTransactionid },
    });
  }, [dispatch, params?.merchantTransactionid]);
  const details = useSelector((state) => state?.payment?.paymentstatus?.data);
  const isLoading = useSelector((state) => state?.payment?.isLoading);
  const isSuccess = details?.code === "PAYMENT_SUCCESS";
  const transactionId =
    details?.transactionId ||
    details?.merchantOrderId ||
    details?.merchantTransactionId ||
    params?.merchantTransactionid;
  const slug = localStorage.getItem("slug");
  const history = useHistory();
  return (
    <>
      <div
        style={{
          backgroundColor: "#f7fafc",
          marginTop: "5rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "24px",
            margin: "0 auto",
            maxWidth: "768px",
            borderRadius: "2rem",
            boxShadow: " rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
            textAlign: "center",
          }}
        >
          {isLoading || !details ? (
            <div style={{ padding: "2rem 0" }}>
              <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
              <p style={{ color: "#4b5563", marginTop: "16px" }}>
                Verifying your payment...
              </p>
            </div>
          ) : isSuccess ? (
            <>
              <svg
                viewBox="0 0 24 24"
                style={{
                  color: "green",
                  fill: "#34d399",
                  width: "64px",
                  height: "70px",
                  margin: "0 auto 24px",
                  display: "block",
                }}
              >
                <path
                  fill="currentColor"
                  d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                ></path>
              </svg>
              <div style={{ textAlign: "center" }}>
                <h3
                  style={{
                    fontSize: "24px",
                    color: "#1f2937",
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  Payment Done!
                </h3>
                <p style={{ color: "#4b5563", marginTop: "8px" }}>
                  {`transactionId: ${transactionId}`}
                </p>
                <p style={{ color: "#4b5563", marginTop: "8px" }}>
                  Thank you for completing your secure online payment.
                </p>
                <div>
                  <p
                    onClick={() =>
                      history.push(
                        `/${slug}/payment/preview/${params?.merchantTransactionid}`
                      )
                    }
                    style={{
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    View receipt
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  marginBottom: "2rem",
                }}
              >
                <ImCross
                  style={{
                    backgroundColor: "red",
                    borderRadius: "3rem",
                    padding: "8px",
                    fontSize: "4rem",
                    color: "white",
                  }}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <h3
                  style={{
                    fontSize: "24px",
                    color: "#1f2937",
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  Payment failed!
                </h3>
                <p style={{ color: "#4b5563", marginTop: "8px" }}>
                  Your Payment was not Completed.
                </p>
              </div>
            </>
          )}

          <div style={{ textAlign: "center" }}>
            <div style={{ paddingTop: "20px", textAlign: "center" }}>
              <a
                onClick={() => history.push(`/${slug}/pricing`)}
                style={{
                  backgroundColor: "#4f46e5",
                  color: "#ffffff",
                  fontWeight: "600",
                  padding: "12px 24px",
                  borderRadius: "4px",
                  textDecoration: "none",
                }}
              >
                GO BACK
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Paymentstatus;
