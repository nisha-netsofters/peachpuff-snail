// ** Custom Components
import Avatar from "@components/avatar";
import AvatarGroup from "@components/avatar-group";
import moment from "moment";
import { useEffect, useState } from "react";

// ** Icons Imports
import { Calendar, MapPin } from "react-feather";

// ** Reactstrap Imports
import { Card, CardTitle, CardBody, CardText } from "reactstrap";

// ** Images
// import illustration from "@src/assets/images/illustration/email.svg";

const CardMeetup = ({ name, themecolor }) => {
  const [currentTime, setCurrentTime] = useState(moment());
 useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);
    return () => clearInterval(intervalId);
  }, [])
  return (
    <div
      className="card-developer-meetup"
      style={{ marginBottom: "2rem", marginLeft: "2rem" }}
    >
      <div>
        <div className="d-flex align-items-center">
          <div className="my-auto ">
            {/* <CardText className="mb-0">Welcome</CardText> */}
            <h4 style={{ color: themecolor, marginBottom: "1.5rem" }}>
              Welcome back, {name}
            </h4>
          </div>
        </div>
        <div className="d-flex">
          <Avatar
            color="defult"
            className="rounded me-1 justify-content-center align-items-center "
            icon={<Calendar size={25} />}
            style={{
              width: "45px",
              color: themecolor,
              backgroundColor: `${themecolor}30`,
            }}
          />
          <div>
            <h5 className="mb-0">{currentTime.format("dddd, MMMM Do YYYY")}</h5>
            <small>{currentTime.format("h:mm:ss a")}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardMeetup;
