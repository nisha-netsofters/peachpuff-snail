export const buildJobMatchQueryString = (jobOpening = {}) => {
  const params = new URLSearchParams();
  if (jobOpening.page != null) params.set("page", String(jobOpening.page));
  if (jobOpening.perPage != null) params.set("perPage", String(jobOpening.perPage));
  if (jobOpening.sortBy) params.set("sortBy", jobOpening.sortBy);
  if (jobOpening.profileCompletion) {
    params.set("profileCompletion", jobOpening.profileCompletion);
  }
  return params.toString();
};
