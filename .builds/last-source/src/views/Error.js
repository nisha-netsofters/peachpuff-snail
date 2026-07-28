// ** React Imports
import { Link } from "react-router-dom";

// ** Reactstrap Imports
import { Button } from "reactstrap";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";

// ** Styles
import "@styles/base/pages/page-misc.scss";

import { useSelector } from "react-redux";

const Error = () => {
  const { user } = useSelector((state) => state.auth);

  // ** Hooks
  const { skin } = useSkin();
  const slugId = localStorage.getItem("slug") || "uniqueworld";
  const token = localStorage.getItem("token");
  const illustration = skin === "dark" ? "error-dark.svg" : "error.svg",
    source = require(`@src/assets/images/pages/${illustration}`);
  const themecolor = localStorage.getItem("themecolor") || "#323D76";

  const getHomePath = () => {
    if (
      !token ||
      token === "null" ||
      token === "undefined" ||
      !user?.role?.name
    ) {
      return "/login";
    }
    if (user.role.name === "Client") {
      return `/${slugId}/candidate`;
    }
    if (user.role.name === "SuperAdmin") {
      return "/superadmin/dashboard";
    }
    return `/${slugId}/dashboard`;
  };

  const homePath = getHomePath();
  const isClient = user?.role?.name === "Client";

  return (
    <div className="misc-wrapper">
      <a className="brand-logo" href={homePath}>
        <Link
          className="brand-logo"
          to={homePath}
          onClick={(e) => e.preventDefault()}
        ></Link>
      </a>
      <div className="misc-inner p-2 p-sm-3">
        <div className="w-100 text-center">
          <h2 className="mb-1">Page Not Found 🕵🏻‍♀️</h2>
          <p className="mb-2">
            Oops! 😖 The requested URL was not found on this server.
          </p>
          <Button
            onClick={() => {
              window.location.href = homePath;
            }}
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
