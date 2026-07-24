// redux/resume/action.js
const actions = {
    // Component -> Saga (trigger API call)
    POST_RESUME_LIST: "POST_RESUME_LIST",
  
    // Saga -> Reducer (save API response)
    SET_RESUME_LIST: "SET_RESUME_LIST",
  
    // Loader flag
    POST_RESUME_LIST_LOADER: "POST_RESUME_LIST_LOADER",

    UPDATE_RESUME_STATUS: "UPDATE_RESUME_STATUS",           // request (component -> saga)
    UPDATE_RESUME_STATUS_SUCCESS: "UPDATE_RESUME_STATUS_SUCCESS", // success (saga -> reducer)
    UPDATE_RESUME_STATUS_LOADER: "UPDATE_RESUME_STATUS_LOADER",
  };
  
  export default actions;
  