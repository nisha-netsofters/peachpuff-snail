const getSlug = async () => {
  const slug = await localStorage.getItem("slug");
  return slug;
};
export { getSlug };

export const allAccessEmail = 'uniqueworldjobs@gmail.com'
