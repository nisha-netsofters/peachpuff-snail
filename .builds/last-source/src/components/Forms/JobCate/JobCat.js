import React from 'react'
import { Row, Col, Input, Label } from 'reactstrap'

const JobCat = ({ jobCat, setCategoryValidation, handleChange = () => { } }) => {

    return (

        <div>
            <Row className="gy-1 pt-75">
                <div>
                    <h4>job Category</h4>
                </div>
                <Col lg={12} xs={12} xl={12}>
                    <div>
                        <Label id="jobCategory">Category<span style={{ color: "red" }}>*</span></Label>
                        <Input
                            id="jobCategory"
                            name="jobCategory"
                            className="w-100"
                            maxLength={200}
                            type="text"
                            placeholder={'Enter Category Name'}
                            value={jobCat?.jobCategory}
                            onChange={(e) => {
                                setCategoryValidation(e.target.value)
                                handleChange(e)
                            }
                            }
                        />
                    </div>
                </Col>

            </Row>
        </div>
    )
}

export default JobCat
