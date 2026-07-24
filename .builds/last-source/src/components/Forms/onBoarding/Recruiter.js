import React, { useEffect, useState } from 'react'
import { Col, Label, Row } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '../../../utility/Utils'

const Recruiter = ({ onBoarding,
    setOnBoarding,
    isRecruiter,

    users,
    handleChange = () => { }
}) => {

    const [selectTempUser, setSelectTempUser] = useState()
    const [status, setStatus] = useState()

    const statusOptions = [
        { value: 'newCV', id: "status", label: 'New CV' },
        { value: 'following', id: "status", label: 'Following' },
        { value: 'hold', id: "status", label: 'Hold' },
        { value: 'fullField', id: "status", label: 'fullField' },
        { value: 'sideBySide', id: "status", label: 'Side By Side' }
    ]

    useEffect(() => {
        if (onBoarding?.users?.name !== undefined) {
            setSelectTempUser({ label: onBoarding?.users?.name })
        }
        if (onBoarding?.status !== undefined) {
            let label = 'New CV'
            const value = onBoarding?.status
            if (value === "following") label = "Following"
            if (value === 'hold') label = 'Hold'
            if (value === 'fullField') label = 'fullField'
            if (value === 'sideBySide') label = 'Side By Side'
            setStatus({ value, label, id: 'status' })
        }
    }, [onBoarding])


    return (
        <Row className="gy-1 pt-75">

            <Col lg={6} xs={12} xl={4}>
                <Label for="role-select">Select Recruiter<span style={{ color: "red" }}>*</span> </Label>
                <Select
                    isDisabled={isRecruiter}
                    id='recruiterId'
                    value={selectTempUser}
                    placeholder='Select Recruiter'
                    options={users?.filter(ele => {
                        ele.label = ele.name 
                        ele.value = ele.id
                        return ele
                    })}
                    className="react-select"
                    classNamePrefix="select"
                    theme={selectThemeColors}
                    onChange={(e) => {
                        setSelectTempUser(e)
                        setOnBoarding({ ...onBoarding, userId: e.id })
                    }}
                />
            </Col>
            <Col lg={6} xs={12} xl={4}>
                <Label for="role-select">Status<span style={{ color: "red" }}>*</span></Label>
                <Select
                    id='status'
                    value={status}
                    placeholder='Select Status'
                    options={statusOptions}
                    className="react-select"
                    classNamePrefix="select"
                    theme={selectThemeColors}
                    onChange={(e) => {
                        setStatus(e)
                        handleChange(e)
                    }}
                />
            </Col>
        </Row>
    )
}

export default Recruiter