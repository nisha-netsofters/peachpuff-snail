import React, { useMemo, useState } from "react";
import { Button, Col, Input, Label, Row, Spinner } from "reactstrap";
import { toast } from "react-toastify";
import { generateJobDescriptionAPI } from "../../../apis/jobOpening";

const AI_ACTIONS = [
  { key: "generate", label: "Generate" },
  { key: "regenerate", label: "Regenerate" },
  { key: "improve", label: "Improve" },
  { key: "short", label: "Short Version" },
  { key: "professional", label: "Professional Version" },
];

const FIELD_MAP = [
  { key: "jobSummary", label: "Job Summary", formKey: "jobSummary", type: "textarea" },
  {
    key: "responsibilities",
    label: "Responsibilities",
    formKey: "keyRole",
    type: "textarea",
  },
  {
    key: "requiredSkills",
    label: "Required Skills",
    formKey: "basicSkill",
    type: "textarea",
  },
  {
    key: "preferredSkills",
    label: "Preferred Skills",
    formKey: "preferredSkills",
    type: "textarea",
  },
  {
    key: "qualification",
    label: "Qualification (AI text)",
    formKey: "aiQualification",
    type: "textarea",
  },
  { key: "benefits", label: "Benefits", formKey: "benefits", type: "textarea" },
  {
    key: "companyOverview",
    label: "Company Overview",
    formKey: "companyOverview",
    type: "textarea",
  },
  {
    key: "callToAction",
    label: "Call to Action",
    formKey: "callToAction",
    type: "textarea",
  },
];

/**
 * Build AI request payload from current job opening form values.
 */
const buildAiPayload = (jobOpening, action, industriesLabel) => {
  const salary =
    jobOpening?.salary ||
    (jobOpening?.salaryRangeStart && jobOpening?.salaryRangeEnd
      ? `${jobOpening.salaryRangeStart} to ${jobOpening.salaryRangeEnd}`
      : "");

  return {
    action,
    jobTitle: jobOpening?.designation || "",
    experience: jobOpening?.minExperienceYears || "",
    skills: jobOpening?.basicSkill || "",
    industry: industriesLabel || "",
    location: jobOpening?.jobLocation || "",
    employmentType: jobOpening?.employmentType || jobOpening?.workType || "",
    salary,
    existingContent: {
      jobSummary: jobOpening?.jobSummary || "",
      responsibilities: jobOpening?.keyRole || jobOpening?.jobDescription || "",
      requiredSkills: jobOpening?.basicSkill || "",
      preferredSkills: jobOpening?.preferredSkills || "",
      qualification: jobOpening?.aiQualification || jobOpening?.qualification || "",
      benefits: jobOpening?.benefits || "",
      companyOverview: jobOpening?.companyOverview || "",
      callToAction: jobOpening?.callToAction || "",
    },
  };
};

