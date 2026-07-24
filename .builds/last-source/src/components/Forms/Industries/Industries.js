import React from 'react'
import { Row, Col, Input, Label } from 'reactstrap'

const IndustriesForm = ({ industriesCategory, setCategoryValidation, handleChange = () => { } }) => {

    return (

        <div>
            <Row className="gy-1 pt-75">
                <div>
                    <h4>Industries</h4>
                </div>
                <Col lg={12} xs={12} xl={12}>
                    <div>
                        <Label id="industries">Industries<span style={{ color: "red" }}>*</span></Label>
                        <Input
                            id="industryCategory"
                            name="industryCategory"
                            className="w-100"
                            type="text"
                            maxLength={200}
                            placeholder={'Enter Category Name'}
                            value={industriesCategory?.industryCategory}
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

export default IndustriesForm
