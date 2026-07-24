/* eslint-disable no-console, no-control-regex*/
import React from "react";
import AWS from "aws-sdk";
import actions from "./../redux/fileUploadProgress.js/actions";

const s3 = new AWS.S3({
  region: process.env.REACT_APP_AWS_BUCKET_REGION,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  accessKeyId: process.env.REACT_APP_AWS_ACCESSKEY,
});

const awsUploadAssets = async (file, fileType, dispatch) => {
  dispatch({
    type: actions.SET_PROGRESS,
    payload: {
      image: fileType == "image" ? true : false,
      resume: fileType == "resume" ? true : false,
    },
  });
  const fileName = Date.now() + file.name;
  const options = {
    partSize: 10 * 1024 * 1024, // 5 MB per part
    queueSize: 4, // Number of concurrent parts to upload
  };
  const params = {
    Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
    Body: file,
    Key: "assets/" + fileName,
  };
  await s3
    .upload(params, options)
    .on("httpUploadProgress", (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      dispatch({
        type: actions.SET_PROGRESS,
        payload: {
          percentage: percentCompleted,
          image: fileType == "image" ? true : false,
          resume: fileType == "resume" ? true : false,
        },
      });
      // Update your progress state or perform any other actions with the progress
    })
    .send((err, data) => {
      if (err) {
        console.error("awsUploadAssets error =>", err);
        dispatch({
          type: actions.SET_ERROR,
          payload: {
            error: err?.message || "Upload failed",
            isError: true,
          },
        });
      } else {
        dispatch({
          type: actions.SET_UPLOADLINK,
          payload: {
            uploadedLink: data.Location,
            isUploaded: true,
            percentage: 100,
          },
        });
      }
    });
};

export default awsUploadAssets;

export const awsUploadAssetsWithResp = async (file) => {
  const fileName = Date.now() + file.name;
  const uploadLink = await s3
    .upload({
      Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
      Body: file,
      Key: "assets/" + fileName,
    })
    .promise();

  return uploadLink?.Location
    ? { url: uploadLink?.Location, success: true }
    : { url: null, success: false };
};
