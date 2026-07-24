import apiCall from '../../utility/axiosInterceptor'

export const postResumeList = async (payload) => {
    const { page, perPage, status } = payload;
    const queryParams = new URLSearchParams({
        page: page || 1,
        perPage: perPage || 10
    });

    const requestBody = {};
    if (status && status !== 'All') {
        // Map UI status to API format
        const statusMap = {
            'Requested': 'requested',
            'In Review': 'inreview',
            'Completed': 'completed',
            'Rejected': 'rejected'
        };
        requestBody.status = statusMap[status] || status.toLowerCase();
    }

    return await apiCall.post(`/resume-enquiry?${queryParams.toString()}`, requestBody);
};

export const updateResumeStatus = async ({ id, status }) => {
    // status is already in backend format: requested | completed | rejected | inreview
    return await apiCall.put("/resume-enquiry/statusUpdate", {
      id,
      status,
    });
  };