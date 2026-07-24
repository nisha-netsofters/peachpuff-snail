// ** Custom Components
import Avatar from "@components/avatar";

// ** Icons Imports
import * as Icon from "react-feather";

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";

import { Scrollbars } from "react-custom-scrollbars";

import default_Avtar from "../../../assets/images/avatars/avatar-blank.png";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import actions from "../../../redux/candidate/actions";
import moment from "moment";
const slug = localStorage.getItem("slug");
const CandidateCard = ({ title, candidate }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const onHandleClick = (item) => {
    dispatch({
      type: actions.SET_CANDIDATE,
      payload: item,
    });
    history.push(`/${slug}/candidate?id=${item.id}`);
  };
  const renderTransactions = () => {
    return candidate?.map((item) => {
      return (
        <div
          key={item.id}
          className="transaction-item mb-2"
          style={{ cursor: "pointer" }}
          onClick={() => onHandleClick(item)}
        >
          <div className="d-flex">
            <Avatar
              img={item?.image ? item?.image : default_Avtar}
              imgHeight="42"
              imgWidth="42"
            />
            <div>
              <h6 className="transaction-title">{item?.firstname}</h6>
              <small>{item?.professional?.jobCategory?.jobCategory}</small>
            </div>
          </div>
          <small>{moment(item?.created_at).format("DD-MM-Y")}</small>
        </div>
      );
    });
  };

  return (
    <Card className="card-transaction" style={{ height: "500px" }}>
      <CardHeader>
        <CardTitle tag="h4">{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <Scrollbars style={{ height: "100%" }} autoHide>
          {renderTransactions()}
        </Scrollbars>
      </CardBody>
    </Card>
  );
};

export default CandidateCard;
