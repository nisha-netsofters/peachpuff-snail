// ** React Imports
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

// ** Third Party Components
import classnames from "classnames";
import { useSelector } from "react-redux";

const HorizontalNavMenuLink = ({
  item,
  isChild,
  setActiveItem,
  setOpenDropdown,
  currentActiveItem,
}) => {
  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? "a" : NavLink;

  // ** Remove all items from OpenDropdown array
  const resetOpenDropdowns = () => setOpenDropdown([]);

  // ** On mount update active group array
  useEffect(() => {
    if (currentActiveItem !== null) {
      setActiveItem(location.pathname);
    }
  }, [location]);
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  return (
    <li
      className={classnames("nav-item", {
        active: item.navLink === location.pathname,
        disabled: item.disabled,
      })}
      onClick={resetOpenDropdowns}
    >
      <LinkTag
        style={
          item.navLink === location.pathname
            ? {
                background: themecolor,
                color: "white",
                boxShadow: "0 0 10px 1px " + themecolor,
                borderBottom: "2px solid" + themecolor,
              }
            : {}
        }
        className={classnames("d-flex align-items-center", {
          "dropdown-item": isChild,
          "nav-link": !isChild,
        })}
        tag={LinkTag}
        target={item.newTab ? "_blank" : undefined}
        /*eslint-disable */
        {...(item.externalLink === true
          ? {
              href: item.navLink || "/",
            }
          : {
              to: item.navLink || "/",
              isActive: (match, location) => {
                if (!match) {
                  return false;
                }

                if (
                  match.url &&
                  match.url !== "" &&
                  match.url === item.navLink
                ) {
                  currentActiveItem = item.navLink;
                }
              },
            })}
        /*eslint-enable */
      >
        {item.icon}
        <span>{item.title}</span>
      </LinkTag>
    </li>
  );
};

export default HorizontalNavMenuLink;
