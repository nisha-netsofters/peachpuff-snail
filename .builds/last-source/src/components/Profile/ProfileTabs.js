// ** Reactstrap Imports
import { Nav, NavItem, NavLink } from "reactstrap";

// ** Icons Imports
import { User, Anchor, Share2 } from "react-feather";
import useBreakpoint from "../../utility/hooks/useBreakpoints";
import { City, State } from "country-state-city";

const ProfileTabs = ({ activeTab, toggleTab, themecolor }) => {
  const { width } = useBreakpoint();
  return width > 800 ? (
    <Nav
      pills
      className="mb-2"
      style={{
        display: "flex",
      }}
    >
      <NavItem>
        <NavLink
          active={activeTab === "1"}
          onClick={() => toggleTab("1")}
          style={
            activeTab === "1"
              ? {
                  backgroundColor: themecolor,
                  color: "white",
                  borderColor: themecolor,
                  boxShadow: "0 4px 18px -4px" + themecolor,
                }
              : {}
          }
        >
          <User size={18} className="me-50" />
          <span className="fw-bold">Profile Details</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          active={activeTab === "2"}
          onClick={() => toggleTab("2")}
          style={
            activeTab === "2"
              ? {
                  backgroundColor: themecolor,
                  color: "white",
                  borderColor: themecolor,
                  boxShadow: "0 4px 18px -4px" + themecolor,
                }
              : {}
          }
        >
          <Anchor size={18} className="me-50" />
          <span className="fw-bold">Agency Details</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          active={activeTab === "3"}
          onClick={() => toggleTab("3")}
          style={
            activeTab === "3"
              ? {
                  backgroundColor: themecolor,
                  color: "white",
                  borderColor: themecolor,
                  boxShadow: "0 4px 18px -4px" + themecolor,
                }
              : {}
          }
        >
          <Share2 size={18} className="me-50" />
          <span className="fw-bold">WhatsApp</span>
        </NavLink>
      </NavItem>
      {/* <NavItem>
        <NavLink
          active={activeTab === "4"}
          onClick={() => toggleTab("4")}
          style={
            activeTab === "4"
              ? {
                  backgroundColor: themecolor,
                  color: "white",
                  borderColor: themecolor,
                  boxShadow: "0 4px 18px -4px" + themecolor,
                }
              : {}
          }
        >
          <Anchor size={18} className="me-50" />
          <span className="fw-bold">Billing Details</span>
        </NavLink>
      </NavItem> */}
    </Nav>
  ) : (
    <div
      style={{
        display: "flex",
        fontSize: "2.3vw",
        justifyContent: "space-between",
        // gap: "2rem",
        width: "75vw",
        marginBottom: "1rem",
      }}
    >
      <div
        active={activeTab === "1"}
        onClick={() => toggleTab("1")}
        style={
          activeTab === "1"
            ? {
                color: themecolor,
                cursor: "pointer",
              }
            : { cursor: "pointer" }
        }
      >
        Profile Details
      </div>
      <div
        active={activeTab === "2"}
        onClick={() => toggleTab("2")}
        style={
          activeTab === "2"
            ? {
                color: themecolor,
                cursor: "pointer",
              }
            : { cursor: "pointer" }
        }
      >
        Agency Details
      </div>
      <div
        active={activeTab === "3"}
        onClick={() => toggleTab("3")}
        style={
          activeTab === "3"
            ? {
                color: themecolor,
                textWrap: "wrap",
                cursor: "pointer",
              }
            : { cursor: "pointer" }
        }
      >
        WhatsApp
      </div>
      {/* <div
        active={activeTab === "4"}
        onClick={() => toggleTab("4")}
        style={
          activeTab === "4"
            ? {
                color: themecolor,
                cursor: "pointer",
                textWrap: "wrap",
              }
            : { cursor: "pointer" }
        }
      >
        Billing Address
      </div> */}
    </div>
  );
};

export default ProfileTabs;
