// ** React Imports
import { useEffect, useState } from "react";
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
// import { useSelector } from 'react-redux'
import awsUploadAssets from "../../helper/awsUploadAssets";
import { useDispatch, useSelector } from "react-redux";
// import actions from "../../redux/auth/actions";
import fileActions from "./../../redux/fileUploadProgress.js/actions";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { updateAgency } from "../../apis/agency";
import { Flex, Progress } from "antd";
import agencyActions from "../../redux/agency/actions";
import { SketchPicker } from "react-color";
import userActions from "../../redux/user/actions";
import useBreakpoint from "../../utility/hooks/useBreakpoints";
import { tostifySuccess } from "../Tostify";
const AgencyDetails = () => {
  // const role = useSelector(state => state.role)
  const { progress } = useSelector((state) => state);
  const userDetail = useSelector((state) => state.auth.user);
  const [profilePic, setProfilePic] = useState();
  const [user, setUser] = useState({});
  const [bannerPreview, setBannerPreview] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [uploadTarget, setUploadTarget] = useState(null); // 'logo' | 'bannerImage'
  const [pendingAgencyUpdate, setPendingAgencyUpdate] = useState(null);
  const userData = useSelector((state) => state?.user?.user?.agency);
  const dispatch = useDispatch();
  // Keep local agency state in sync with login data
  useEffect(() => {
    setUser(userData);
    setBannerPreview(userData?.bannerImage || "");
  }, [userData]);

  const MAX_LOGO_SIZE = 800 * 1024; // 800 kB
  const MAX_BANNER_SIZE = 5 * 1024 * 1024; // 5 MB

  const onChangeHandler = (id, value, event) => {
    if (id === "logo") {
      if (value?.size > MAX_LOGO_SIZE) {
        toast.error("Agency logo must be 800kB or less");
        if (event?.target) event.target.value = "";
        return;
      }
      setProfilePic(URL.createObjectURL(value));
    }
    setUser({ ...user, [id]: value });
  };

  // Cache buster to ensure updated images render without hard refresh
  const withCacheBuster = (url) => {
    if (!url) return "";
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}cb=${Date.now()}`;
  };
  const defaultValues = {
    mobileNumber: userData?.mobileNumber || "",
    phoneNumber: userData?.phoneNumber || "",
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

  const handleBannerChange = (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    if (file.size > MAX_BANNER_SIZE) {
      toast.error("Agency banner must be 5MB or less");
      event.target.value = "";
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const { width, height } = img;
      // const MIN_ASPECT_RATIO = 16 / 9; // enforce clear landscape orientation
      if (width <= height) {
        toast.error(
          `Please upload a landscape image (width greater than height). Current: ${width}x${height}`
        );
        URL.revokeObjectURL(objectUrl);
        event.target.value = "";
        return;
      }
      
      setBannerFile(file);
      setBannerPreview(objectUrl);
      setUser((prev) => ({ ...prev, bannerImage: file }));
    };

    img.onerror = () => {
      toast.error("Failed to load image. Please try another file.");
      URL.revokeObjectURL(objectUrl);
      event.target.value = "";
    };

    img.src = objectUrl;
  };
  const AgencySchema = yup.object().shape({
    mobileNumber: yup
      .string()
      .required()
      .min(10, (obj) => showErrors("mobileNumber", obj.value.length, obj.min)),
    phoneNumber: yup
      .string()
      .required()
      .min(10, (obj) => showErrors("phoneNumber", obj.value.length, obj.min)),
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(AgencySchema),
  });
  // When an upload finishes, attach the URL to the pending payload and save
  useEffect(() => {
    if (!uploadTarget || !pendingAgencyUpdate) return;

    if (progress?.uploadedLink && progress?.isUploaded === true) {
      const fieldKey = uploadTarget === "bannerImage" ? "bannerImage" : "logo";
      const payload = {
        ...pendingAgencyUpdate,
        [fieldKey]: progress?.uploadedLink,
      };

      // Update local previews immediately
      if (fieldKey === "logo") {
        setProfilePic(progress?.uploadedLink);
      } else {
        setBannerPreview(withCacheBuster(progress?.uploadedLink));
      }

      const logoIsFile =
        payload?.logo &&
        typeof payload.logo !== "string" &&
        payload.logo?.name;

      // If banner finished uploading but logo still pending, start logo upload next
      if (uploadTarget === "bannerImage" && logoIsFile) {
        const startLogoUpload = async () => {
          setPendingAgencyUpdate(payload);
          setUploadTarget("logo");
          dispatch({ type: fileActions.CLEAR_PROGRESS });
          await awsUploadAssets(payload.logo, "logo", dispatch);
        };
        startLogoUpload();
        return;
      }

      handleSaveChangesAgency(payload, { skipUpload: true });
      setPendingAgencyUpdate(null);
      setUploadTarget(null);
      setBannerFile(null);
      dispatch({ type: fileActions.CLEAR_PROGRESS });
    } else if (progress?.isError === true) {
      toast.error("something went wrong try again");
      setPendingAgencyUpdate(null);
      setUploadTarget(null);
      dispatch({ type: fileActions.CLEAR_PROGRESS });
    }
  }, [progress, uploadTarget, pendingAgencyUpdate]);

  const handleCancel = () => {
    reset(defaultValues);
    setUser(userData);
    setProfilePic(userData?.logo);
    setBannerPreview(userData?.bannerImage || "");
    setBannerFile(null);
  };
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const [focus, setIsfocus] = useState(null);
  const [colorHex, setColorHex] = useState("");

  useEffect(() => {
    setUser({
      ...userData,
      themecolor: colorHex,
    });
  }, [colorHex]);
  useEffect(() => {
    if (colorHex == "") {
      setColorHex(userData?.themecolor ? userData?.themecolor : "#000");
    }
    if (
      userData?.themecolor == "" ||
      userData?.themecolor == null ||
      userData?.themecolor == undefined
    ) {
      setUser({
        ...userData,
        themecolor: userData?.themecolor
          ? userData?.themecolor
          : colorHex == "#000" || colorHex == ""
          ? "#000"
          : colorHex,
      });
    }
  }, [userData]);

  // Persist agency data to backend and refresh login/agency state
  const saveAgency = async (payload) => {
    const resp = await updateAgency(payload);

    if (resp && resp?.isSuccess && resp?.data?.agency?.id) {
      tostifySuccess("Data saved successfully");
      const updatedAgency = resp?.data?.agency;
      setUser(updatedAgency);
      setProfilePic(updatedAgency?.logo);
      setBannerPreview(updatedAgency?.bannerImage || "");
      setBannerFile(null);
      setUploadTarget(null);
      setPendingAgencyUpdate(null);

      dispatch({
        type: userActions.GET_LOGIN_USER_DETAIL,
        payload: userDetail?.id,
      });
      dispatch({
        type: agencyActions.SET_AGENCY_STATE,
        payload: {
          agencyDetail: updatedAgency,
        },
      });
    }
  };

  const handleSaveChangesAgency = async (
    payloadOverride = null,
    options = { skipUpload: false }
  ) => {
    localStorage.setItem("themecolor", colorHex);
    const payload = payloadOverride
      ? { ...user, ...payloadOverride, themecolor: colorHex }
      : { ...user, themecolor: colorHex };

    // Preserve existing logo/banner URLs when no new file is selected
    const existingLogo = userData?.logo || user?.logo;
    if (!payload.logo && typeof existingLogo === "string") {
      payload.logo = existingLogo;
    }
    const existingBanner = userData?.bannerImage || userData?.banner;
    if (!payload.bannerImage && typeof existingBanner === "string") {
      payload.bannerImage = existingBanner;
    }

    // If we're returning from the upload effect, skip upload step
    if (options.skipUpload) {
      await saveAgency(payload);
      return;
    }

    // Upload banner first if a new file is selected
    if (bannerFile && bannerFile?.name) {
      setPendingAgencyUpdate(payload);
      setUploadTarget("bannerImage");
      dispatch({ type: fileActions.CLEAR_PROGRESS });
      await awsUploadAssets(bannerFile, "image", dispatch);
      return;
    }
    // Upload logo if a new file is selected
    const logo = user?.logo;
    if (logo?.name) {
      setPendingAgencyUpdate(payload);
      setUploadTarget("logo");
      dispatch({ type: fileActions.CLEAR_PROGRESS });
      await awsUploadAssets(logo, "logo", dispatch);
      return;
    }

    await saveAgency(payload);
  };
  const { width } = useBreakpoint();
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const HexCase = () => {
    return (
      <>
        <div className="d-flex align-items-center gap-1">
          <div
            style={{
              width: "31px",
              padding: "3px",
              background: "#fff",
              borderRadius: "1px",
              boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
              display: "inline-block",
              cursor: "pointer",
            }}
            onClick={() => {
              setDisplayColorPicker(!displayColorPicker);
            }}
          >
            <div
              style={{
                width: "25px",
                height: "25px",
                borderRadius: "2px",
                background: colorHex,
              }}
            />
          </div>
          {displayColorPicker ? (
            <div style={{ position: "absolute", zIndex: "2" }}>
              <div
                style={{
                  position: "fixed",
                  top: "0px",
                  right: "0px",
                  bottom: "0px",
                  left: "0px",
                }}
                onClick={() => {
                  setDisplayColorPicker(false);
                }}
              />
              <SketchPicker
                color={colorHex}
                onChange={(newColor) => {
                  setColorHex(newColor.hex);
                }}
              />
            </div>
          ) : null}
          <span>HEX: {colorHex}</span>
        </div>
      </>
    );
  };
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
              src={profilePic ? profilePic : user?.logo}
              alt="Generic placeholder image"
              style={{
                maxHeight: "80px",
                padding: "11px",
                width: "100%",
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
                  id="logo"
                  onChange={(e) =>
                    onChangeHandler(e.target.id, e.target.files[0], e)
                  }
                  hidden
                  accept="image/*"
                />
              </Button>
              {/* <Button className='mb-75' color='secondary' size='sm' outline onClick={handleImgReset}>
                                    Reset
                                </Button> */}
              <p className="mb-0">Allowed JPG, GIF or PNG. Max size of 800kB</p>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <Label className="form-label" for="agencyBanner">
            Agency Banner
          </Label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "520px",
                aspectRatio: "16/9",
                border: "1px dashed #d8d6de",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#f8f8f8",
                position: "relative",
              }}
            >
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Agency banner preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    color: "#9c9c9c",
                    fontSize: "0.9rem",
                  }}
                >
                  No banner uploaded
                </div>
              )}
            </div>
            <div style={{ minWidth: "220px" }}>
              <Input
                id="agencyBanner"
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                style={{ display: "none" }}
              />
              <Button
                color="primary"
                outline
                onClick={() => document.getElementById("agencyBanner").click()}
                style={{
                  marginBottom: "0.5rem",
                  borderColor: "white",
                  color: "white",
                  backgroundColor: themecolor,
                }}
              >
                {bannerPreview ? "Update Banner" : "Choose Banner"}
              </Button>
              <small className="text-muted d-block">
               Landscape 16:9 recommended. Max size of 5MB.
              </small>
            </div>
          </div>
        </div>
        {progress?.isUploading && (
          <div
            className="mt-2"
            style={{
              width: "100%",
            }}
          >
            <Flex gap="small" vertical>
              <Progress
                percent={progress?.percentage}
                strokeColor={themecolor}
              />
            </Flex>
            {/* <Progress value={progress?.percentage}>
              {progress?.percentage}%
            </Progress> */}
          </div>
        )}

        <Form
          className="mt-2 pt-50"
          onSubmit={handleSubmit(handleSaveChangesAgency)}
        >
          <Row>
            <Col sm="6" className="mb-1">
              <Label className="form-label" for="emailInput">
                Agency Name
              </Label>
              <Input
                id="id"
                disabled
                name="text"
                placeholder="User ID"
                value={user?.name || "-"}
              />
            </Col>
            <Col sm="6" className="mb-1">
              <Label className="form-label" for="emailInput">
                Owner Name
              </Label>
              <Input
                id="id"
                disabled
                name="text"
                placeholder="User ID"
                value={user?.ownersName || "-"}
              />
            </Col>
            <Col sm="6" className="mb-1">
              <Label className="form-label" for="address">
                Mobile Number
              </Label>
              <Controller
                control={control}
                id="mobileNumber"
                name="mobileNumber"
                render={({ field }) => (
                  <Input
                    id="mobileNumber"
                    onFocus={() => setIsfocus("mobileNumber")}
                    onBlur={() => setIsfocus(null)}
                    style={{
                      borderColor: focus === "mobileNumber" && themecolor,
                    }}
                    label="mobileNumber"
                    htmlFor="mobileNumber"
                    maxLength={10}
                    className="input-group-merge"
                    invalid={errors.mobileNumber ? true : false}
                    {...field}
                    onChange={(e) => {
                      onChangeHandler(e.target.id, e.target.value);
                      field.onChange(e);
                    }}
                  />
                )}
              />
              {errors.mobileNumber && (
                <FormFeedback className="d-block">
                  {errors.mobileNumber.message}
                </FormFeedback>
              )}
              {/* <Input
                    id="address"
                    name="address"
                    type="text"
                    maxLength={10}
                    placeholder="12, Business Park"
                    onChange={(e) =>
                      onChangeHandler(e.target.id, e.target.value)
                    }
                    value={user?.address}
                  /> */}
            </Col>
            <Col sm="6" className="mb-1">
              <Label className="form-label" for="address">
                Phone Number
              </Label>
              <Controller
                control={control}
                id="phoneNumber"
                name="phoneNumber"
                render={({ field }) => (
                  <Input
                    id="phoneNumber"
                    onFocus={() => setIsfocus("phoneNumber")}
                    onBlur={() => setIsfocus(null)}
                    style={{
                      borderColor: focus === "phoneNumber" && themecolor,
                    }}
                    label="phoneNumber"
                    htmlFor="phoneNumber"
                    maxLength={10}
                    className="input-group-merge"
                    invalid={errors.phoneNumber ? true : false}
                    {...field}
                    onChange={(e) => {
                      onChangeHandler(e.target.id, e.target.value);
                      field.onChange(e);
                    }}
                  />
                )}
              />
              {errors.phoneNumber && (
                <FormFeedback className="d-block">
                  {errors.phoneNumber.message}
                </FormFeedback>
              )}
              {/* <Input
                    id="address"
                    name="address"
                    type="text"
                    maxLength={10}
                    placeholder="12, Business Park"
                    onChange={(e) =>
                      onChangeHandler(e.target.id, e.target.value)
                    }
                    value={user?.address}
                  /> */}
            </Col>
            <Col sm="6" className="mb-1">
              <Label className="form-label" for="emailInput">
                Email
              </Label>
              <Input
                id="id"
                disabled
                name="text"
                placeholder="User ID"
                value={user?.email || "-"}
              />
            </Col>
            <Col sm="6" className="mb-1">
              <Label className="form-label" for="emailInput">
                Address
              </Label>
              <Input
                id="id"
                disabled
                name="text"
                placeholder="User ID"
                value={user?.address || "-"}
              />
            </Col>
            <Col sm="6" className="mb-1">
              <Label className="form-label" for="emailInput">
                Country
              </Label>
              <Input
                id="id"
                disabled
                name="text"
                placeholder="User ID"
                value={user?.country || "-"}
              />
            </Col>
            <Col sm="6" className="mb-1">
              <Label className="form-label" for="emailInput">
                State
              </Label>
              <Input
                id="id"
                disabled
                name="text"
                placeholder="User ID"
                value={user?.state || "-"}
              />
            </Col>
            <Col sm="6" className="mb-1">
              <Label className="form-label" for="emailInput">
                City
              </Label>
              <Input
                id="id"
                disabled
                name="text"
                placeholder="User ID"
                value={user?.city || "-"}
              />
            </Col>
            <Col sm="6" className="mb-1">
              <Label className="form-label" for="emailInput">
                Whatsapp Number
              </Label>
              <Input
                id="id"
                disabled
                name="text"
                placeholder="User ID"
                value={user?.whatsapp || "-"}
              />
            </Col>
            <Col sm="6" className="mb-1">
              <Label className="form-label" for="whatsappLink">
                WhatsApp Link
              </Label>
              <Input
                id="whatsappLink"
                name="whatsappLink"
                type="text"
                maxLength={500}
                placeholder="Enter WhatsApp Link (e.g., https://wa.me/1234567890)"
                onFocus={() => setIsfocus("whatsappLink")}
                onBlur={() => setIsfocus(null)}
                style={{
                  borderColor: focus === "whatsappLink" && themecolor,
                }}
                onChange={(e) =>
                  onChangeHandler(e.target.id, e.target.value)
                }
                value={user?.whatsappLink || ""}
              />
            </Col>
            <Col sm="6" className="mb-1">
              <Label className="form-label" for="emailInput">
                GST Number
              </Label>
              <Input
                id="id"
                disabled
                name="text"
                placeholder="User ID"
                value={user?.gstNo || "-"}
              />
            </Col>
            <Col sm="6" className="mb-1">
              <Label className="form-label" for="emailInput">
                Pancard Number
              </Label>
              <Input
                id="id"
                disabled
                name="text"
                placeholder="User ID"
                value={user?.pancardNo || "-"}
              />
            </Col>
            <Col sm="6" className="mb-1">
              <Label className="form-label" for="emailInput">
                CIN Number
              </Label>
              <Input
                id="id"
                disabled
                name="text"
                placeholder="User ID"
                value={user?.cinNumber || "-"}
              />
            </Col>
            <Col sm="6" className="mb-1 d-flex flex-column">
              <Label className="form-label" for="emailInput">
                Theme Color
              </Label>
              {HexCase()}
            </Col>
            <Col className="mt-2" sm="12">
              <Button
                className="me-1"
                color="defult"
                style={{ backgroundColor: themecolor, color: "white" }}
                type="submit"
              >
                Save
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

export default AgencyDetails;
