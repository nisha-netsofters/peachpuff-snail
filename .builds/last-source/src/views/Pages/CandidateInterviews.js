import React, { useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import moment from "moment";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
} from "reactstrap";
import { useSelector } from "react-redux";
import ComponentSpinner from "../../@core/components/spinner/Loading-spinner";
import { getCandidateMyInterviewsAPI } from "../../apis/candidate";
import { getInterviewStatusBadgeColor } from "../../components/JobOpening/jobMatchTableHelpers";

const formatInterviewTime = (time) => {
  if (!time) return "-";
  const m = moment(time);
  return m.isValid() ? m.format("hh:mm A") : "-";
};

const CandidateInterviews = () => {
  const themeColor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const loadInterviews = useCallback(async (pageNum, perPageNum) => {
    setLoading(true);
    try {
      const resp = await getCandidateMyInterviewsAPI({
        page: pageNum,
        perPage: perPageNum,
      });
      const body = resp?.results !== undefined ? resp : resp?.data || {};
      setRows(body?.results || []);
      setTotal(Number(body?.total) || 0);
    } catch (err) {
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInterviews(page, perPage);
  }, [page, perPage, loadInterviews]);

  const columns = [
    {
      name: "Company",
      selector: (row) => row?.companyName || row?.client?.companyName || "-",
      minWidth: "160px",
    },
    {
      name: "Job Title",
      selector: (row) => row?.jobTitle || row?.jobOpening?.designation || "-",
      minWidth: "140px",
    },
    {
      name: "Status",
      minWidth: "120px",
      cell: (row) => {
        const status = row?.interviewStatus || "scheduled";
        return (
          <Badge
            pill
            color={getInterviewStatusBadgeColor(status)}
            style={{ textTransform: "capitalize" }}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      name: "Interview Date",
      selector: (row) =>
        row?.date && row.date !== "Invalid date"
          ? moment(row.date).format("DD-MM-YYYY")
          : "-",
      minWidth: "130px",
    },
    {
      name: "Time",
      selector: (row) => formatInterviewTime(row?.time),
      minWidth: "100px",
    },
    {
      name: "Type",
      selector: (row) => row?.interviewType || "-",
      minWidth: "100px",
      cell: (row) => (
        <span style={{ textTransform: "capitalize" }}>
          {row?.interviewType || "-"}
        </span>
      ),
    },
    {
      name: "Meeting Link",
      minWidth: "160px",
      cell: (row) =>
        row?.link ? (
          <a href={row.link} target="_blank" rel="noopener noreferrer">
            Open Link
          </a>
        ) : (
          "-"
        ),
    },
    {
      name: "Comments",
      selector: (row) => row?.comments || "-",
      minWidth: "160px",
      wrap: true,
    },
    {
      name: "Scheduled On",
      selector: (row) =>
        row?.createdAt ? moment(row.createdAt).format("DD-MM-YYYY") : "-",
      minWidth: "120px",
    },
  ];

  return (
    <Row>
      <Col sm="12">
        <Card>
          <CardHeader className="border-bottom">
            <CardTitle tag="h4" style={{ color: themeColor }}>
              My Interviews
            </CardTitle>
          </CardHeader>
          <CardBody className="pt-1">
            <p className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>
              Full history of interviews scheduled for your profile.
            </p>
            <div className="react-dataTable">
              <DataTable
                noHeader
                pagination
                paginationServer
                responsive
                highlightOnHover
                columns={columns}
                data={rows}
                progressPending={loading}
                progressComponent={
                  <ComponentSpinner
                    isClientCandidate={true}
                    theamcolour={themeColor}
                  />
                }
                noDataComponent={
                  loading ? (
                    <ComponentSpinner
                      isClientCandidate={true}
                      theamcolour={themeColor}
                    />
                  ) : (
                    <div style={{ padding: "24px", color: "#6e6b7b" }}>
                      No interviews found
                    </div>
                  )
                }
                paginationTotalRows={total}
                paginationPerPage={perPage}
                paginationRowsPerPageOptions={[10, 20, 30, 50]}
                onChangePage={(p) => setPage(p)}
                onChangeRowsPerPage={(newPerPage, pageNum) => {
                  setPerPage(newPerPage);
                  setPage(pageNum);
                }}
              />
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default CandidateInterviews;
