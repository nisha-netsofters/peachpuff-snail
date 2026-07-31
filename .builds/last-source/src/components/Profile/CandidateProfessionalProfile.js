// Candidate self-profile: professional information section
// Uses existing Candidates -> Professional form but scoped for logged-in candidate
import React, { useState, useEffect, useMemo, useRef } from "react";
import { CardBody, Row, Col, Button, Input, Label, Alert } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import Professional from "../Forms/Candidates/Professional";
import candidateActions from "../../redux/candidate/actions";
import industriesActions from "../../redux/industries/actions";
import jobCategoryActions from "../../redux/jobCategory/actions";
import { tostify } from "../Tostify";
import { awsUploadAssetsWithResp } from "../../helper/awsUploadAssets";
import {
  getUnfilledCandidateFields,
  getUnfilledFieldKeySet,
  getUnfilledInputStyle,
  PROFILE_PAGE_EXCLUDED_KEYS,
} from "../../utility/unfilledProfileFields";

const CandidateProfessionalProfile = () => {
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const dispatch = useDispatch();
  const candidateProfile = useSelector((state) => state?.candidate?.candidateProfile);
  const isLoading = useSelector((state) => state?.candidate?.getCandidateProfileLoader);
  // const industries = useSelector((state) => {
  //   // Industries reducer might return the payload directly or as results array
  //   const industriesState = state?.industries;
  //   if (Array.isArray(industriesState)) {
  //     return industriesState;
  //   }
  //   return industriesState?.results || industriesState || [];
  // });

  // Local candidate state for this section
  const [candidate, setCandidate] = useState({ professional: {} });
  const [industriesData, setIndustriesData] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [isResumeUploading, setIsResumeUploading] = useState(false);
  const [showResumeFileName, setShowResumeFileName] = useState(true);
  // Latest Formik professional values (avoids save race with useEffect sync)
  const latestProfessionalValuesRef = useRef({});

  // Fetch candidate profile data on mount
  useEffect(() => {
    dispatch({
      type: candidateActions.GET_CANDIDATE_PROFILE,
    });
  }, [dispatch]);

  // Fetch all industries and job categories on mount
  useEffect(() => {
    dispatch({
      type: industriesActions.GET_ALL_INDUSTRIES,
    });
    dispatch({
      type: jobCategoryActions.GET_ALL_JOBCAT,
    });
  }, [dispatch]);

  // Populate candidate data when profile is loaded
  useEffect(() => {
    if (candidateProfile && (candidateProfile.id || candidateProfile._id)) {
      const professionalData = candidateProfile?.professional || {};
      const industriesRelation = candidateProfile?.industries_relation || [];

      // Map industries_relation to industriesData format expected by Professional form
      // The form expects: { industries: { industryCategory, id }, value, label }
      const mappedIndustries = industriesRelation.map((rel) => ({
        industries: {
          id: rel?.industries?.id || rel?.industriesId,
          industryCategory: rel?.industries?.industryCategory,
        },
        id: rel?.industries?.id || rel?.industriesId,
        industryCategory: rel?.industries?.industryCategory,
        label: rel?.industries?.industryCategory,
        value: rel?.industries?.id || rel?.industriesId,
        c_Id: rel?.cId || candidateProfile._id,
      }));

      setIndustriesData(mappedIndustries);

      // Ensure all string fields are properly converted to strings
      const ensureString = (val) => (val !== null && val !== undefined ? String(val) : "");

      // Set candidate data with professional information
      // Prefer business `id` (update API uses Candidates.updateOne({ id }))
      setCandidate({
        ...candidateProfile,
        id: candidateProfile.id || candidateProfile._id,
        _id: candidateProfile._id,
        professional: {
          ...professionalData,
          // Ensure all fields are strings for form validation
          experienceInyear: ensureString(professionalData.experienceInyear),
          highestQualification: ensureString(professionalData.highestQualification),
          field: ensureString(professionalData.field),
          designation: ensureString(professionalData.designation),
          currentEmployer: ensureString(professionalData.currentEmployer),
          currentCompany: ensureString(
            professionalData.currentCompany || professionalData.currentEmployer
          ),
          currentSalary: ensureString(professionalData.currentSalary),
          expectedsalary: ensureString(professionalData.expectedsalary || professionalData.expectedSalary),
          noticePeriod: ensureString(professionalData.noticePeriod),
          currentlyWorking: ensureString(professionalData.currentlyWorking),
          english: ensureString(professionalData.english),
          preferedJobLocation: ensureString(professionalData.preferedJobLocation),
          course: ensureString(professionalData.course),
          skill: ensureString(professionalData.skill),
          // Ensure jobCategoryId is a string
          jobCategoryId: ensureString(
            professionalData.jobCategoryId ||
            professionalData.jobCategory?._id ||
            professionalData.jobCategory?.id ||
            professionalData.jobCategory
          ),
          // Map jobCategory object
          jobCategory: professionalData.jobCategory || {},
        },
      });
      latestProfessionalValuesRef.current = {};
    }
  }, [candidateProfile]);

  // resume change handler
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        tostify("Please upload a PDF file only", false);
        return;
      }
      setResumeFile(file);
      setShowResumeFileName(false);
    }
  };

  // save professional details
  const handleSaveProfessional = async () => {
    if (!candidate?.id && !candidate?._id) {
      return;
    }

    // Validate that at least one industry is selected
    const hasIndustries =
      Array.isArray(candidate?.industries_relation) &&
      candidate.industries_relation.length > 0;

    if (!hasIndustries) {
      tostify("Please Select Industries", false);
      return;
    }

    try {
      console.log("DEBUG: Saving candidate professional...", candidate);
      console.log("DEBUG: Professional data to be sent:", candidate.professional);
      setIsResumeUploading(true);

      // Handle resume upload if a new file is selected
      let resumeUrl = candidate.resume; // Keep existing resume URL
      if (resumeFile) {
        const uploadResp = await awsUploadAssetsWithResp(resumeFile);
        if (uploadResp.success && uploadResp.url) {
          resumeUrl = uploadResp.url;
        } else {
          tostify("Failed to upload resume. Please try again.", false);
          setIsResumeUploading(false);
          return;
        }
      }

      // Prepare FormData similar to how it's done in CandidateListPage
      const fm = new FormData();
      // Always use business candidate id for update API (`Candidates.updateOne({ id })`)
      const candidateId =
        candidateProfile?.id || candidate.id || candidate._id;

      // Add basic candidate fields (preserve existing data)
      if (candidate.firstname) fm.append("firstname", candidate.firstname);
      if (candidate.lastname) fm.append("lastname", candidate.lastname);
      if (candidate.mobile) fm.append("mobile", candidate.mobile);
      if (candidate.email) fm.append("email", candidate.email);
      if (candidate.street) fm.append("street", candidate.street);
      if (candidate.city) fm.append("city", candidate.city);
      if (candidate.state) fm.append("state", candidate.state);
      if (candidate.zip) fm.append("zip", candidate.zip);
      if (candidate.cityId) fm.append("cityId", candidate.cityId);
      if (candidate.stateId) fm.append("stateId", candidate.stateId);
      if (candidate.alternateMobile) fm.append("alternateMobile", candidate.alternateMobile);
      if (candidate.gender) fm.append("gender", candidate.gender);
      if (candidate.certifications) {
        fm.append("certifications", candidate.certifications);
      }
      // Add resume URL if it exists or was uploaded
      if (resumeUrl) {
        fm.append("resume", resumeUrl);
      }

      // Merge latest Formik values so save is not missing the last typed fields.
      // Skip empty Formik values so we never wipe already-saved fields.
      const formikProfessional = latestProfessionalValuesRef.current || {};
      const cleanedFormik = {};
      Object.keys(formikProfessional).forEach((key) => {
        const val = formikProfessional[key];
        if (val === undefined || val === null) return;
        if (val === "Current Monthly Salary + 20%") return;
        if (key === "jobCategory") return;
        if (typeof val === "string" && !val.trim()) return;
        cleanedFormik[key] = val;
      });
      const professionalPayload = {
        ...(candidate.professional || {}),
        ...cleanedFormik,
      };
      // Drop UI-only placeholders
      Object.keys(professionalPayload).forEach((key) => {
        if (professionalPayload[key] === "Current Monthly Salary + 20%") {
          delete professionalPayload[key];
        }
      });

      // Backend expects 'jobCategory' to be the ID string when possible
      if (professionalPayload.jobCategoryId) {
        professionalPayload.jobCategory = professionalPayload.jobCategoryId;
      } else if (typeof professionalPayload.jobCategory === "object") {
        professionalPayload.jobCategory =
          professionalPayload.jobCategory?.id ||
          professionalPayload.jobCategory?._id ||
          professionalPayload.jobCategory;
      }

      // Keep employer/company aliases in sync for older readers
      if (professionalPayload.currentEmployer && !professionalPayload.currentCompany) {
        professionalPayload.currentCompany = professionalPayload.currentEmployer;
      } else if (professionalPayload.currentCompany && !professionalPayload.currentEmployer) {
        professionalPayload.currentEmployer = professionalPayload.currentCompany;
      }

      fm.append("professional", JSON.stringify(professionalPayload));

      // Industries relation should be sent as JSON string
      if (candidate.industries_relation && candidate.industries_relation.length > 0) {
        // Always send only industriesId for each relation to avoid duplicate payload data
        const formattedIndustries = candidate.industries_relation
          .map((rel) => {
            const industriesId =
              rel?.industriesId ||
              rel?.industries?.id ||
              rel?.value ||
              rel;
            return industriesId ? { industriesId } : null;
          })
          .filter(Boolean);

        if (formattedIndustries.length > 0) {
          fm.append("industries_relation", JSON.stringify(formattedIndustries));
        }
      }

      // Ensure id is set
      fm.append("id", candidateId);

      dispatch({
        type: candidateActions.UPDATE_CANDIDATE,
        payload: {
          id: candidateId,
          data: fm,
          refreshProfile: true, // Flag to refresh profile instead of candidate list
        },
      });

      // Optimistically keep local form state with what we just saved
      setCandidate((prev) => ({
        ...prev,
        id: candidateId,
        professional: {
          ...(prev.professional || {}),
          ...professionalPayload,
        },
      }));

      // Reset resume file state after successful save
      setResumeFile(null);
      setShowResumeFileName(true);
      setIsResumeUploading(false);
    } catch (error) {
      console.error("Error updating professional details:", error);
      tostify("Error updating profile. Please try again.", false);
      setIsResumeUploading(false);
    }
  };

  // reset resume file state when candidate profile updates (after save)
  useEffect(() => {
    if (candidateProfile?.resume && !resumeFile) {
      setShowResumeFileName(true);
    }
  }, [candidateProfile?.resume, resumeFile]);

  // don't render form until we have candidate data with id
  const hasCandidateData = candidate?.id || candidate?._id;

  const unfilledFields = useMemo(
    () =>
      hasCandidateData
        ? getUnfilledCandidateFields(candidate, {
            excludeKeys: PROFILE_PAGE_EXCLUDED_KEYS,
          })
        : [],
    [candidate, hasCandidateData]
  );
  const unfilledKeys = useMemo(
    () =>
      hasCandidateData
        ? getUnfilledFieldKeySet(candidate, {
            excludeKeys: PROFILE_PAGE_EXCLUDED_KEYS,
          })
        : new Set(),
    [candidate, hasCandidateData]
  );
  const isUnfilled = (key) => unfilledKeys.has(key);

  return (
    <CardBody className="pt-0">
      <Row className="mt-3">
        <Col xs="12">
          <h4 className="mb-1">Other Details & Professional Information</h4>
          <p className="text-muted mb-2">
            View and update your contact, address and professional details. These
            details are used when recruiters/clients view your profile.
          </p>
          {unfilledFields.length > 0 ? (
            <Alert color="danger" className="mb-2">
              <strong>Please complete the highlighted fields:</strong>{" "}
              {unfilledFields.map((f) => f.label).join(", ")}
            </Alert>
          ) : null}
        </Col>
      </Row>

      {isLoading ? (
        <div className="text-center py-4">
          <p>Loading profile information...</p>
        </div>
      ) : hasCandidateData ? (
        <>
          {/* Other Details (Address) Section */}
          <Row className="mt-2">
            <Col xs="12">
              <h5 className="mb-2">Other Details</h5>
            </Col>

            <Col lg={6} xs={12} className="mb-1">
              <Label className="form-label">Street Address</Label>
              <Input
                type="text"
                value={candidate?.street || ""}
                onChange={(e) =>
                  setCandidate((prev) => ({
                    ...prev,
                    street: e.target.value,
                  }))
                }
                className="w-100"
                maxLength={200}
                invalid={isUnfilled("currentAddress")}
                style={getUnfilledInputStyle(isUnfilled("currentAddress"))}
              />
            </Col>

            <Col lg={6} xs={12} className="mb-1">
              <Label className="form-label">City</Label>
              <Input
                type="text"
                value={candidate?.city || ""}
                onChange={(e) =>
                  setCandidate((prev) => ({
                    ...prev,
                    city: e.target.value,
                  }))
                }
                className="w-100"
                maxLength={100}
                invalid={isUnfilled("city")}
                style={getUnfilledInputStyle(isUnfilled("city"))}
              />
            </Col>

            <Col lg={6} xs={12} className="mb-1">
              <Label className="form-label">State</Label>
              <Input
                type="text"
                value={candidate?.state || ""}
                onChange={(e) =>
                  setCandidate((prev) => ({
                    ...prev,
                    state: e.target.value,
                  }))
                }
                className="w-100"
                maxLength={100}
                invalid={isUnfilled("state")}
                style={getUnfilledInputStyle(isUnfilled("state"))}
              />
            </Col>

            <Col lg={6} xs={12} className="mb-1">
              <Label className="form-label">ZIP Code</Label>
              <Input
                type="text"
                value={candidate?.zip || ""}
                onChange={(e) =>
                  setCandidate((prev) => ({
                    ...prev,
                    zip: e.target.value.replace(/\D/g, ""),
                  }))
                }
                className="w-100"
                maxLength={10}
              />
            </Col>

            <Col lg={6} xs={12} className="mb-1">
              <Label className="form-label">City ID</Label>
              <Input
                type="text"
                value={candidate?.cityId || ""}
                onChange={(e) =>
                  setCandidate((prev) => ({
                    ...prev,
                    cityId: e.target.value,
                  }))
                }
                className="w-100"
                maxLength={100}
              />
            </Col>

            <Col lg={6} xs={12} className="mb-1">
              <Label className="form-label">State ID</Label>
              <Input
                type="text"
                value={candidate?.stateId || ""}
                onChange={(e) =>
                  setCandidate((prev) => ({
                    ...prev,
                    stateId: e.target.value,
                  }))
                }
                className="w-100"
                maxLength={10}
              />
            </Col>

            <Col lg={6} xs={12} className="mb-1">
              <Label className="form-label">Alternate Mobile</Label>
              <Input
                type="text"
                value={candidate?.alternateMobile || ""}
                onChange={(e) =>
                  setCandidate((prev) => ({
                    ...prev,
                    alternateMobile: e.target.value.replace(/\D/g, ""),
                  }))
                }
                className="w-100"
                maxLength={10}
                invalid={isUnfilled("alternateMobile")}
                style={getUnfilledInputStyle(isUnfilled("alternateMobile"))}
              />
            </Col>

            <Col lg={6} xs={12} className="mb-1">
              <Label className="form-label">Gender</Label>
              <Input
                type="select"
                value={candidate?.gender || ""}
                onChange={(e) =>
                  setCandidate((prev) => ({
                    ...prev,
                    gender: e.target.value,
                  }))
                }
                className="w-100"
                invalid={isUnfilled("gender")}
                style={getUnfilledInputStyle(isUnfilled("gender"))}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Input>
            </Col>
          </Row>

          {/* Professional Details Section (existing form) */}
          <Professional
            key={candidate?.id || candidate?._id}
            candidate={candidate}
            industriesData={industriesData}
            setCandidate={setCandidate}
            setIndustriesData={setIndustriesData}
            resumeFile={resumeFile}
            isResumeUploading={isResumeUploading}
            showResumeFileName={showResumeFileName}
            setShowResumeFileName={setShowResumeFileName}
            handleResumeChange={handleResumeChange}
            update={true}
            isDisabledAllFields={false}
            highlightUnfilled
            unfilledKeys={unfilledKeys}
            onProfessionalValuesChange={(vals) => {
              latestProfessionalValuesRef.current = vals || {};
            }}
          />

          {/* Single Save button for both sections */}
          <Row className="mt-2">
            <Col sm="12" className="text-center">
              <Button
                color="defult"
                style={{ backgroundColor: themecolor, color: "white" }}
                type="button"
                onClick={handleSaveProfessional}
                disabled={!hasCandidateData || isResumeUploading}
              >
                {isResumeUploading ? "Saving..." : "Save Changes"}
              </Button>
            </Col>
          </Row>
        </>
      ) : (
        <div className="text-center py-4">
          <p>No professional information available.</p>
        </div>
      )}
    </CardBody>
  );
};

export default CandidateProfessionalProfile;