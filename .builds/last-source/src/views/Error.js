// ** React Imports
import { Link } from "react-router-dom";

// ** Reactstrap Imports
import { Button } from "reactstrap";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";

// ** Styles
import "@styles/base/pages/page-misc.scss";

// import unique from "../assets/images/logo/unique.png";
import { useSelector } from "react-redux";

const Error = () => {
  const { user } = useSelector((state) => state.user);

  // ** Hooks
  const { skin } = useSkin();
  const slugId = localStorage.getItem("slug");
  const illustration = skin === "dark" ? "error-dark.svg" : "error.svg",
    source = require(`@src/assets/images/pages/${illustration}`);
  const themecolor = localStorage.getItem("themecolor");
  return (
    <div className="misc-wrapper">
      <a className="brand-logo" href="/">
        <Link
          className="brand-logo"
          to={
            user?.role?.name === "Client"
              ? `/${slugId}/candidate`
              : `/${slugId}/dashboard`
          }
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
            // tag={Link}
            // to="/login"
            // to="/uniqueworld/dashboard"
            onClick={() => window.location.href = "/uniqueworld/dashboard"}
            color="defult" 
            className="btn-sm-block mb-2"
            style={{ backgroundColor: themecolor, color: "white" }}
          >
            {user?.role?.name === "Client" ? (
              <>Back To Candidate</>
            ) : (
              <>Back to home</>
            )}
          </Button>
          <img className="img-fluid" src={source} alt="Not authorized page" />
        </div>
      </div>
    </div>
  );
};
export default Error;
