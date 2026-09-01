/ eslint-disable no-unused-vars /;
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getstatistics } from "../../../apis/statistics/statistics";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { hasValidAuthToken } from "../../../utility/authSession";

const FooterOfClient = () => {
  const [numberofemp, setNumberofemp] = useState(null);
  const role = useSelector((state) => state?.auth?.user?.role?.name);
  const slug = localStorage.getItem("slug");
  const fetchedRef = useRef(false);
  const location = useLocation().pathname;

  useEffect(() => {
    if (role !== "Client" || !hasValidAuthToken() || fetchedRef.current) {
      return;
    }

    fetchedRef.current = true;
    let cancelled = false;

    async function fetchData() {
      try {
        const numberof = await getstatistics();
        if (!cancelled) {
          setNumberofemp(numberof);
        }
      } catch (error) {
        fetchedRef.current = false;
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [role]);

  return role === "Client" ? (
    <>
      {role === "Client" &&
      location !== `/${slug}/documentation` &&
      location !== `/${slug}/pricing` ? (
        <></>
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
