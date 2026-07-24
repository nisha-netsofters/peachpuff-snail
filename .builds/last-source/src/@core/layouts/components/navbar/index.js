// ** React Imports
import { Fragment, useState } from "react";

// ** Custom Components
import NavbarUser from "./NavbarUser";

// ** Third Party Components
import { Menu } from "react-feather";

// ** Reactstrap Imports
import { NavItem, NavLink } from "reactstrap";
import { useSelector } from "react-redux";
import useBreakpoint from "./../../../../utility/hooks/useBreakpoints";

const ThemeNavbar = (props) => {
  const role = useSelector((state) => state?.auth?.user?.role?.name);
  const themeColor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const [themeColorHover, setThemeColorHover] = useState(false);
  // let sizescreen;
  // if (role == "Client") {
  //   sizescreen = "d-lg-none";
  // } else {
  //   sizescreen = "d-xxl-none";
  // }
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props;
  const { width } = useBreakpoint();
  const hoverStyle = {
    color: themeColorHover ? themeColor : "#6e6b7b",
  };
  return (
    <Fragment>
      <ul className={`navbar-nav`}>
        {width < 1560 && role !== "Client" ? (
          <NavItem
            onMouseEnter={() => setThemeColorHover(true)}
            onMouseLeave={() => setThemeColorHover(false)}
            className="mobile-menu me-auto d-flex align-items-center"
          >
            <NavLink
              className="nav-menu-main menu-toggle hidden-xs is-active"
              onClick={() => setMenuVisibility(true)}
            >
              <Menu style={hoverStyle} className="ficon" />
            </NavLink>
          </NavItem>
        ) : null}
        {width <= 1160 && role == "Client" ? (
          <NavItem className="mobile-menu me-auto d-flex align-items-center">
            <NavLink
              className="nav-menu-main menu-toggle hidden-xs is-active"
              onClick={() => setMenuVisibility(true)}
            >
              <Menu className="ficon" />
            </NavLink>
          </NavItem>
        ) : null}
      </ul>
      <NavbarUser skin={skin} setSkin={setSkin} />
    </Fragment>
  );
};

export default ThemeNavbar;
