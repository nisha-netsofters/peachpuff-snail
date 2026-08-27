import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, ButtonGroup, Spinner } from "reactstrap";
import {
  Download,
  FileText,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  Maximize,
} from "react-feather";
import mammoth from "mammoth";

const isPdf = (path) => /\.pdf($|\?|#)/i.test(String(path || ""));
const isDocx = (path) => /\.docx($|\?|#)/i.test(String(path || ""));
const isDoc = (path) => /\.doc($|\?|#)/i.test(String(path || "")) && !isDocx(path);
const isOffice = (path) => isDocx(path) || isDoc(path);
const isImage = (path) =>
  /\.(png|jpe?g|gif|webp|bmp|svg)($|\?|#)/i.test(String(path || ""));

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

const ResumeViewer = () => {
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const fileUrl = params.get("url") || "";
  const fileName = params.get("name") || "resume";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewKind, setPreviewKind] = useState(""); // iframe | image | html
  const [blobUrl, setBlobUrl] = useState("");
  const [zoom, setZoom] = useState(1);

  const pdf = isPdf(fileName) || isPdf(fileUrl);
  const office = isOffice(fileName) || isOffice(fileUrl);
  const docx = isDocx(fileName) || isDocx(fileUrl);
  const image = isImage(fileName) || isImage(fileUrl);
  const publicHttps =
    /^https:\/\//i.test(fileUrl) && !/localhost|127\.0\.0\.1/.test(fileUrl);

  useEffect(() => {
    let revoked = null;
    let cancelled = false;

    const load = async () => {
      setError("");
      setPreviewUrl("");
      setPreviewHtml("");
      setPreviewKind("");
      setBlobUrl("");
      setZoom(1);

      if (!fileUrl) {
        setError("Resume file not available");
        setLoading(false);
        return;
      }

      // Images (png / jpg / gif / webp …)
      if (image) {
        if (!cancelled) {
          setPreviewUrl(fileUrl);
          setPreviewKind("image");
          setLoading(false);
        }
        return;
      }

      // Word on public HTTPS — Office Online embed
      if (office && publicHttps) {
        if (!cancelled) {
          setPreviewUrl(
            `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
              fileUrl
            )}`
          );
          setPreviewKind("iframe");
          setLoading(false);
        }
        return;
      }

      // PDF — fetch blob for reliable browser preview
      if (pdf) {
        try {
          const res = await fetch(fileUrl);
          if (!res.ok) {
            setError(
              res.status === 404
                ? "Resume file not found on server."
                : "Unable to load resume."
            );
            setLoading(false);
            return;
          }
          const blob = await res.blob();
          if (blob.type && blob.type.includes("text/html")) {
            setError("Resume file not found on server.");
            setLoading(false);
            return;
          }
          const typed = new Blob([blob], { type: "application/pdf" });
          const objectUrl = URL.createObjectURL(typed);
          revoked = objectUrl;
          if (!cancelled) {
            setPreviewUrl(objectUrl);
            setBlobUrl(objectUrl);
            setPreviewKind("iframe");
            setLoading(false);
          }
        } catch (e) {
          if (!cancelled) {
            setError("Unable to load resume.");
            setLoading(false);
          }
        }
        return;
      }

      // Local / private .docx — convert to HTML with mammoth
      if (docx) {
        try {
          const res = await fetch(fileUrl);
          if (!res.ok) {
            setError(
              res.status === 404
                ? "Resume file not found on server."
                : "Unable to load resume."
            );
            setLoading(false);
            return;
          }
          const arrayBuffer = await res.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });
          const objectUrl = URL.createObjectURL(
            new Blob([arrayBuffer], {
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            })
          );
          revoked = objectUrl;
          if (!cancelled) {
            setPreviewHtml(result.value || "<p>Empty document</p>");
            setBlobUrl(objectUrl);
            setPreviewKind("html");
            setLoading(false);
          }
        } catch (e) {
          if (!cancelled) {
            setError("");
            setPreviewKind("");
            setLoading(false);
          }
        }
        return;
      }

      // Old .doc or unknown — download only
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [fileUrl, fileName, pdf, office, docx, image, publicHttps]);

  const handleDownload = async () => {
    try {
      if (blobUrl) {
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
    } catch (e) {
      window.location.href = fileUrl;
    }
  };

  const zoomIn = () =>
    setZoom((z) => Math.min(MAX_ZOOM, Math.round((z + ZOOM_STEP) * 100) / 100));
  const zoomOut = () =>
    setZoom((z) => Math.max(MIN_ZOOM, Math.round((z - ZOOM_STEP) * 100) / 100));
  const zoomReset = () => setZoom(1);

  const onImageWheel = (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#e8eaed",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e0e0e0",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div className="d-flex align-items-center gap-1" style={{ minWidth: 0 }}>
          <Button
            color="flat-secondary"
            size="sm"
            onClick={() => window.close()}
          >
            <ArrowLeft size={16} className="me-50" />
            Close
          </Button>
          <strong
            style={{
              marginLeft: 8,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 280,
            }}
          >
            {fileName}
          </strong>
        </div>

        <div className="d-flex align-items-center gap-1">
          {previewKind === "image" && !loading && !error ? (
            <ButtonGroup size="sm" className="me-1">
              <Button
                color="secondary"
                outline
                onClick={zoomOut}
                disabled={zoom <= MIN_ZOOM}
                title="Zoom out"
              >
                <ZoomOut size={16} />
              </Button>
              <Button
                color="secondary"
                outline
                onClick={zoomReset}
                title="Fit to width"
                style={{ minWidth: 64 }}
              >
                {Math.round(zoom * 100)}%
              </Button>
              <Button
                color="secondary"
                outline
                onClick={zoomIn}
                disabled={zoom >= MAX_ZOOM}
                title="Zoom in"
              >
                <ZoomIn size={16} />
              </Button>
              <Button
                color="secondary"
                outline
                onClick={zoomReset}
                title="Fit to width"
              >
                <Maximize size={16} />
              </Button>
            </ButtonGroup>
          ) : null}
          <Button
            color="primary"
            size="sm"
            disabled={!fileUrl || !!error}
            onClick={handleDownload}
          >
            <Download size={16} className="me-50" />
            Download
          </Button>
        </div>
      </div>

      <div style={{ flex: 1, padding: previewKind === "image" ? 0 : 12 }}>
        {loading ? (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "70vh" }}
          >
            <Spinner color="primary" />
          </div>
        ) : error ? (
          <div
            className="d-flex flex-column align-items-center justify-content-center text-center"
            style={{ minHeight: "60vh" }}
          >
            <FileText size={48} className="mb-1" />
            <p className="text-danger mb-0">{error}</p>
          </div>
        ) : previewKind === "image" && previewUrl ? (
          <div
            onWheel={onImageWheel}
            style={{
              height: "calc(100vh - 58px)",
              overflow: "auto",
              background: "#525659",
              padding: "16px 0",
            }}
          >
            <div
              style={{
                width: `${zoom * 100}%`,
                maxWidth: "none",
                margin: "0 auto",
                padding: "0 12px",
                boxSizing: "border-box",
              }}
            >
              <img
                src={previewUrl}
                alt={fileName}
                draggable={false}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  margin: "0 auto",
                  background: "#fff",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.35)",
                }}
              />
            </div>
          </div>
        ) : previewKind === "html" && previewHtml ? (
          <div
            style={{
              minHeight: "calc(100vh - 90px)",
              background: "#fff",
              borderRadius: 8,
              padding: "24px 32px",
              overflow: "auto",
              lineHeight: 1.6,
            }}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        ) : previewKind === "iframe" && previewUrl ? (
          <iframe
            title="Resume"
            src={previewUrl}
            style={{
              width: "100%",
              height: "calc(100vh - 90px)",
              border: "none",
              background: "#fff",
              borderRadius: 8,
            }}
          />
        ) : (
          <div
            className="d-flex flex-column align-items-center justify-content-center text-center"
            style={{
              minHeight: "60vh",
              background: "#fff",
              borderRadius: 8,
              padding: 24,
            }}
          >
            <FileText size={48} className="mb-1" />
            <p className="mb-1">
              <strong>{fileName}</strong>
            </p>
            <p className="text-muted mb-2">
              {isDoc(fileName) || isDoc(fileUrl)
                ? "Old Word (.doc) format cannot be previewed in browser. Use Download to open the file."
                : "Preview is not available for this file type. Use Download to open the file."}
            </p>
            <Button color="primary" onClick={handleDownload}>
              <Download size={16} className="me-50" />
              Download
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeViewer;
