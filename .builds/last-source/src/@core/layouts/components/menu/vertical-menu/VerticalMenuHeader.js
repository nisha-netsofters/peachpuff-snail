// ** React Imports
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

// ** Icons Imports
import { Disc, X, Circle } from "react-feather";

// ** Config
// import themeConfig from '@configs/themeConfig'
import { useSelector } from "react-redux";

const VerticalMenuHeader = (props) => {
  // ** Props
  const {
    menuCollapsed,
    setMenuCollapsed,
    setMenuVisibility,
    setGroupOpen,
    menuHover,
  } = props;

  const agencyLogo = useSelector((state) => state.auth?.user?.agency?.logo);

  const { user } = useSelector((state) => state.user);
  const slug = localStorage.getItem("slug");

  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([]);
  }, [menuHover, menuCollapsed]);

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <></>
        // <Disc
        //   size={20}
        //   data-tour='toggle-icon'
        //   className='text-primary toggle-icon d-none d-xl-block'
        //   onClick={() => setMenuCollapsed(true)}
        // />
      );
    } else {
      return (
        <Circle
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(false)}
        />
      );
    }
  };
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  return (
    <div className="navbar-header">
      <ul className="nav navbar-nav flex-row" style={{display: 'flex'}}>
        <li className="nav-item me-auto" style={{width: '90%', display: 'flex', justifyContent: 'center'}}>
          <NavLink
            to={
              user?.role?.name === "Client"
                ? `/${slug}/candidate`
                : `/${slug}/dashboard`
            }
            className="navbar-brand mt-0 w-100"
            style={{marginRight: '0'}}
          >
            <span className="brand-logo" style={{height: '100%', width :'100%', textAlign: 'center'}}>
              {menuCollapsed &&
              agencyLogo != undefined &&
              agencyLogo != null ? (
                <b>
                  <p>
                    UNIQUE
                    <br /> WORLD
                  </p>
                </b>
              ) : (
                <img
                src={agencyLogo}
                style={{
                  maxHeight: '70px',
                  padding: "12px",
                  maxWidth: '100%'
                }}
              />
              )}
            </span>
            {/* <h2 className='brand-text mb-0'>{themeConfig.app.appName}</h2> */}
          </NavLink>
        </li>
        <li className="nav-item nav-toggle">
          <div className="nav-link modern-nav-toggle cursor-pointer">
            <Toggler />
            <X
              style={{ color: themecolor }}
              onClick={() => setMenuVisibility(false)}
              className="toggle-icon icon-x d-block d-xxl-none"
              size={20}
            />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default VerticalMenuHeader;
