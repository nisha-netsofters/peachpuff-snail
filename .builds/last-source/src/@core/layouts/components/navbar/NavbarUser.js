import { Fragment, useState, useEffect } from "react";
import UserDropdown from "./UserDropdown";
import { Sun, Moon, Star } from "react-feather";
import { NavItem, NavLink, Button } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import Rating from "react-rating";
import ResumeThankYouPopup from "../../../../views/resume/ResumeThankYouPopup";
import actions from "../../../../redux/candidate/actions";

const NavbarUser = (props) => {
  const RESUME_ENQUIRY_STATUS = {
    REQUESTED: "requested",
    IN_REVIEW: "inreview",
  };
  // ** Props
  const { skin, setSkin } = props;
  const [themeColorHover, setThemeColorHover] = useState(false);
  const name = useSelector((state) => state?.auth?.user?.name);
  const themeColor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const hoverStyle = {
    color: themeColorHover ? themeColor : "#6e6b7b",
  };

  const ThemeToggler = () => {
    if (skin === "dark") {
      return (
        <Sun
          style={hoverStyle}
          className="ficon"
          onClick={() => setSkin("light")}
        />
      );
    } else {
      return (
        <Moon
          style={hoverStyle}
          className="ficon"
          onClick={() => setSkin("dark")}
        />
      );
    }
  };


  const userRole = useSelector((state) => state?.auth?.user?.role);
  const [showResumeThankYouPopup, setShowResumeThankYouPopup] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id || user?.id;
  const resumeEnquiryStatus = useSelector(
    (state) => state.candidate.resumeEnquiryStatus
  );
  // console.log("resumeEnquiryStatus from redux:", resumeEnquiryStatus);
  //  user status check
  useEffect(() => {
    if (user?._id && user?.role?.name === "Candidate") {
      dispatch({
        type: actions.GET_RESUME_ENQUIRY_STATUS,
        payload: { userId: user._id, role: user?.role?.name },
      });
    }
  }, [user?._id, user?.role?.name, dispatch]);

  // Apply for resume
  const handleApplyForResume = () => {
    // console.log("Apply For Resume clicked");
    // console.log("user object:", user);
    // console.log("userId:", userId);
    if (
      !userId ||
      resumeEnquiryStatus === RESUME_ENQUIRY_STATUS.REQUESTED ||
      resumeEnquiryStatus === RESUME_ENQUIRY_STATUS.IN_REVIEW
    ) {
      alert("User not found. Please login again.");
      return;
    }
    const message = "Need a professional resume";
    // console.log("Dispatching CREATE_RESUME_ENQUIRY with payload:", { userId, message });
    dispatch({
      type: actions.CREATE_RESUME_ENQUIRY,
      payload: { userId, message },
    });
    setShowResumeThankYouPopup(true);
  };

  return (
    <>
      <Fragment>
        <div className="bookmark-wrapper d-flex align-items-center">
          <NavItem
            onMouseEnter={() => setThemeColorHover(true)}
            onMouseLeave={() => setThemeColorHover(false)}
            className="d-flex d-lg-block"
          >
            <NavLink className="nav-link-style">
              <ThemeToggler />
            </NavLink>
          </NavItem>

          {userRole?.name === "Candidate" &&
            resumeEnquiryStatus !== RESUME_ENQUIRY_STATUS.REQUESTED &&
            resumeEnquiryStatus !== RESUME_ENQUIRY_STATUS.IN_REVIEW && (
            <Button
              style={{ backgroundColor: themeColor, color: "white" }}
              color="default"
              className="ms-2"
              onClick={handleApplyForResume}
            >
              Apply For Professional Resume
            </Button>
          )}

        </div>
        <ul className="nav navbar-nav align-items-center ms-auto">
          <h4 className="welcome" style={{ color: themeColor }}>
            Welcome back,
          </h4>{" "}
          <h3 className="welcome " style={{ color: themeColor }}>
            <strong>{name}</strong>
          </h3>
          <UserDropdown />
        </ul>
      </Fragment>
      <ResumeThankYouPopup
        isOpen={showResumeThankYouPopup}
        onClose={() => setShowResumeThankYouPopup(false)}
      />
    </>
  );
};
export default NavbarUser;
