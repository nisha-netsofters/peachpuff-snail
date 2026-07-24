import React from 'react'
import { useSelector } from 'react-redux'
import { Progress } from 'reactstrap'

const UploadFileProgressBar = () => {
    const { progress } = useSelector((state) => state)
    return (
        progress?.isUploading &&
        <div className='mt-2'><Progress value={progress?.percentage} >{progress?.percentage}%</Progress></div>
    )
}

export default UploadFileProgressBar