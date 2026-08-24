export const buildJobMatchQueryString = (jobOpening = {}) => {
  const params = new URLSearchParams();
  if (jobOpening.page != null) params.set("page", String(jobOpening.page));
  if (jobOpening.perPage != null) params.set("perPage", String(jobOpening.perPage));
  if (jobOpening.sortBy) params.set("sortBy", jobOpening.sortBy);
  if (jobOpening.matchScore) {
    params.set("matchScore", jobOpening.matchScore);
  }
  if (jobOpening.profileCompletion) {
    params.set("profileCompletion", jobOpening.profileCompletion);
  }
  if (jobOpening.matchDuration) {
    params.set("matchDuration", jobOpening.matchDuration);
  }
  return params.toString();
};
