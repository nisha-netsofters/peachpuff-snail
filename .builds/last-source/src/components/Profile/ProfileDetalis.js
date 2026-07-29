// ** React Imports

import "cleave.js/dist/addons/cleave-phone.us";
import {
  Row,
  Col,
  Form,
  Input,
  Label,
  Button,
  CardBody,
  FormFeedback,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import actions from "../../redux/auth/actions";
import candidateActions from "../../redux/candidate/actions";
import fileActions from "./../../redux/fileUploadProgress.js/actions";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import useBreakpoint from "../../utility/hooks/useBreakpoints";
import { resolveAssetUrl } from "../../utility/resolveAssetUrl";

const ProfileDetails = () => {
  const { progress } = useSelector((state) => state);
  const [user, setUser] = useState({});
  const userData = useSelector((state) => state?.user?.user);
  const userDetails = useSelector((state) => state?.auth?.user);
  const candidateProfile = useSelector(
    (state) => state?.candidate?.candidateProfile
  );
  const dispatch = useDispatch();
  const [profilePic, setProfilePic] = useState();
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Clear any stuck upload progress from a previous failed AWS upload
    if (
      progress?.isUploading &&
      !progress?.isUploaded &&
      progress?.percentage === 0
    ) {
      dispatch({ type: fileActions.CLEAR_PROGRESS });
    }
  }, []);

  useEffect(() => {
    // Prefer latest auth userDetails so profile updates show immediately.
    if (userDetails?.role?.name === "Candidate" && candidateProfile) {
      const candidateData = {
        ...candidateProfile,
        ...userDetails,
        name:
          userDetails?.name ||
          (candidateProfile?.firstname && candidateProfile?.lastname
            ? `${candidateProfile.firstname} ${candidateProfile.lastname}`
            : ""),
        mobile: userDetails?.mobile || candidateProfile?.mobile || "",
        email: userDetails?.email || candidateProfile?.email || "",
        image: userDetails?.image || candidateProfile?.image || "",
        address:
          userDetails?.address ||
          (candidateProfile?.street
            ? `${candidateProfile.street}, ${candidateProfile.city || ""}, ${
                candidateProfile.state || ""
              } ${candidateProfile.zip || ""}`.trim()
            : ""),
        alternateMobile: candidateProfile?.alternateMobile || "",
      };
      setUser(candidateData);
    } else {
      setUser(userDetails);
    }
  }, [userData, candidateProfile, userDetails]);

  const MAX_PROFILE_IMAGE_SIZE = 800 * 1024; // 800 kB

  const onChangeHandler = (id, value, event) => {
    if (id === "image") {
      if (!value) return;
      if (value?.size > MAX_PROFILE_IMAGE_SIZE) {
        toast.error("Profile image must be 800kB or less");
        if (event?.target) event.target.value = "";
        return;
      }
      if (!value.type?.startsWith("image/")) {
        toast.error("Only JPG, GIF or PNG images are allowed");
        if (event?.target) event.target.value = "";
        return;
      }
      // Preview locally; upload happens on Save via backend (local /uploads)
      if (typeof profilePic === "string" && profilePic.startsWith("blob:")) {
        URL.revokeObjectURL(profilePic);
      }
      setProfilePic(URL.createObjectURL(value));
      setImageFile(value);
      return;
    }
    setUser((prev) => ({ ...prev, [id]: value }));
  };

  const defaultValues = {
    name: userDetails?.name || "",
    mobile: userDetails?.mobile || "",
    address: userDetails?.address || "",
  };
  const showErrors = (field, valueLen, min) => {
    if (valueLen === 0) {
      return `${field} field is required`;
    } else if (valueLen > 0 && valueLen < min) {
      return `${field} must be at least ${min} characters`;
    } else {
      return "";
    }
  };
  const isCandidate = userDetails?.role?.name === "Candidate";

  const SignupSchema = yup.object().shape({
    name: yup
      .string()
      .required()
      .min(1, (obj) => showErrors("Name", obj.value.length, obj.min)),
    mobile: yup
      .string()
      .required()
      .min(10, (obj) => showErrors("mobile", obj.value.length, obj.min)),
    address: isCandidate
      ? yup.string().nullable()
      : yup
          .string()
          .required((obj) => showErrors("Address", obj.value?.length || 0, 1)),
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema),
  });

  useEffect(() => {
    if (progress?.isError === true) {
      toast.error("Image upload failed. Please try again.");
      dispatch({ type: fileActions.CLEAR_PROGRESS });
      setIsSaving(false);
    }
  }, [progress, dispatch]);

  const handleSaveChanges = async () => {
    const id = user?.id;
    if (!id) {
      toast.error("User not found");
      return;
    }

    setIsSaving(true);
    dispatch({ type: fileActions.CLEAR_PROGRESS });

    try {
      const fm = new FormData();
      fm.append("name", user?.name || "");
      fm.append("mobile", user?.mobile || "");
      fm.append("email", user?.email || "");
      if (user?.address) fm.append("address", user.address);

      // New image file → backend local upload. Existing URL → keep as-is.
      if (imageFile instanceof File) {
        fm.append("image", imageFile);
      } else if (typeof user?.image === "string" && user.image) {
        fm.append("image", user.image);
      }

      dispatch({
        type: actions.UPDATE_PROFILE,
        payload: {
          id,
          data: fm,
        },
      });

      // Sync candidate record when logged in as Candidate
      if (userDetails?.role?.name === "Candidate" && candidateProfile) {
        try {
          const candidateFm = new FormData();
          const candidateId = candidateProfile._id || candidateProfile.id;

          const fullName = (user?.name || "").trim();
          const [firstname = "", ...restName] = fullName.split(" ");
          const lastname = restName.join(" ");

          if (firstname) candidateFm.append("firstname", firstname);
          if (lastname) candidateFm.append("lastname", lastname);

          const mobile = user?.mobile || candidateProfile?.mobile;
          const email = user?.email || candidateProfile?.email;

          if (mobile) candidateFm.append("mobile", mobile);
          if (email) candidateFm.append("email", email);
          if (candidateProfile?.gender)
            candidateFm.append("gender", candidateProfile.gender);
          if (candidateProfile?.street)
            candidateFm.append("street", candidateProfile.street);
          if (candidateProfile?.city)
            candidateFm.append("city", candidateProfile.city);
          if (candidateProfile?.state)
            candidateFm.append("state", candidateProfile.state);
          if (candidateProfile?.zip)
            candidateFm.append("zip", candidateProfile.zip);
          if (candidateProfile?.cityId)
            candidateFm.append("cityId", candidateProfile.cityId);
          if (candidateProfile?.stateId)
            candidateFm.append("stateId", candidateProfile.stateId);
          if (candidateProfile?.alternateMobile)
            candidateFm.append(
              "alternateMobile",
              candidateProfile.alternateMobile
            );

          if (candidateProfile?.professional) {
            candidateFm.append(
              "professional",
              JSON.stringify(candidateProfile.professional)
            );
          }
          if (
            candidateProfile?.industries_relation &&
            candidateProfile.industries_relation.length > 0
          ) {
            candidateFm.append(
              "industries_relation",
              JSON.stringify(candidateProfile.industries_relation)
            );
          }

          if (imageFile instanceof File) {
            candidateFm.append("image", imageFile);
          }

          candidateFm.append("id", candidateId);

          dispatch({
            type: candidateActions.UPDATE_CANDIDATE,
            payload: {
              id: candidateId,
              data: candidateFm,
              refreshProfile: true,
            },
          });
        } catch (e) {
          console.error("Error while syncing candidate profile:", e);
        }
      }

      setImageFile(null);
    } finally {
      setIsSaving(false);
    }
  };
  const { width } = useBreakpoint();

  const handleCancel = () => {
    reset(defaultValues);
    setImageFile(null);
    if (typeof profilePic === "string" && profilePic.startsWith("blob:")) {
      URL.revokeObjectURL(profilePic);
    }
    setProfilePic(null);
  };
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const [focus, setIsfocus] = useState(null);

  const displayImageSrc =
    profilePic || resolveAssetUrl(user?.image) || undefined;

  return (
    <>
      <CardBody className="py-2 my-25">
        <div
          className="d-flex"
          style={width < 455 ? { flexDirection: "column" } : null}
        >
          <div
            className="me-25"
            style={
              width < 455
                ? {
                    maxWidth: "60%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                  }
                : {
                    maxWidth: "20%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }
            }
          >
            <img
              src={displayImageSrc}
              alt="Generic placeholder image"
              style={{
                maxHeight: "80px",
                padding: "11px",
                width: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div className="d-flex align-items-end mt-75 ms-1">
            <div
              style={
                width < 455
                  ? {
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: "center",
                    }
                  : null
              }
            >
              <Button
                tag={Label}
                className="mb-75 me-75"
                size="sm"
                color="defult"
                style={
                  width < 455
                    ? {
                        backgroundColor: themecolor,
                        color: "white",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "center",
                        width: "10rem",
                      }
                    : {
                        backgroundColor: themecolor,
                        color: "white",
                      }
                }
              >
                Upload
                <Input
                  type="file"
                  id="image"
                  onChange={(e) =>
                    onChangeHandler(e.target.id, e.target.files[0], e)
                  }
                  hidden
                  accept="image/*"
                />
              </Button>
              <p className="mb-0">Allowed JPG, GIF or PNG. Max size of 800kB</p>
              {imageFile ? (
                <p className="mb-0 text-muted" style={{ fontSize: 12 }}>
                  Selected: {imageFile.name} — click Save changes to upload
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <Form className="mt-2 pt-50" onSubmit={handleSubmit(handleSaveChanges)}>
          <Row>
            <Col sm="6" className="mb-1">
              <Label className="form-label" for="firstName">
                Full Name
              </Label>
              <Controller
                control={control}
                id="name"
                name="name"
                render={({ field }) => (
                  <Input
                    label="John"
                    id="name"
                    onFocus={() => setIsfocus("name")}
                    onBlur={() => setIsfocus(null)}
                    style={{
                      borderColor: focus === "name" && themecolor,
                    }}
                    htmlFor="name"
                    maxLength={200}
                    className="input-group-merge"
                    invalid={errors.name ? true : false}
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-z ]/gi, "");
                      onChangeHandler(e.target.id, value);
                      field.onChange(e);
                    }}
                  />
                )}
              />
              {errors.name && (
                <FormFeedback className="d-block">
                  {errors.name.message}
                </FormFeedback>
              )}
            </Col>

            <Col sm="6" className="mb-1">
              <Label className="form-label" for="emailInput">
                User ID
              </Label>
              <Input
                id="id"
                disabled
                name="text"
                placeholder="User ID"
                value={user?.id}
              />
            </Col>

            <Col sm="6" className="mb-1">
              <Label className="form-label" for="emailInput">
                Role
              </Label>
              <Input
                id="role"
                type="text"
                name="text"
                disabled
                value={user?.role?.name}
              />
            </Col>

            <Col sm="6" className="mb-1">
              <Label className="form-label" for="emailInput">
                E-mail
              </Label>
              <Input id="email" name="email" disabled value={user?.email} />
            </Col>

            <Col sm="6" className="mb-1">
              <Label className="form-label" for="phNumber">
                Phone Number
              </Label>
              <Controller
                control={control}
                id="mobile"
                name="mobile"
                render={({ field }) => (
                  <Input
                    label="mobile"
                    id="mobile"
                    onFocus={() => setIsfocus("mobile")}
                    onBlur={() => setIsfocus(null)}
                    style={{
                      borderColor: focus === "mobile" && themecolor,
                    }}
                    htmlFor="mobile"
                    maxLength={10}
                    className="input-group-merge"
                    invalid={errors.mobile ? true : false}
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      onChangeHandler(e.target.id, value);
                      field.onChange(e);
                    }}
                  />
                )}
              />
              {errors.mobile && (
                <FormFeedback className="d-block">
                  {errors.mobile.message}
                </FormFeedback>
              )}
            </Col>
            {userDetails?.role?.name !== "Candidate" && (
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="address">
                  Full Address
                </Label>
                <Controller
                  control={control}
                  id="address"
                  name="address"
                  render={({ field }) => (
                    <Input
                      id="address"
                      label="address"
                      htmlFor="address"
                      onFocus={() => setIsfocus("address")}
                      onBlur={() => setIsfocus(null)}
                      style={{
                        borderColor: focus === "address" && themecolor,
                      }}
                      maxLength={200}
                      className="input-group-merge"
                      invalid={errors.address ? true : false}
                      {...field}
                      onChange={(e) => {
                        onChangeHandler(e.target.id, e.target.value);
                        field.onChange(e);
                      }}
                    />
                  )}
                />
                {errors.address && (
                  <FormFeedback className="d-block">
                    {errors.address.message}
                  </FormFeedback>
                )}
              </Col>
            )}

            <Col className="mt-2" sm="12">
              <Button
                className="me-1"
                color="defult"
                style={{ backgroundColor: themecolor, color: "white" }}
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
              <Button
                color="secondary"
                outline
                type="button"
                onClick={() => handleCancel()}
              >
                Discard
              </Button>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </>
  );
};

export default ProfileDetails;
