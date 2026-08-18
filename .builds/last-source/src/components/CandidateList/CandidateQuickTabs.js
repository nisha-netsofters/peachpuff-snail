import { Nav, NavItem, NavLink } from "reactstrap";

export const CANDIDATE_QUICK_TABS = [
  { id: "all", label: "All" },
  { id: "recentlyAdded", label: "Recently Added" },
  { id: "recentlyViewed", label: "Recently Viewed" },
  { id: "newCandidates", label: "New Candidates" },
  { id: "inProcess", label: "In Process" },
  { id: "interviewScheduled", label: "Interview Scheduled" },
  { id: "selected", label: "Selected" },
  { id: "rejected", label: "Rejected" },
  { id: "hold", label: "Hold" },
  { id: "favorites", label: "Favorites" },
];

const CandidateQuickTabs = ({
  activeTab,
  onChange,
  themecolor = "#323D76",
}) => {
  return (
    <div
      className="candidate-quick-tabs mb-1"
      style={{
        width: "100%",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        marginTop: "8px",
        marginBottom: "12px",
        paddingBottom: "4px",
      }}
    >
      <Nav
        pills
        className="flex-nowrap"
        style={{
          flexWrap: "nowrap",
          gap: "6px",
          minWidth: "max-content",
        }}
      >
        {CANDIDATE_QUICK_TABS.map((tab) => {
          const isActive =
            tab.id === "all" ? !activeTab : activeTab === tab.id;
          return (
            <NavItem key={tab.id}>
              <NavLink
                active={isActive}
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  onChange(tab.id);
                }}
                style={
                  isActive
                    ? {
                        backgroundColor: themecolor,
                        color: "#fff",
                        borderColor: themecolor,
                        whiteSpace: "nowrap",
                        fontSize: "13px",
                        fontWeight: 600,
                        padding: "6px 14px",
                        cursor: "pointer",
                      }
                    : {
                        backgroundColor: `${themecolor}12`,
                        color: themecolor,
                        border: `1px solid ${themecolor}33`,
                        whiteSpace: "nowrap",
                        fontSize: "13px",
                        fontWeight: 500,
                        padding: "6px 14px",
                        cursor: "pointer",
                      }
                }
              >
                {tab.label}
              </NavLink>
            </NavItem>
          );
        })}
      </Nav>
    </div>
  );
};

export default CandidateQuickTabs;
