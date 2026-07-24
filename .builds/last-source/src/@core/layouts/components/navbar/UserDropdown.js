// ** React Imports
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Third Party Components
import { User, Power } from "react-feather";

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";
import defaultImg from "../../../../assets/images/user-circle.svg";

import { useDispatch, useSelector } from "react-redux";
import actions from "../../../../redux/auth/actions";
import { resolveAssetUrl } from "../../../../utility/resolveAssetUrl";

const UserDropdown = () => {
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  const slug = localStorage.getItem("slug");
  const user = useSelector((state) => state.auth.user);
  const candidateProfile = useSelector(
    (state) => state?.candidate?.candidateProfile
  );
  const themeColor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const [hoverIndex, setHoverIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  const avatarSrc = useMemo(() => {
    const raw =
      user?.image ||
      (user?.role?.name === "Candidate" ? candidateProfile?.image : null) ||
      null;
    return resolveAssetUrl(raw);
  }, [user?.image, user?.role?.name, candidateProfile?.image]);

  useEffect(() => {
    setImgError(false);
  }, [avatarSrc]);

  const logouthandler = async () => {
    dispatch({
      type: actions.SIGN_OUT,
    });
    setUserData(null);
  };

  const profileStyle = {
    backgroundColor: hoverIndex == 1 && `${themeColor}30`,
    color: hoverIndex == 1 && themeColor,
  };

  const logoutStyle = {
    backgroundColor: hoverIndex == 2 && `${themeColor}30`,
    color: hoverIndex == 2 && themeColor,
  };

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Avatar
            img={!imgError && avatarSrc ? avatarSrc : defaultImg}
            imgHeight="40"
            imgWidth="40"
            status="online"
            onImgError={() => setImgError(true)}
          />

          <span
            className="user-status"
            style={{ marginTop: "6px", textAlign: "center" }}
          >
            {(userData && userData?.role) || user?.role?.name}
          </span>
        </div>
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem
          style={profileStyle}
          onMouseEnter={() => setHoverIndex(1)}
          onMouseLeave={() => setHoverIndex(0)}
          tag={Link}
          to={
            user?.role?.name == "SuperAdmin"
              ? "/superadmin/profile"
              : `/${slug}/profile`
          }
        >
          <User size={18} className="me-50" />
          <span className="align-middle">Profile</span>
        </DropdownItem>

        <DropdownItem
          style={logoutStyle}
          onMouseEnter={() => setHoverIndex(2)}
          onMouseLeave={() => setHoverIndex(0)}
          tag={Link}
          to={user?.role?.name == "SuperAdmin" ? "/superadmin/login" : `/login`}
          onClick={() => logouthandler()}
        >
          <Power size={14} className="me-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
