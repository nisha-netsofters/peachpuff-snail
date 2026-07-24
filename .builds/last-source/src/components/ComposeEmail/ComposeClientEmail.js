
// import { Editor } from 'react-draft-wysiwyg'
import Select, { components } from 'react-select'
import React, { Component, useState, useEffect } from 'react'
import { EditorState, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
// import htmlToDraft from 'html-to-draftjs'
import { Minus, X, Maximize2, Paperclip, Share } from 'react-feather'
import {
    Form,
    Label,
    Input,
    Modal,
    Button,
    ModalBody
} from 'reactstrap'

import { selectThemeColors } from '@utils'
import '@styles/react/libs/editor/editor.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import { useDispatch, useSelector } from 'react-redux'

import Loader from './../Dialog/Loader'
import { toast } from 'react-toastify'
import actions from '../../redux/candidate/actions'

const ComposeClientEmail = ({ composeOpen, toggleCompose }) => {
    const { selectedClient } = useSelector(state => state.client)
    console.log('---------------------');
    console.log('selectedClient =>', selectedClient);
    console.log('---------------------');
    const { isSent, isNotSent } = useSelector(state => state.client)
  
    const [subject, setSubject] = useState("")
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [html, setHtml] = useState(null)
    const [value, setValue] = useState(EditorState.createEmpty())
    useEffect(() => {
        if (isSent === true) {
            toggleCompose()
            setLoading(false)
            setTimeout(() => {
                dispatch({
                    type: actions.IS_SENT,
                    payload: false
                })
            }, 200)
        }
        if (isNotSent) {
            toast.warn("Something went wrong")
            setLoading(false)
        }
    }, [isSent, isNotSent])


    const togglePopUp = e => {
        toggleCompose()
        setSubject()
        e.preventDefault()
    }

    const SelectComponent = ({ data, ...props }) => {
        return (
            <components.Option {...props}>
                <div className='d-flex flex-wrap align-items-center'>
                    {data.label}
                </div>
            </components.Option>
        )
    }
    const onSubmit = () => {
        if (subject?.length < 2) toast.error("Enter Subject")
        else {
            setLoading(true)
            const mails = selectedClient?.mails?.map((ele) => ele.email)
            dispatch({
                type: actions.SEND_MAIL_TO_SELECTED_CANDIDATES,
                payload: { mails, subject, html }
            })
        }
    }
    return (

        <Modal
            scrollable
            fade={false}
            keyboard={false}
            backdrop={true}
            id='compose-mail'
            className='modal-xl'
            isOpen={composeOpen}
            contentClassName='p-1'
            toggle={toggleCompose}
        >
            <Loader loading={loading} />
            <div className='modal-header'>
                <h5 className='modal-title'>Compose Mail</h5>
                <div className='modal-actions'>
                    <a href='/' className='text-body' onClick={togglePopUp}>
                        <X size={14} />
                    </a>
                </div>
            </div>
            <ModalBody className='flex-grow-1 p-0'>
                <Form className='compose-form' onSubmit={e => e.preventDefault()}>
                    {/* <Button onClick={exportHtml} color="secondary" caret outline>
                        <Share className="font-small-4 me-50" />
                        <span className="align-middle">Export Email Template</span>
                    </Button> */}
                    <div className='compose-mail-form-field mt-1'>
                        <Label for='email-to' className='form-label'>
                            To: {selectedClient?.totalRows} Selected
                        </Label>
                        <div className='flex-grow-1'>
                            <Select
                                isMulti
                                id='email-to'
                                value={selectedClient?.mails}
                                isClearable={false}
                                theme={selectThemeColors}
                                className='react-select select-borderless react-selectformails'
                                classNamePrefix='select'
                                components={{ Option: SelectComponent }}
                            />

                        </div>

                    </div>

                    <div className='compose-mail-form-field mt-1'>
                        <Label for='email-subject' className='form-label'>
                            Subject:
                        </Label>
                        <Input id='email-subject' placeholder='Subject' value={subject} onChange={(e) => setSubject(e.target.value)} />
                    </div>
                    <div className='mt-1'>
                        <Editor
                            editorState={value}
                            wrapperClassName="demo-wrapper"
                            editorClassName="demo-editor"
                            onEditorStateChange={data => {
                                setValue(data)
                                setHtml(draftToHtml(convertToRaw(data.getCurrentContent())))

                            }}

                        />

                    </div>
                    <div className='compose-footer-wrapper mt-1'>
                        <div className='btn-wrapper d-flex align-items-center'>
                            <Button color='primary' onClick={onSubmit}>
                                Send
                            </Button>
                            {/* <div className='email-attachement'>
                                <Label className='mb-0' for='attach-email-item'>
                                    <Paperclip className='cursor-pointer ms-50' size={18} />
                                    <input type='file' name='attach-email-item' id='attach-email-item' hidden />
                                </Label>
                            </div> */}
                        </div>

                    </div>
                </Form>
            </ModalBody>
        </Modal>
    )
}

export default ComposeClientEmail