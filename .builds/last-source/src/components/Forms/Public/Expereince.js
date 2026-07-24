import { FieldArray, Form, Formik } from 'formik'
import React, { useEffect } from 'react'
import { Button, Col, Input, Label, Row } from 'reactstrap'
import { Plus, X } from 'react-feather'

const initialValues = {
    experience: [
      {
        occupation:"",
        summary:"",
        workduration:"",
        companyName:"",
        companyMobile:"",
        companyAddress:"",
        companyLink:""
      }
    ]
  }
  

export const Expereince = ({candidate, setCandidate}) => {
    return (
        <div>
          <Formik
            initialValues={initialValues}
          >
            {({ values, setFieldValue }) => {
                useEffect(() => {
                setCandidate({...candidate, experience : values.experience})
    
                }, [values])
                return (<>
                    <Form>
                <FieldArray
                  name="experience"
                  render={(experienceArray) => (
                      <>
                        {values.experience.map((edu, index) => (
                            <Row className="gy-1 pt-75" style={{ marginTop: '10px' }}>
                            <Col md={10} xs={6} sm = {6}>
                          <h4>Experience Details</h4>
                        </Col>
                          <Col md={2} xs={6} sm = {6} style = {{ display : "flex", justifyContent : "right"}} >

                            <Button
                              className="btn-icon"
                              color="primary" 
                              onClick={() => {
                                if (values.experience.length !== 1) {

                                experienceArray.remove(index)
                                candidate?.experience?.splice(index, 1)
                                } else alert("please fillup at least one form")
                              }}
                            >
                              <X size={14} className="me-50" />
                              <span className="align-middle ms-25">Delete</span>
                            </Button>
                          </Col>
    
                            <Col md={6} xs={12}>
                              <div>
                                <Label>Occupation / Title</Label>
    
                                <Input
                                  id="occupation"
                                  className="w-100"
                                  type="text" 
                                  placeholder={'Enter Institute'}
                                  value={values?.experience[index]?.occupation}
                                  onChange={(e) => {
                                    setFieldValue(`experience.${index}.occupation`, e.target.value)
                                  }}
                                />
                              </div>
                            </Col>
                            <Col md={6} xs={12}>
                              <div>
                                <Label>Major / summary</Label>
                                <Input
                                  id="summary"
                                  className="w-100"
                                  type="text"
                                  placeholder={'Enter summary'}
                                  value={values?.experience[index]?.summary}
                                  onChange={(e) => {
                                    setFieldValue(`experience.${index}.summary`, e.target.value)
                                  }}
                                />
                              </div>
                            </Col>
                            <Col md={6} xs={12}>
                              <div>
                                <Label>Work Duration in Years</Label>
                                <Input
                                  id="workduration"
                                  className="w-100"
                                  placeholder={'Enter workduration'}
                                  type="number"
                                  value={values?.experience[index]?.workduration}
                                  onChange={(e) => {
                                    setFieldValue(`experience.${index}.workduration`, e.target.value)
                                  }}
                                />
                              </div>
                            </Col>
                          
                            <Col md={6} xs={12}>
                                <div>
                                    <Label>Company Name</Label>
                                    <Input
                                    id="companyName"
                                    className="w-100"
                                    type="text"
                                    placeholder={"Enter Company Name"}

                                    onChange={(e) => {
                                    setFieldValue(`experience.${index}.companyName`, e.target.value)
                                  }
                                  }
                                    />
                                </div>
                            </Col>
                            <Col md={6} xs={12}>
                                <div>
                                    <Label>Company Contact Number</Label>
                                    <Input
                                    id="companyMobile"
                                    className="w-100"
                                    type="number"
                                    placeholder={"Enter company Mobile"}
                                    // value={searchTerm}
                                    onChange={(e) => {
                                    setFieldValue(`experience.${index}.companyMobile`, e.target.value)
                                  }
                                  }
                                    />
                                </div>
                                </Col>
                                <Col md={6} xs={12}>
                                    <div>
                                        <Label>Company Address</Label>
                                        <Input
                                        id="companyAddress"
                                        className="w-100"
                                        placeholder={"Enter Address"}
                                        type="text"
                                        // value={searchTerm}
                                        onChange={(e) => {
                                    setFieldValue(`experience.${index}.companyAddress`, e.target.value)
                                  }
                                  }
                                        />
                                    </div>
                                    </Col>
                            <Col md={6} xs={12}>
                              <div>
                                <Label>Company Link</Label>
                                <Input
                                  id="companyLink"
                                  className="w-100"
                                  placeholder={'Enter Duration'}
                                  type="text"
                                  value={values?.experience[index]?.companyLink}
                                  onChange={(e) => {
                                    setFieldValue(`experience.${index}.companyLink`, e.target.value)
                                  }
                                  }
                                />
                              </div>
                            </Col>
                            <div>
                              <Button
                                className="btn-icon"
                                color="primary"
                                style={{ marginTop: '20px' }}
                                onClick={() => {
                                  experienceArray.push({
                                     occupation:"",
                                      summary:"",
                                      workduration:"",
                                      companyName:"",
                                       companyMobile:"",
                                       companyAddress:"",
                                        companyLink:""
                                  })
                                }
                            }
                              >
                                <Plus size={14} />
                                <span className="align-middle ms-25">Add New</span>
                              </Button>
                             
                            </div>
                          </Row>
                        ))}
                      </>
                    
                  )}
                />
              </Form>
                </>)
            }}
          </Formik>
        </div>
      )
}