const AiJobDescriptionPanel = ({
  jobOpening,
  setJobOpening,
  industriesLabel = "",
  themecolor,
  disabled = false,
}) => {
  const [loadingAction, setLoadingAction] = useState(null);
  const hasGeneratedContent = useMemo(
    () =>
      Boolean(
        jobOpening?.jobSummary ||
          jobOpening?.keyRole ||
          jobOpening?.preferredSkills ||
          jobOpening?.benefits ||
          jobOpening?.companyOverview ||
          jobOpening?.callToAction ||
          jobOpening?.jobDescription
      ),
    [jobOpening]
  );

  const applyGeneratedData = (data) => {
    if (!data) return;
    const composedDescription =
      data.fullDescription ||
      [
        data.jobSummary && `Job Summary\n${data.jobSummary}`,
        data.responsibilities && `Responsibilities\n${data.responsibilities}`,
        data.requiredSkills && `Required Skills\n${data.requiredSkills}`,
        data.preferredSkills && `Preferred Skills\n${data.preferredSkills}`,
        data.qualification && `Qualification\n${data.qualification}`,
        data.benefits && `Benefits\n${data.benefits}`,
        data.companyOverview && `Company Overview\n${data.companyOverview}`,
        data.callToAction && `Call to Action\n${data.callToAction}`,
      ]
        .filter(Boolean)
        .join("\n\n");

    setJobOpening({
      ...jobOpening,
      jobSummary: data.jobSummary || "",
      keyRole: data.responsibilities || jobOpening?.keyRole || "",
      basicSkill: data.requiredSkills || jobOpening?.basicSkill || "",
      preferredSkills: data.preferredSkills || "",
      aiQualification: data.qualification || "",
      benefits: data.benefits || jobOpening?.benefits || "",
      companyOverview: data.companyOverview || "",
      callToAction: data.callToAction || "",
      jobDescription: composedDescription || jobOpening?.jobDescription || "",
      other: data.benefits || jobOpening?.other || "",
    });
  };

  const handleGenerate = async (action) => {
    if (disabled) return;

    if (!String(jobOpening?.designation || "").trim()) {
      toast.error("Please enter Designation / Job Title before generating.");
      return;
    }

    if (
      (action === "improve" || action === "short" || action === "professional") &&
      !hasGeneratedContent &&
      !String(jobOpening?.keyRole || "").trim()
    ) {
      toast.error("Generate a job description first, then use Improve / Short / Professional.");
      return;
    }

    setLoadingAction(action);
    try {
      const payload = buildAiPayload(jobOpening, action, industriesLabel);
      const res = await generateJobDescriptionAPI(payload);
      // axios interceptor already unwraps resp.data → body is { success, data, error }
      const body = res?.success !== undefined ? res : res?.data;
      if (body?.success && body?.data) {
        applyGeneratedData(body.data);
        toast.success(
          action === "generate"
            ? "Job description generated."
            : `Job description updated (${AI_ACTIONS.find((a) => a.key === action)?.label}).`
        );
      } else {
        toast.error(
          body?.error || body?.msg || "Failed to generate job description."
        );
      }
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.msg ||
        err?.message ||
        "Failed to generate job description.";
      toast.error(msg);
    } finally {
      setLoadingAction(null);
    }
  };

  const updateField = (formKey, value) => {
    setJobOpening({
      ...jobOpening,
      [formKey]: value,
    });
  };

  return (
    <Row className="gy-1 pt-75 mt-1">
      <Col xs={12}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div>
            <h4 className="mb-25">AI Assisted Job Description</h4>
            <small className="text-muted">
              Uses Job Title, Experience, Skills, Industry, Location, Work Type and Salary.
              Generated text stays editable.
            </small>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {AI_ACTIONS.map((btn) => (
              <Button
                key={btn.key}
                type="button"
                size="sm"
                disabled={disabled || Boolean(loadingAction)}
                color={btn.key === "generate" ? "primary" : "secondary"}
                outline={btn.key !== "generate"}
                style={
                  btn.key === "generate" && themecolor
                    ? { backgroundColor: themecolor, borderColor: themecolor, color: "#fff" }
                    : undefined
                }
                onClick={() => handleGenerate(btn.key)}
              >
                {loadingAction === btn.key ? (
                  <>
                    <Spinner size="sm" className="me-50" /> Working…
                  </>
                ) : (
                  btn.label
                )}
              </Button>
            ))}
          </div>
        </div>
      </Col>

      {FIELD_MAP.map((field) => (
        <Col lg={6} xs={12} key={field.key}>
          <Label>{field.label}</Label>
          <Input
            disabled={disabled}
            type="textarea"
            rows={field.key === "jobSummary" || field.key === "responsibilities" ? 4 : 3}
            value={jobOpening?.[field.formKey] || ""}
            placeholder={`AI will fill ${field.label}`}
            onChange={(e) => updateField(field.formKey, e.target.value)}
          />
        </Col>
      ))}

      <Col xs={12}>
        <Label>Full Job Description (combined)</Label>
        <Input
          disabled={disabled}
          type="textarea"
          rows={6}
          value={jobOpening?.jobDescription || ""}
          placeholder="Combined job description (auto-filled by AI, editable)"
          onChange={(e) =>
            setJobOpening({ ...jobOpening, jobDescription: e.target.value })
          }
        />
      </Col>
    </Row>
  );
};

export default AiJobDescriptionPanel;
