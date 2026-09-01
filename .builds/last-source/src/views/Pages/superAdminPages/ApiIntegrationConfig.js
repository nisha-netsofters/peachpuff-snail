import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import {
  Check,
  Cpu,
  Eye,
  Settings,
} from "react-feather";
import {
  getApiIntegrationConfig,
  saveApiIntegrationConfig,
} from "../../../apis/apiIntegration";
import { tostify, tostifySuccess } from "../../../components/Tostify";

const OCR_PROVIDERS = [
  {
    id: "google_vision",
    name: "Google Vision API",
    description: "Cloud OCR for PDF and image text extraction",
    fields: ["apiKey", "projectId"],
  },
  {
    id: "aws_textract",
    name: "AWS Textract",
    description: "Amazon document analysis and OCR",
    fields: ["accessKeyId", "secretAccessKey", "region"],
  },
  {
    id: "azure_document_intelligence",
    name: "Azure Document Intelligence",
    description: "Microsoft Azure form recognizer / OCR",
    fields: ["endpoint", "apiKey"],
  },
  {
    id: "tesseract",
    name: "Tesseract OCR",
    description: "Open-source OCR (no API key required)",
    fields: ["language"],
  },
];

const AI_PROVIDERS = [
  {
    id: "openai",
    name: "OpenAI GPT",
    description: "Resume parsing & job description generation",
    fields: ["apiKey", "model", "baseUrl"],
  },
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Google AI for content extraction & generation",
    fields: ["apiKey", "model"],
  },
  {
    id: "claude",
    name: "Anthropic Claude",
    description: "Claude models for structured AI tasks",
    fields: ["apiKey", "model", "baseUrl"],
  },
];

const defaultForm = {
  ocr: {
    isEnabled: false,
    activeProvider: "google_vision",
    providers: {
      google_vision: { isEnabled: false, apiKey: "", projectId: "" },
      aws_textract: {
        isEnabled: false,
        accessKeyId: "",
        secretAccessKey: "",
        region: "us-east-1",
      },
      azure_document_intelligence: {
        isEnabled: false,
        endpoint: "",
        apiKey: "",
      },
      tesseract: { isEnabled: false, language: "eng" },
    },
  },
  ai: {
    isEnabled: false,
    activeProvider: "openai",
    providers: {
      openai: {
        isEnabled: false,
        apiKey: "",
        model: "gpt-4o",
        baseUrl: "https://api.openai.com/v1",
      },
      gemini: { isEnabled: false, apiKey: "", model: "gemini-3.1-flash-lite" },
      claude: {
        isEnabled: false,
        apiKey: "",
        model: "claude-haiku-4-5-20251001",
        baseUrl: "https://api.anthropic.com/v1",
      },
    },
  },
};

const sectionStyles = {
  card: {
    border: "1px solid #ebe9f1",
    borderRadius: "12px",
    overflow: "hidden",
    transition: "box-shadow 0.2s ease",
  },
  header: {
    background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)",
    padding: "1.25rem 1.5rem",
    borderBottom: "1px solid #ebe9f1",
  },
  providerCard: (isActive, isEnabled) => ({
    border: isActive ? "2px solid #7367f0" : "1px solid #ebe9f1",
    borderRadius: "10px",
    padding: "1rem",
    cursor: "pointer",
    background: isActive ? "#f3f1ff" : "#fff",
    opacity: isEnabled || isActive ? 1 : 0.75,
    transition: "all 0.2s ease",
    height: "100%",
  }),
};

const FIELD_LABELS = {
  apiKey: "API Key",
  projectId: "Project ID",
  accessKeyId: "Access Key ID",
  secretAccessKey: "Secret Access Key",
  region: "AWS Region",
  endpoint: "Endpoint URL",
  language: "Language Code",
  model: "Model",
  baseUrl: "Base URL",
};

const FieldLabel = ({ field }) => FIELD_LABELS[field] || field;

const isSecretField = (field) =>
  ["apiKey", "secretAccessKey", "accessKeyId", "securityKey"].includes(field);

const hasValue = (value) => {
  if (value === undefined || value === null) return false;
  const str = String(value).trim();
  return str.length > 0;
};

/** True only when provider toggle is on AND required credential fields are filled */
const isProviderFullyConfigured = (sectionKey, providerMeta, providerData = {}) => {
  if (!providerData?.isEnabled) return false;
  if (sectionKey === "ocr" && providerMeta.id === "tesseract") {
    return true; // no API key required
  }
  const requiredByProvider = {
    google_vision: ["apiKey"],
    aws_textract: ["accessKeyId", "secretAccessKey"],
    azure_document_intelligence: ["endpoint", "apiKey"],
    openai: ["apiKey", "model"],
    gemini: ["apiKey", "model"],
    claude: ["apiKey", "model"],
  };
  const required = requiredByProvider[providerMeta.id] || [];
  return required.every((field) => {
    const val = providerData[field];
    if (!hasValue(val)) return false;
    // Masked values from API still count as set
    if (isSecretField(field) && (providerData[`${field}Set`] || String(val).includes("•"))) {
      return true;
    }
    return true;
  });
};

