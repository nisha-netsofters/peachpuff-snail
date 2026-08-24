export const QUALIFICATION_HELD_OPTIONS = [
  {
    value: "under graduate",
    id: "highestQualification",
    label: "Under Graduate",
  },
  { value: "graduation", id: "highestQualification", label: "Graduation" },
  {
    value: "post graduate",
    id: "highestQualification",
    label: "Post Graduate",
  },
];

export const qualificationSelectOptions = (fieldId = "highestQualification") =>
  QUALIFICATION_HELD_OPTIONS.map((item) => ({
    ...item,
    id: fieldId,
  }));

export const qualificationLabel = (value) =>
  QUALIFICATION_HELD_OPTIONS.find((o) => o.value === value)?.label ||
  value ||
  "-";
