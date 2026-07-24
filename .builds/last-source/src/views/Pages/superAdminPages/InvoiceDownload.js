/* eslint-disable */
import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { usePDF, Resolution } from "react-to-pdf";
import moment from "moment/moment";
import converter from "number-to-words";

const InvoiceDownload = ({ setdownload, details }) => {
  const { toPDF, targetRef } = usePDF({
    filename: `Invoice-${details?.invoicenumber}.pdf`,
    resolution: Resolution.HIGH,
  });
  const componentRef = useRef();
  const history = useHistory();

  useEffect(() => {
    if (details) {
      toPDF({
        method: "save",
        resolution: Resolution.HIGH,
        page: {
          format: "letter",
        },
      });
    }
  }, [details]);

  useEffect(() => {
    setTimeout(() => {
      setdownload(false);
    }, 50);
  }, []);

  const fromdate = moment(details?.createdAt).format("DD-MM-YYYY");
  const todate = moment(details?.createdAt)
    .add(details?.plans?.planFeature?.validate_days, "days")
    .format("DD-MM-YYYY");

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
      details?.firstname && details?.firstname !== null
        ? details?.firstname
        : ""
    } ${
      details?.lastname && details?.lastname !== null ? details?.lastname : ""
    }`;
  }
  let withoutTax = Math.round(details?.plans?.price * (details?.tax / 100));

  class ComponentToPrint extends React.Component {
    render() {
      return (
        <div
          style={{
            width: "800px",
            height: "1100px",
            margin: "2rem auto",
            padding: "2rem",
            border: "1px solid #ddd",
            backgroundColor: "#fff",
            fontWeight: "normal",
            color: "#000",
            fontSize: "12px",
            fontFamily: "Times New Roman, sans-serif",
          }}
          ref={targetRef}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ position: "relative" }}>
              <h2>Uniqueworld</h2>
              <p>
                335-336, Fortune High Street,
                <br /> Green City Road,
                <br /> Near Madhuvan Circle Adajan, Surat - 395009 <br />
                GST No.: 24AMVPG6524E1Z0 <br />
              </p>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <h2>Tax Invoice</h2>
          </div>
          <hr style={{ borderBottom: "0.5px solid #000" }} />
          <div style={{ display: "flex" }}>
            <div
              style={{
                width: "50%",
                borderRight: "0.5px solid black",
              }}
            >
              <h3>Addressed To :</h3>
              <p>
                {invoiceto} <br />
                {details?.address} <br />
                {`${details?.city}, ${details?.state}`} <br />
                {details?.gst && <p>GST No: {details?.gst}</p>}
              </p>
            </div>
            <div
              style={{
                marginLeft: "2rem",
              }}
            >
              <p>
                <strong>Invoice No. :</strong> {details?.invoicenumber}
                <br />
                <strong>Invoice Date:</strong>{" "}
                {details?.createdAt?.slice(0, 10)}
              </p>
            </div>
          </div>
          {/* <hr style={{ borderBottom: "0.5px solid #000" }} /> */}
          <div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "2rem",
                marginTop: "1rem",
              }}
            >
              <thead
                style={{
                  backgroundColor: "lightgray",
                }}
              >
                <tr>
                  <th style={{ border: "1px solid #000", padding: "0.5rem" }}>
                    Description
                  </th>
                  <th style={{ border: "1px solid #000", padding: "0.5rem" }}>
                    HSN Code
                  </th>
                  <th style={{ border: "1px solid #000", padding: "0.5rem" }}>
                    Rate
                  </th>
                  <th style={{ border: "1px solid #000", padding: "0.5rem" }}>
                    GST({`${details?.tax}%`})
                  </th>
                  <th style={{ border: "1px solid #000", padding: "0.5rem" }}>
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: "1px solid #000", padding: "0.5rem" }}>
                    {/* {`₹ ${details?.plans?.price} | ${details?.plans?.planName}`} */}
                    {`${details?.plans?.planName}`}
                    <br />
                    {`${fromdate} to ${todate}`}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "0.5rem" }}>
                    000001
                  </td>
                  <td style={{ border: "1px solid #000", padding: "0.5rem" }}>
                    {`₹ ${details?.plans?.price}`}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "0.5rem" }}>
                    {`₹ ${withoutTax}`}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "0.5rem" }}>
                    {`₹ ${details?.TotalAmount}`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* <hr style={{ border: "1px solid #000" }} /> */}
          <div
            style={{
              display: "flex",
            }}
          >
            <div
              style={{
                width: "50%",
              }}
            >
              <p>
                Payment status : {details?.servertoserverRes?.state}
                <br />
                Type: {details?.servertoserverRes?.paymentInstrument?.type}
                <br />
                TransactionId : {details?.servertoserverRes?.transactionId}
              </p>
            </div>
            <div style={{ width: "50%", textAlign: "right" }}>
              <p>
                <strong>Total amount payable:</strong>{" "}
                {`₹ ${details?.TotalAmount}`}
              </p>
              <p>
                <strong>Amount in words:</strong>{" "}
                {`${
                  details?.TotalAmount &&
                  converter?.toWords(details?.TotalAmount)
                }`}
              </p>
            </div>
          </div>
          <hr style={{ borderBottom: "0.5px solid #000" }} />
          {/* <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "2rem",
            }}
          >
            <div style={{ width: "50%" }}>
              <p>
                <strong>Sub total:</strong> ₹ {details?.plans?.price}
              </p>
              <p>
                <strong>GST ({details?.tax}%):</strong> ₹ {withoutTax}
              </p>
            </div>
            <div style={{ width: "50%", textAlign: "right" }}>
              <p>
                <strong>Total amount payable:</strong>{" "}
                {`₹ ${details?.TotalAmount}`}
              </p>
              <p>
                <strong>Amount in words:</strong>{" "}
                {`${
                  details?.TotalAmount &&
                  converter?.toWords(details?.TotalAmount)
                }`}
              </p>
            </div>
          </div>
          <hr style={{ borderBottom: "0.5px solid #000" }} /> */}
          <div>
            <p>
              <strong>Thanks for your Business</strong>
            </p>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <ComponentToPrint ref={componentRef} />
    </>
  );
};

export default InvoiceDownload;
