// ** React Imports
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";
import { handleMenuHidden, handleContentWidth } from "@store/layout";

// ** Third Party Components
import classnames from "classnames";
import { ArrowUp } from "react-feather";

// ** Reactstrap Imports
import { Navbar, NavItem, Button } from "reactstrap";

// ** Configs
import themeConfig from "@configs/themeConfig";

// ** Custom Components
import Customizer from "@components/customizer";
import ScrollToTop from "@components/scrolltop";
import NavbarComponent from "./components/navbar";
import FooterComponent from "./components/footer";
import MenuComponent from "./components/menu/horizontal-menu";

// ** Custom Hooks
import { useRTL } from "@hooks/useRTL";
import { useSkin } from "@hooks/useSkin";
import { useNavbarType } from "@hooks/useNavbarType";
import { useFooterType } from "@hooks/useFooterType";
import { useNavbarColor } from "@hooks/useNavbarColor";

// ** Styles
import "@styles/base/core/menu/menu-types/horizontal-menu.scss";
import useBreakpoint from "../../utility/hooks/useBreakpoints";

const HorizontalLayout = (props) => {
  // ** Props
  const {
    children,
    navbar,
    menuData,
    footer,
    menu,
    currentActiveItem,
    routerProps,
    setLastLayout,
  } = props;

  // ** Hooks
  const { width } = useBreakpoint();
  const { skin, setSkin } = useSkin();
  const [isRtl, setIsRtl] = useRTL();
  const { navbarType, setNavbarType } = useNavbarType();
  const { footerType, setFooterType } = useFooterType();
  const { navbarColor, setNavbarColor } = useNavbarColor();
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  // ** States
  const [isMounted, setIsMounted] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);

  // ** Store Vars
  const dispatch = useDispatch();
  const layoutStore = useSelector((state) => state.layout);
  const agencyLogo = useSelector((state) => state.auth?.user?.agency?.logo);

  const { user } = useSelector((state) => state.user);
  const slug = localStorage.getItem("slug");

  // ** Vars
  const contentWidth = layoutStore.contentWidth;
  const isHidden = layoutStore.menuHidden;

  // ** Handles Content Width
  const setContentWidth = (val) => dispatch(handleContentWidth(val));

  // ** Handles Content Width
  const setIsHidden = (val) => dispatch(handleMenuHidden(val));

  // ** UseEffect Cleanup
  const cleanup = () => {
    setIsMounted(false);
    setNavbarScrolled(false);
  };

  //** ComponentDidMount
  useEffect(() => {
    setIsMounted(true);
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 65 && navbarScrolled === false) {
        setNavbarScrolled(true);
      }
      if (window.pageYOffset < 65) {
        setNavbarScrolled(false);
      }
    });
    return () => cleanup();
  }, []);

  // ** Vars
  const footerClasses = {
    static: "footer-static",
    sticky: "footer-fixed",
    hidden: "footer-hidden",
  };

  const navbarWrapperClasses = {
    floating: "navbar-floating",
    sticky: "navbar-sticky",
    static: "navbar-static",
  };

  const navbarClasses = {
    floating:
      contentWidth === "boxed" ? "floating-nav container-xxl" : "floating-nav",
    sticky: "fixed-top",
  };

  const bgColorCondition =
    navbarColor !== "" && navbarColor !== "light" && navbarColor !== "white";

  if (!isMounted) {
    return null;
  }
  return (
    <div
      className={classnames(
        `wrapper horizontal-layout horizontal-menu ${
          navbarWrapperClasses[navbarType] || "navbar-floating"
        } ${footerClasses[footerType] || "footer-static"} menu-expanded`
      )}
      {...(isHidden ? { "data-col": "1-column" } : {})}
    >
      <Navbar
        expand="lg"
        container={false}
        className={classnames(
          "header-navbar navbar-fixed align-items-center navbar-shadow navbar-brand-center",
          {
            "navbar-scrolled": navbarScrolled,
          }
        )}
        style={{ margin: 0 }}
      >
        {!navbar && (
          <div className="navbar-header d-xl-block d-none">
            <ul className="nav navbar-nav">
              <NavItem>
                {agencyLogo != undefined && agencyLogo != null ? (
                  <Link
                    to={
                      user?.role?.name === "Client"
                        ? `/${slug}/candidate`
                        : `/${slug}/dashboard`
                    }
                    className="navbar-brand"
                  >
                    <span className="brand-logo">
                      <img
                        src={agencyLogo}
                        style={{
                          maxHeight: "80px",
                          padding: "5px 0",
                        }}
                      />
                    </span>
                    <h2 className="brand-text mb-0">
                      {themeConfig.app.appName}
                    </h2>
                  </Link>
                ) : null}
              </NavItem>
            </ul>
          </div>
        )}

        <div className="navbar-container d-flex content is-active">
          {navbar ? navbar : <NavbarComponent skin={skin} setSkin={setSkin} />}
        </div>
      </Navbar>
      {!isHidden ? (
        <div className="horizontal-menu-wrapper flex">
          <Navbar
            tag="div"
            expand="lg"
            style={{
              marginTop: "30px ",
              display: "flex",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            light={skin !== "dark"}
            dark={skin === "dark" || bgColorCondition}
            className={classnames(
              `header-navbar navbar-horizontal navbar-shadow menu-border`,
              {
                [navbarClasses[navbarType]]: navbarType !== "static",
                "floating-nav":
                  (!navbarClasses[navbarType] && navbarType !== "static") ||
                  navbarType === "floating",
              }
            )}
          >
            {menu ? (
              menu
            ) : (
              <MenuComponent
                menuData={menuData}
                routerProps={routerProps}
                currentActiveItem={currentActiveItem}
              />
            )}
          </Navbar>
        </div>
      ) : null}

      {children}
      {themeConfig.layout.customizer === true ? (
        <Customizer
          skin={skin}
          setSkin={setSkin}
          footerType={footerType}
          setFooterType={setFooterType}
          navbarType={navbarType}
          setNavbarType={setNavbarType}
          navbarColor={navbarColor}
          setNavbarColor={setNavbarColor}
          isRtl={isRtl}
          setIsRtl={setIsRtl}
          layout={props.layout}
          setLastLayout={setLastLayout}
          setLayout={props.setLayout}
          isHidden={isHidden}
          setIsHidden={setIsHidden}
          contentWidth={contentWidth}
          setContentWidth={setContentWidth}
          transition={props.transition}
          setTransition={props.setTransition}
          themeConfig={themeConfig}
        />
      ) : null}
      <footer
        className={classnames(
          `footer footer-light ${footerClasses[footerType] || "footer-static"}`,
          {
            "d-none": footerType === "hidden",
          }
        )}
      >
        {footer ? (
          footer
        ) : (
          <FooterComponent
            footerType={footerType}
            footerClasses={footerClasses}
          />
        )}
        <div
          // style={
          //   width < 600
          //     ? {
          //         display: "flex",
          //         flexDirection: "column",
          //         justifyContent: "space-between",
          //         padding: "1rem",
          //         fontWeight: "400",
          //         alignItems: "center",
          //       }
          //     : {
          //         display: "flex",
          //         flexDirection: "column",
          //         justifyContent: "space-between",
          //         padding: "1rem",
          //         fontWeight: "400",
          //       }
          // }
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "1rem",
            fontWeight: "400",
          }}
        >
          <div style={{ fontSize: width < 768 && "12px" }}>
            Provided By{" "}
            <a
              style={{
                color: themecolor,
                fontWeight: "600",
                fontSize: width < 768 && "12px",
              }}
              href="https://portal.uniqueworldjobs.com/"
              target="_blank"
              class="footer-link fw-medium"
            >
              Unique world
            </a>
          </div>
          <div style={{ fontSize: width < 768 && "12px" }}>
            Design and Maintained by{" "}
            <a
              style={{
                color: themecolor,
                fontWeight: "600",
                fontSize: width < 768 && "12px",
              }}
              href="https://solutionsquares.com/"
              target="_blank"
              class="footer-link  fw-medium"
            >
              Solution Squares
            </a>
          </div>
        </div>
      </footer>

      {themeConfig.layout.scrollTop === true ? (
        <div className="scroll-to-top">
          <ScrollToTop showOffset={300} className="scroll-top d-block">
            <Button
              className="btn-icon"
              color="default"
              style={{ backgroundColor: themecolor, color: "white" }}
            >
              <ArrowUp size={14} />
            </Button>
          </ScrollToTop>
        </div>
      ) : null}
    </div>
  );
};
export default HorizontalLayout;
