// ** Reactstrap Imports
import { Nav, NavItem, NavLink } from "reactstrap";

// ** Icons Imports
import { User, Lock } from "react-feather";

const Tabs = ({ activeTab, toggleTab, themecolor }) => {
  return (
    <Nav pills className="mb-2">
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
          <span className="fw-bold">Account</span>
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
          <Lock size={18} className="me-50" />
          <span className="fw-bold">Security</span>
        </NavLink>
      </NavItem>
    </Nav>
  );
};

export default Tabs;
