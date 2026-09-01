import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { Card, CardBody } from "reactstrap";
import { getjobOpeningAPI } from "../../apis/jobOpening";
import JobOpeningMatches from "./JobOpeningMatches";
import ComponentSpinner from "../../@core/components/spinner/Loading-spinner";
import { selectThemeColors } from "@utils";

const CandidateBestMatches = () => {
  const loginUser = useSelector((state) => state?.auth?.user);
  const themeColor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      if (!loginUser?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const resp = await getjobOpeningAPI({
          page: 1,
          perPage: 100,
          userId: loginUser.id,
          filterData: {},
        });
        const list = Array.isArray(resp?.results) ? resp.results : [];
        setJobs(list);
        if (list.length > 0) {
          setSelectedJobId(list[0].id || list[0]._id);
        } else {
          setSelectedJobId(null);
        }
      } catch (error) {
        console.error("Failed to load job openings:", error);
        setJobs([]);
        setSelectedJobId(null);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [loginUser?.id]);

  const jobOptions = useMemo(
    () =>
      jobs.map((job) => {
        const id = job.id || job._id;
        const designation = job.designation || "Job";
        const company = job.companyName ? ` — ${job.companyName}` : "";
        return {
          value: id,
          label: `${designation}${company}`,
        };
      }),
    [jobs]
  );

  const selectedOption = jobOptions.find((opt) => opt.value === selectedJobId);

  if (loading) {
    return (
      <ComponentSpinner isClientCandidate={true} theamcolour={themeColor} />
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <h3 style={{ color: themeColor, margin: 0 }}>
          <b>Best Matches Candidates</b>
        </h3>
        {jobOptions.length > 0 && (
          <div style={{ marginLeft: "auto", minWidth: "280px", flex: "1 1 280px", maxWidth: "420px" }}>
            <Select
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              options={jobOptions}
              value={selectedOption || null}
              onChange={(opt) => setSelectedJobId(opt?.value || null)}
              placeholder="Select Job Opening"
            />
          </div>
        )}
      </div>

      {!selectedJobId ? (
        <Card>
          <CardBody className="text-center text-muted py-4">
            No job openings found. Please create a job opening first.
          </CardBody>
        </Card>
      ) : (
        <JobOpeningMatches
          key={selectedJobId}
          jobIdOverride={selectedJobId}
          embeddedMode
        />
      )}
    </div>
  );
};

export default CandidateBestMatches;