const ApiIntegrationConfig = () => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const data = await getApiIntegrationConfig();
      if (data?.msg === "invalid token or expired token") {
        tostify("Session expired. Please login again.");
        return;
      }
      if (data?.error) {
        tostify(data.error);
        return;
      }
      if (data) {
        setForm({
          ocr: {
            ...defaultForm.ocr,
            ...data.ocr,
            providers: {
              ...defaultForm.ocr.providers,
              ...data.ocr?.providers,
            },
          },
          ai: {
            ...defaultForm.ai,
            ...data.ai,
            providers: {
              ...defaultForm.ai.providers,
              ...data.ai?.providers,
            },
          },
        });
      }
    } catch (err) {
      tostify(
        err?.response?.data?.error ||
          "Failed to load API integration configuration"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const updateSection = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const updateProvider = (section, providerId, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        providers: {
          ...prev[section].providers,
          [providerId]: {
            ...prev[section].providers[providerId],
            [field]: value,
          },
        },
      },
    }));
  };

  const selectProvider = (section, providerId) => {
    setForm((prev) => {
      const providers = { ...prev[section].providers };
      Object.keys(providers).forEach((key) => {
        providers[key] = { ...providers[key], isEnabled: key === providerId };
      });
      return {
        ...prev,
        [section]: {
          ...prev[section],
          activeProvider: providerId,
          isEnabled: true,
          providers,
        },
      };
    });
  };

  const toggleProviderEnabled = (section, providerId, enabled) => {
    updateProvider(section, providerId, "isEnabled", enabled);
    if (enabled) {
      updateSection(section, "activeProvider", providerId);
      updateSection(section, "isEnabled", true);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const resp = await saveApiIntegrationConfig({
        ocr: form.ocr,
        ai: form.ai,
      });
      if (resp?.msg === "invalid token or expired token") {
        tostify("Session expired. Please login again.");
        return;
      }
      if (resp?.msg === "success") {
        tostifySuccess("API configuration saved successfully");
        if (resp.data) {
          setForm({
            ocr: {
              ...defaultForm.ocr,
              ...resp.data.ocr,
              providers: {
                ...defaultForm.ocr.providers,
                ...resp.data.ocr?.providers,
              },
            },
            ai: {
              ...defaultForm.ai,
              ...resp.data.ai,
              providers: {
                ...defaultForm.ai.providers,
                ...resp.data.ai?.providers,
              },
            },
          });
        }
      } else {
        tostify(resp?.error || "Failed to save configuration");
      }
    } catch (err) {
      tostify(
        err?.response?.data?.error ||
          "Failed to save API integration configuration"
      );
    } finally {
      setSaving(false);
    }
  };

  const renderProviderFields = (section, provider) => {
    const providerData = form[section].providers[provider.id] || {};
    const isActive = form[section].activeProvider === provider.id;
    const sectionEnabled = form[section].isEnabled;
    const providerEnabled = providerData.isEnabled;

    if (!sectionEnabled || !isActive) return null;

    return (
      <div
        className="mt-2 p-1"
        style={{
          animation: "fadeIn 0.25s ease",
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-1">
          <h6 className="mb-0 text-primary">
            <Settings size={16} className="mr-50" />
            {provider.name} Configuration
          </h6>
          <div className="d-flex align-items-center">
            <small className="text-muted mr-1">
              {providerEnabled ? "Enabled" : "Disabled"}
            </small>
            <div className="form-switch form-check-primary">
              <Input
                type="switch"
                id={`${section}-${provider.id}-enabled`}
                checked={providerEnabled}
                onChange={(e) =>
                  toggleProviderEnabled(section, provider.id, e.target.checked)
                }
              />
            </div>
          </div>
        </div>

        {providerEnabled && (
          <Row>
            {provider.fields.map((field) => (
              <Col md={field === "baseUrl" || field === "endpoint" ? 12 : 6} key={field}>
                <FormGroup>
                  <Label>
                    <FieldLabel field={field} />
                    {field !== "language" && field !== "projectId" && field !== "region" && (
                      <span className="text-danger"> *</span>
                    )}
                  </Label>
                  <Input
                    type={isSecretField(field) ? "password" : "text"}
                    value={providerData[field] || ""}
                    onChange={(e) =>
                      updateProvider(section, provider.id, field, e.target.value)
                    }
                    placeholder={
                      isSecretField(field)
                        ? providerData[`${field}Set`]
                          ? "Leave blank to keep existing key"
                          : `Enter ${FIELD_LABELS[field] || field}`
                        : field === "model" && provider.id === "gemini"
                        ? "e.g. gemini-3.1-flash-lite"
                        : field === "model"
                        ? `Enter ${FIELD_LABELS[field] || field}`
                        : ""
                    }
                  />
                </FormGroup>
              </Col>
            ))}
          </Row>
        )}
      </div>
    );
  };

  const renderSection = ({
    title,
    subtitle,
    icon: Icon,
    sectionKey,
    providers,
    badgeColor,
  }) => {
    const section = form[sectionKey];
    const activeProvider = providers.find((p) => p.id === section.activeProvider);

    return (
      <Card className="mb-2" style={sectionStyles.card}>
        <div style={sectionStyles.header}>
          <div className="d-flex align-items-center">
            <div
              className="d-flex align-items-center justify-content-center mr-1"
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: "#7367f0",
                color: "#fff",
              }}
            >
              <Icon size={20} />
            </div>
            <div className="flex-grow-1">
              <div className="d-flex align-items-center">
                <h4 className="mb-0">{title}</h4>
                {section.isEnabled && activeProvider && (
                  <Badge color={badgeColor} className="ml-1">
                    Active: {activeProvider.name}
                  </Badge>
                )}
              </div>
              <small className="text-muted">{subtitle}</small>
            </div>
            <div className="d-flex align-items-center">
              <span className="text-muted mr-1 small">
                {section.isEnabled ? "ON" : "OFF"}
              </span>
              <div className="form-switch form-check-primary">
                <Input
                  type="switch"
                  id={`${sectionKey}-enabled`}
                  checked={section.isEnabled}
                  onChange={(e) =>
                    updateSection(sectionKey, "isEnabled", e.target.checked)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {section.isEnabled && (
          <CardBody>
            <p className="text-muted small mb-2">
              Select an active provider. The system will seamlessly switch to the
              selected service for all OCR/AI operations.
            </p>
            <Row>
              {providers.map((provider) => {
                const isActive = section.activeProvider === provider.id;
                const isEnabled = section.providers[provider.id]?.isEnabled;
                const isConfigured = isProviderFullyConfigured(
                  sectionKey,
                  provider,
                  section.providers[provider.id]
                );
                return (
                  <Col md={6} lg={3} key={provider.id} className="mb-1">
                    <div
                      style={sectionStyles.providerCard(isActive, isEnabled)}
                      onClick={() => selectProvider(sectionKey, provider.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          selectProvider(sectionKey, provider.id);
                        }
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <strong style={{ fontSize: "0.9rem" }}>
                          {provider.name}
                        </strong>
                        {isActive && (
                          <Check size={18} color="#7367f0" />
                        )}
                      </div>
                      <small className="text-muted d-block mt-50">
                        {provider.description}
                      </small>
                      {isConfigured ? (
                        <Badge color="light-success" className="mt-50">
                          Configured
                        </Badge>
                      ) : isEnabled ? (
                        <Badge color="light-warning" className="mt-50">
                          Incomplete
                        </Badge>
                      ) : null}
                    </div>
                  </Col>
                );
              })}
            </Row>

            {activeProvider &&
              renderProviderFields(sectionKey, activeProvider)}
          </CardBody>
        )}
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="d-flex align-items-center mb-2">
        <div>
          <h3 className="text-primary mb-0">
            <b>OCR & API Configuration</b>
          </h3>
          <small className="text-muted">
            Manage OCR and AI integrations (Sections 5.1 – 5.2)
          </small>
        </div>
      </div>

      {renderSection({
        title: "OCR Services",
        subtitle: "5.1 — Resume & image text extraction providers",
        icon: Eye,
        sectionKey: "ocr",
        providers: OCR_PROVIDERS,
        badgeColor: "light-primary",
      })}

      {renderSection({
        title: "AI Services",
        subtitle: "5.2 — Resume parsing & job description generation",
        icon: Cpu,
        sectionKey: "ai",
        providers: AI_PROVIDERS,
        badgeColor: "light-info",
      })}

      <div className="d-flex justify-content-end mt-2 mb-3">
        <Button color="primary" size="lg" onClick={handleSave} disabled={saving}>
          {saving ? (
            <Spinner size="sm" />
          ) : (
            <>
              <Settings size={16} className="mr-50" />
              Save All Configurations
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default ApiIntegrationConfig;
