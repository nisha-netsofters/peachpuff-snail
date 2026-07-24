// ** Custom Components
import Avatar from '@components/avatar'

// ** Icons Imports
import * as Icon from 'react-feather'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Badge } from 'reactstrap'

import { Scrollbars } from 'react-custom-scrollbars'

import default_Avtar from "../../../assets/images/avatars/avatar-blank.png"
import moment from 'moment'
// import { useDispatch } from 'react-redux'
// import { useHistory } from 'react-router-dom'
// import actions from "../../../redux/interview/actions"

const TodayInterview = ({ title, todaysInterview }) => {

    // const dispatch = useDispatch()
    // const history = useHistory()
    // const onHandleClick = (item) => {
    //     dispatch({
    //         type: actions.SET_INTERVIEW,
    //         payload: item
    //     })
    //     history.push(`/interview?id=${item.id}`)
    // }

    const renderTransactions = () => {
        return todaysInterview?.map(item => {
            return (
              <div key={item?.id} className="transaction-item mb-2">
                <div className="d-flex">
                  {/* <Avatar className='rounded' color={item.color} icon={<item.Icon size={18} />} /> */}
                  <Avatar
                    img={
                      item?.candidate?.image
                        ? item?.candidate?.image
                        : default_Avtar
                    }
                    imgHeight="42"
                    imgWidth="42"
                  />
                  <div>
                    <h6 className="transaction-title">
                      {item?.candidate?.firstname}
                    </h6>
                    <small>
                      Interview Time : {moment(item?.time).format("LT")}
                    </small>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <small>
                    <Badge
                      Badge
                      pill
                      color={"light-info"}
                      className="column-action d-flex align-items-center"
                    >
                      {item?.candidate?.interviewStatus}
                    </Badge>
                  </small>
                  <small>{moment(item?.createdAt).format("DD-MM-Y")}</small>
                </div>
              </div>
            );
        })
    }

    return (
        <Card className='card-transaction' style={{ height: "500px" }}>
            <CardHeader>
                <CardTitle tag='h4'>{title}</CardTitle>
            </CardHeader>
            <CardBody>
                <Scrollbars style={{ height: "100%" }} autoHide>
                    {renderTransactions()}
                </Scrollbars>
            </CardBody>
        </Card>
    )
}

export default TodayInterview
