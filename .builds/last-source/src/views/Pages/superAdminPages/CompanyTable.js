// ** Custom Components
import Avatar from "@components/avatar";

// ** Reactstrap Imports
import {
  Table,
  Card,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

// ** Icons Imports
import {
  Monitor,
  Coffee,
  Watch,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
} from "react-feather";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import agencyActions from "../../../redux/agency/actions";

const CompanyTable = () => {
  // ** vars

  //   const data = [
  //     {
  //       img: require("@src/assets/images/icons/toolbox.svg").default,
  //       name: "Dixons",
  //       email: "meguc@ruj.io",
  //       icon: <Monitor size={18} />,
  //       category: "Technology",
  //       views: "23.4k",
  //       time: "24 hours",
  //       revenue: "891.2",
  //       sales: "68",
  //     },
  //     {
  //       img: require("@src/assets/images/icons/parachute.svg").default,
  //       name: "Motels",
  //       email: "vecav@hodzi.co.uk",
  //       icon: <Coffee size={18} />,
  //       category: "Grocery",
  //       views: "78k",
  //       time: "2 days",
  //       revenue: "668.51",
  //       sales: "97",
  //       salesUp: true,
  //     },
  //     {
  //       img: require("@src/assets/images/icons/brush.svg").default,
  //       name: "Zipcar",
  //       email: "davcilse@is.gov",
  //       icon: <Watch size={18} />,
  //       category: "Fashion",
  //       views: "162",
  //       time: "5 days",
  //       revenue: "522.29",
  //       sales: "62",
  //       salesUp: true,
  //     },
  //     {
  //       img: require("@src/assets/images/icons/star.svg").default,
  //       name: "Owning",
  //       email: "us@cuhil.gov",
  //       icon: <Monitor size={18} />,
  //       category: "Technology",
  //       views: "214",
  //       time: "24 hour",
  //       revenue: "291.01",
  //       sales: "88",
  //       salesUp: true,
  //     },
  //     {
  //       img: require("@src/assets/images/icons/book.svg").default,
  //       name: "Cafés",
  //       email: "pudais@jife.com",
  //       icon: <Coffee size={18} />,
  //       category: "Grocery",
  //       views: "208",
  //       time: "1 week",
  //       revenue: "783.93",
  //       sales: "16",
  //     },
  //     {
  //       img: require("@src/assets/images/icons/rocket.svg").default,
  //       name: "Kmart",
  //       email: "bipri@cawiw.com",
  //       icon: <Watch size={18} />,
  //       category: "Fashion",
  //       views: "990",
  //       time: "1 month",
  //       revenue: "780.05",
  //       sales: "78",
  //       salesUp: true,
  //     },
  //     {
  //       img: require("@src/assets/images/icons/speaker.svg").default,
  //       name: "Payers",
  //       email: "luk@izug.io",
  //       icon: <Watch size={18} />,
  //       category: "Fashion",
  //       views: "12.9k",
  //       time: "12 hours",
  //       revenue: "531.49",
  //       sales: "42",
  //       salesUp: true,
  //     },
  //   ];
  const [currentPage, setCurrentPage] = useState(1);
  const { agency } = useSelector((state) => state);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(
    agency?.agencyDashboardTableData?.total / itemsPerPage
  );

  const dispatch = useDispatch();
  const [dated, setData] = useState([]);

  useEffect(() => {
    dispatch({
      type: agencyActions.GET_AGENCY_DASHBOARD_TABLE_DATA,
      page: currentPage,
      perPage: itemsPerPage,
    });
  }, []);
  useEffect(() => {
    setData(agency?.agencyDashboardTableData?.results);
  }, [agency]);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    dispatch({
      type: agencyActions.GET_AGENCY_DASHBOARD_TABLE_DATA,
      page: pageNumber,
      perPage: itemsPerPage,
    });
  };
  const renderData = () => {
    return dated?.map((col) => {
      const IconTag = col.salesUp ? (
        <TrendingUp size={15} className="text-success" />
      ) : (
        <TrendingDown size={15} className="text-danger" />
      );

      return (
        <tr key={col.name}>
          <td>
            <div className="d-flex align-items-center">
              <div>
                <div className="fw-bolder">{col.name}</div>
                <div className="font-small-2 text-muted">{col.ownersName}</div>
              </div>
            </div>
          </td>
          <td>
            <div className="d-flex align-items-center">
              <span>{col.city}</span>
            </div>
          </td>
          <td className="text-nowrap">
            <div className="d-flex flex-column">
              <span className="fw-bolder mb-25">{col.candidatesCount}</span>
            </div>
          </td>
          <td>{col.clientsCount}</td>
          <td>
            <div
              class="form-check form-switch"
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckChecked"
                style={{ cursor: "pointer" }}
                value={col.status === "active" ? true : false}
                checked={col.status === "active" ? true : false}
                // onClick={() => handleInActiveAgency(row)}
              />
              <div style={col.status === "active" ? {} : { opacity: "0.5" }}>
                {col.status
                  ? col.status === "active"
                    ? "Active"
                    : "InActive"
                  : "Active"}
              </div>
            </div>
          </td>
        </tr>
      );
    });
  };
  const renderPagination = () => {
    return (
      <Pagination className="justify-content-center gap-1">
        {currentPage < 2 ? (
          <PaginationItem disabled>
            <PaginationLink
              style={{
                borderRadius: "0.5rem ",
                backgroundColor: "#10599630",
                color: "white",
              }}
            >
              Prev
            </PaginationLink>
          </PaginationItem>
        ) : (
          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageChange(currentPage - 1)}
              style={{
                borderRadius: "0.5rem ",
                backgroundColor: "#105996",
                color: "white",
              }}
            >
              Prev
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem style={{ marginLeft: "10px" }}>
          <PaginationLink
            style={{
              borderRadius: "0.5rem ",
              backgroundColor: "#323D76",
              color: "white",
            }}
          >
            {`Page - ${currentPage} of ${totalPages}`}
          </PaginationLink>
        </PaginationItem>
        {/* {visiblePageNumbers?.map((pageNumber) => (
          <PaginationItem key={pageNumber} active={pageNumber === currentPage}>
            <PaginationLink
              style={{
                borderRadius: "0.5rem ",
                backgroundColor: pageNumber === currentPage && "#10599650",
              }}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))} */}
        {currentPage < totalPages ? (
          <PaginationItem style={{ marginLeft: "10px" }}>
            <PaginationLink
              onClick={() => handlePageChange(currentPage + 1)}
              style={{
                borderRadius: "0.5rem ",
                backgroundColor: "#105996",
                color: "white",
              }}
            >
              Next
            </PaginationLink>
          </PaginationItem>
        ) : (
          <PaginationItem style={{ marginLeft: "10px" }} disabled>
            <PaginationLink
              style={{
                borderRadius: "0.5rem ",
                backgroundColor: "#10599630",
                color: "white",
              }}
            >
              Next
            </PaginationLink>
          </PaginationItem>
        )}
      </Pagination>
      // <Pagination className="justify-content-center">
      //   {visiblePageNumbers?.map((pageNumber) => (
      //     <PaginationItem key={pageNumber} active={pageNumber === currentPage}>
      //       <PaginationLink
      //         onClick={() => handlePageChange(pageNumber)}
      //         style={{
      //           borderRadius: "0.5rem ",
      //           backgroundColor: pageNumber === currentPage && "#000",
      //         }}
      //       >
      //         {pageNumber}
      //       </PaginationLink>
      //     </PaginationItem>
      //   ))}
      // </Pagination>
    );
  };
  return (
    <Card className="card-company-table justify-content-between">
      <Table responsive>
        <thead>
          <tr>
            <th>Agency</th>
            <th>City</th>
            <th>Candidate</th>
            <th>Client</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{renderData()}</tbody>
      </Table>
      <div className="d-flex justify-content-center">{renderPagination()}</div>
    </Card>
  );
};

export default CompanyTable;
