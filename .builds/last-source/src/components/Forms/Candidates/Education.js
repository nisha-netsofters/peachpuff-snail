import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, FieldArray } from 'formik'
import { Button, Col, Input, Label, Row } from 'reactstrap'
import { Plus, X } from 'react-feather'

import Select from 'react-select'
import { selectThemeColors } from '@utils'

const initialValues = {
  education: [
    {
      institute: '',
      department: '',
      degree: '',
      english: '',
      eng: '',
      eductionDuration: ''
    }
  ]
}

const Education = ({ setCandidate, candidate, update }) => {
  const [english, setEnglish] = useState([])

  const englishOptions = [
    { value: 'average', id: 'english', label: 'Average' },
    { value: 'medium', id: 'english', label: 'Medium' },
    { value: 'excellent', id: 'english', label: 'Excellent' }
  ]

  return (
    <div>
      <Formik initialValues={initialValues}>
        {({ values, setFieldValue }) => {
          useEffect(() => {
            if (candidate?.education?.length > 0 && update === true) {
              values.education = []
              values.education.pop(0)
              candidate?.education?.map((ele) => {
                const label =
                  ele?.english?.charAt(0)?.toUpperCase() +
                  ele?.english?.slice(1)

                ele.eng = { value: ele?.english, id: 'english', label }
                initialValues.education.push(ele)
              })
            } else {
              values.education = [
                {
                  institute: '',
                  department: '',
                  degree: '',
                  english: '',
                  eng: '',
                  eductionDuration: ''
                }
              ]
            }
          }, [])
          useEffect(() => {
            setCandidate({ ...candidate, education: values.education })
          }, [values])

          return (
            <>
              <Form>
                <FieldArray
                  name="education"
                  render={(educationArray) => (
                    <>
                      {values.education.map((edu, index) => (
                        <Row
                          className="gy-1 pt-75"
                          style={{ marginTop: '10px' }}
                        >


                          <Col md={10} xs={6} sm={6}>
                            <h4>Educational Details</h4>
                          </Col>
                          <Col md={2} xs={6} sm={6} style={{ display: "flex", justifyContent: "right" }} >

                            <Button
                              className="btn-icon"
                              color="primary"
                              onClick={() => {

                                if (values.education.length !== 1) {
                                  educationArray.remove(index)
                                  candidate?.education?.splice(index, 1)
                                  const eng = english?.splice(index, 1)
                                  setEnglish(eng)

                                } else alert("Please FillUp atleast One Education Details")
                              }}
                            >
                              <X size={14} className="me-50" />
                              <span className="align-middle ms-25">Delete</span>
                            </Button>
                          </Col>

                          <Col lg={6} xs={12} xl={4}>
                            <div>
                              <Label>Institute / School</Label>

                              <Input
                                id="institute"
                                className="w-100"
                                type="text"
                                placeholder={'Enter Institute'}
                                value={values?.education[index]?.institute}
                                onChange={(e) => {
                                  setFieldValue(
                                    `education.${index}.institute`,
                                    e.target.value
                                  )
                                }}
                              />
                            </div>
                          </Col>
                          <Col lg={6} xs={12} xl={4}>
                            <div>
                              <Label>Major / Department</Label>
                              <Input
                                id="department"
                                className="w-100"
                                type="text"
                                placeholder={'Enter Department'}
                                value={values?.education[index]?.department}
                                onChange={(e) => {
                                  setFieldValue(
                                    `education.${index}.department`,
                                    e.target.value
                                  )
                                }}
                              />
                            </div>
                          </Col>
                          <Col lg={6} xs={12} xl={4}>
                            <div>
                              <Label>Degree</Label>
                              <Input
                                id="degree"
                                className="w-100"
                                placeholder={'Enter Degree'}
                                type="text"
                                value={values?.education[index]?.degree}
                                onChange={(e) => {
                                  setFieldValue(
                                    `education.${index}.degree`,
                                    e.target.value
                                  )
                                }}
                              />
                            </div>
                          </Col>
                          <Col lg={6} xs={12} xl={4}>
                            <div>
                              <Label>English</Label>
                              <Select
                                id="english"
                                isClearable={false}
                                options={englishOptions}
                                className="react-select"
                                classNamePrefix="select"
                                value={values?.education[index]?.eng}
                                theme={selectThemeColors}
                                onChange={(e) => {
                                  setFieldValue(
                                    `education.${index}.english`,
                                    e.value
                                  )
                                  setFieldValue(`education.${index}.eng`, e)
                                }}
                              />
                            </div>
                          </Col>
                          <Col lg={6} xs={12} xl={4}>
                            <div>
                              <Label>Duration in Years</Label>
                              <Input
                                id="eductionDuration"
                                className="w-100"
                                placeholder={'Enter Duration'}
                                type="number"
                                value={
                                  values?.education[index]?.eductionDuration
                                }
                                onChange={(e) => {
                                  setFieldValue(
                                    `education.${index}.eductionDuration`,
                                    e.target.value
                                  )
                                }}
                              />
                            </div>
                          </Col>
                          <div>
                            <Button
                              className="btn-icon"
                              color="primary"
                              style={{ marginTop: '20px' }}
                              onClick={() => {
                                educationArray.push({
                                  institute: '',
                                  department: '',
                                  degree: '',
                                  english: '',
                                  eductionDuration: ''
                                })
                              }}
                            >
                              <Plus size={14} />
                              <span className="align-middle ms-25">
                                Add New
                              </span>
                            </Button>
                          </div>
                        </Row>
                      ))}
                    </>
                  )}
                />
              </Form>
            </>
          )
        }}
      </Formik>
    </div>
  )
}

export default Education
