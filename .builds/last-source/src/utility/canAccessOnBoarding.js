/** On Boarding: staff roles always; Client only when admin approved (not declined/pending). */
export const canAccessOnBoarding = (user) => {
  const role = user?.role?.name;
  if (!role) return false;
  if (role === "Client") {
    return user?.clients?.action === "approved";
  }
  return ["Admin", "Team Leader", "BDM", "Recruiter", "Staff"].includes(role);
};
