import React from "react";
import { toast } from "react-toastify";

export const tostify = (msg, error) => {
  error = true;
  toast.error(
    <>
      <div className="toastify-body">
        <ul className="list-unstyled mb-0">
          <li key={1}>{msg}</li>
        </ul>
      </div>
    </>,
    { icon: true, hideProgressBar: true }
  );
  return error;
};

export const tostifySuccess = (msg) => {
  toast.success(
    <>
      <div className="toastify-body">
        <ul className="list-unstyled mb-0">
          <li key={1}>{msg}</li>
        </ul>
      </div>
    </>,
    { icon: true, hideProgressBar: true }
  );
};
export const tostifyInfo = (msg) => {

  toast.info(
    <>
      <div className="toastify-body">
        <ul className="list-unstyled mb-0">
          <li key={1}>{msg}</li>
        </ul>
      </div>
    </>,
    { icon: true, hideProgressBar: true }
  );
};

export const tostifyError = (msg) => {
  toast.error(
    <>
      <div className="toastify-body">
        <ul className="list-unstyled mb-0">
          <li key={1}>{msg}</li>
        </ul>
      </div>
    </>,
    { icon: true, hideProgressBar: true }
  );
};
