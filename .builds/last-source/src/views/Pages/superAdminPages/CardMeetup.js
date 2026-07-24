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

const CardMeetup = () => {
  const [currentTime, setCurrentTime] = useState(moment());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <Card className="card-developer-meetup">
      <CardBody>
        <div className="meetup-header d-flex align-items-center">
          <div className="my-auto ">
            {/* <CardText className="mb-0">Welcome</CardText> */}
            <CardTitle tag="h4" className="mb-25">
              Welcome Dhavel Gandhi
            </CardTitle>
          </div>
        </div>
        <div className="d-flex">
          <Avatar
            color="light-primary"
            className="rounded me-1 justify-content-center align-items-center "
            icon={<Calendar size={25} />}
            style={{ width: "45px" }}
          />
          <div>
            <h4 className="mb-0">{currentTime.format("dddd, MMMM Do YYYY")}</h4>
            <small>{currentTime.format("h:mm:ss a")}</small>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CardMeetup;
