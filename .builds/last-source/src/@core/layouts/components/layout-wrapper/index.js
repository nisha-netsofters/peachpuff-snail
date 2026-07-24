// ** React Imports
import { Fragment, useEffect } from "react";

// ** Third Party Components
import classnames from "classnames";

// ** Store & Actions
import { useSelector, useDispatch } from "react-redux";
import {
  handleContentWidth,
  handleMenuCollapsed,
  handleMenuHidden,
} from "@store/layout";

// ** Styles
import "animate.css/animate.css";
import useBreakpoint from "../../../../utility/hooks/useBreakpoints";

const LayoutWrapper = (props) => {
  // ** Props
  const { layout, children, appLayout, wrapperClass, transition, routeMeta } =
    props;

  const breakpoint = useBreakpoint();

  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const roleuser = store?.auth?.user?.role?.name;

  const navbarStore = store.navbar;
  const contentWidth = store.layout.contentWidth;

  //** Vars
  const Tag = layout === "HorizontalLayout" && !appLayout ? "div" : Fragment;

  // ** Clean Up Function
  const cleanUp = () => {
    if (routeMeta) {
      if (routeMeta.contentWidth) {
        dispatch(handleContentWidth("full"));
      }
      if (routeMeta.menuCollapsed) {
        dispatch(handleMenuCollapsed(!routeMeta.menuCollapsed));
      }
      if (routeMeta.menuHidden) {
        dispatch(handleMenuHidden(!routeMeta.menuHidden));
      }
    }
  };

  // ** ComponentDidMount
  useEffect(() => {
    if (routeMeta) {
      if (routeMeta.contentWidth) {
        dispatch(handleContentWidth(routeMeta.contentWidth));
      }
      if (routeMeta.menuCollapsed) {
        dispatch(handleMenuCollapsed(routeMeta.menuCollapsed));
      }
      if (routeMeta.menuHidden) {
        dispatch(handleMenuHidden(routeMeta.menuHidden));
      }
    }
    return () => cleanUp();
  }, []);
  return (
    <>
      <div
        className={classnames("app-content content overflow-hidden", {
          [wrapperClass]: wrapperClass,
          "show-overlay": navbarStore.query.length,
        })}
      >
        <div className="content-overlay"></div>
        <div className="header-navbar-shadow" />
        <div
          style={
            roleuser === "Client"
              ? breakpoint.width > 1160
                ? { padding: "calc(0rem + 4rem + 1rem) 2rem 0" }
                : breakpoint.width <= 1160 && breakpoint.width >= 769
                ? { padding: "calc(2.5rem + 4.45rem + 1.3rem) 2rem 0" }
                : { padding: "calc(2.5rem + 2.45rem + 1.3rem) 2rem 0" }
              : breakpoint.width >= 1560
              ? { padding: "calc(0rem + 4rem + 1rem) 2rem 0" }
              : breakpoint.width <= 1560 && breakpoint.width >= 769
              ? { padding: "calc(2.5rem + 4.45rem + 1.3rem) 2rem 0" }
              : { padding: "calc(2.5rem + 2.45rem + 1.3rem) 2rem 0" }
          }
          className={classnames({
            "content-wrapper": !appLayout,
            "content-area-wrapper": appLayout,
            "container-xxl p-0": contentWidth === "boxed",
            [`animate__animated animate__${transition}`]:
              transition !== "none" && transition.length,
          })}
        >
          <Tag
            /*eslint-disable */
            {...(layout === "HorizontalLayout" && !appLayout
              ? { className: classnames({ "content-body": !appLayout }) }
              : {})}
            /*eslint-enable */
          >
            {children}
          </Tag>
        </div>
      </div>
    </>
  );
};

export default LayoutWrapper;
