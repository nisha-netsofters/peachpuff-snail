/ eslint-disable no-unused-vars /;
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getstatistics } from "../../../apis/statistics/statistics";
// import bgimage from "../../../assets/images/landingpage/clientbg.png";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
const FooterOfClient = () => {
  const [numberofemp, setNumberofemp] = useState(null);
  const role = useSelector((state) => state?.auth?.user?.role?.name);
  const slug = localStorage.getItem("slug");
  useEffect(() => {
    async function fetchData() {
      let numberof = await getstatistics();
      setNumberofemp(numberof);
    }
    if (role === "Client") {
      fetchData();
    }
  }, []);
  const location = useLocation().pathname;
  return role === "Client" ? (
    <>
      {role === "Client" &&
      location !== `/${slug}/documentation` &&
      location !== `/${slug}/pricing` ? (
        <>
          {/* <div>
            <a
              href="https://www.my-co.app/enquiry/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 d-flex justify-content-center mb-1"
            >
              <img
                style={{ maxWidth: "50%" }}
                src={bgimage}
                alt="Clickable Image"
              />
            </a>
          </div> */}
        </>
      ) : null}
      <div
        style={{
          backgroundColor: "white",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          borderRadius: "10px",
          maxHeight: "75px",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "3.5rem" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "25px",
            }}
          >
            {numberofemp && (
              <>
                <h3 style={{ color: "#323D76" }}>
                  {numberofemp?.employee[0]?.count}
                </h3>
                <p style={{ marginBottom: "0px" }}>Registered Candidate</p>
              </>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {numberofemp && (
              <>
                <h3 style={{ color: "#323D76" }}>
                  {numberofemp?.employer[0]?.count}
                </h3>
                <p style={{ marginBottom: "0px" }}>Total Employer</p>
              </>
            )}
          </div>
        </div>

        <div>
          {role == "Client" ? (
            <button
              className="btn btn-primary"
              onClick={() =>
                window.open(
                  `https://wa.me/+919974877260?text=I%20want%20to%20know%20more%20about%20CRM%20Recruitment%20Automation%20Tool. `
                )
              }
            >
              Enquire Now
            </button>
          ) : null}
        </div>
      </div>
    </>
  ) : null;
};

export default FooterOfClient;
