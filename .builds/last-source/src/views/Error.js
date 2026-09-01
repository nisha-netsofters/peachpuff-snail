// ** React Imports
import { Link } from "react-router-dom";

// ** Reactstrap Imports
import { Button } from "reactstrap";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";

// ** Styles
import "@styles/base/pages/page-misc.scss";

import { useSelector } from "react-redux";
import { hasValidAuthToken } from "../utility/authSession";

const Error = () => {
  const { user } = useSelector((state) => state.auth);

  // ** Hooks
  const { skin } = useSkin();
  const illustration = skin === "dark" ? "error-dark.svg" : "error.svg";
  const source = require(`@src/assets/images/pages/${illustration}`);
  const themecolor = localStorage.getItem("themecolor") || "#323D76";

  const getHomePath = () => {
    if (!hasValidAuthToken() || !user?.role?.name) {
      return "/login";
    }

    const agencySlug = user?.agency?.slug || localStorage.getItem("slug");
    if (!agencySlug) {
      return "/login";
    }

    if (user.role.name === "Client") {
      return `/${agencySlug}/candidate`;
    }
    if (user.role.name === "SuperAdmin") {
      return "/superadmin/dashboard";
    }
    if (user.role.name === "Candidate") {
      return `/${agencySlug}/dashboard`;
    }
    return `/${agencySlug}/dashboard`;
  };

  const handleGoHome = () => {
    const homePath = getHomePath();
    if (homePath === "/login") {
      window.location.href = "/login";
      return;
    }

    const agencySlug = user?.agency?.slug;
    if (agencySlug) {
      localStorage.setItem("slug", agencySlug);
      if (user?.agencyId) {
        localStorage.setItem("agencyId", user.agencyId);
      }
    }

    window.location.href = homePath;
  };

  const isClient = user?.role?.name === "Client";

  return (
    <div className="misc-wrapper">
      <Link className="brand-logo" to={getHomePath()} onClick={(e) => {
        e.preventDefault();
        handleGoHome();
      }} />
      <div className="misc-inner p-2 p-sm-3">
        <div className="w-100 text-center">
          <h2 className="mb-1">Page Not Found 🕵🏻‍♀️</h2>
          <p className="mb-2">
            Oops! 😖 The requested URL was not found on this server.
          </p>
          <Button
            onClick={handleGoHome}
            color="defult"
            className="btn-sm-block mb-2"
            style={{ backgroundColor: themecolor, color: "white" }}
          >
            {isClient ? <>Back To Candidate</> : <>Back to home</>}
          </Button>
          <img className="img-fluid" src={source} alt="Not authorized page" />
        </div>
      </div>
    </div>
  );
};
export default Error;
