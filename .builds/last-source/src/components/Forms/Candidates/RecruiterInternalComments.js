import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Col,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import { Edit2, Trash2 } from "react-feather";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  createRecruiterInternalCommentAPI,
  deleteRecruiterInternalCommentAPI,
  getRecruiterInternalCommentsAPI,
  updateRecruiterInternalCommentAPI,
} from "../../../apis/recruiterInternalComments";
import { tostify, tostifySuccess } from "../../Tostify";

const STAFF_ROLES = [
  "Admin",
  "SuperAdmin",
  "Team Leader",
  "BDM",
  "Recruiter",
  "Staff",
];

const formatCommentDateTime = (date) => {
  if (!date) return "-";
  const m = moment(date);
  if (!m.isValid()) return "-";
  if (m.isSame(moment(), "day")) {
    return `Today ${m.format("h:mm A")}`;
  }
  if (m.isSame(moment().subtract(1, "day"), "day")) {
    return `Yesterday ${m.format("h:mm A")}`;
  }
  return m.format("DD MMM YYYY h:mm A");
};

const RecruiterInternalComments = ({
  candidateId,
  isDisabledAllFields = false,
}) => {
  const themecolor = useSelector(
    (state) => state?.agency?.agencyDetail?.themecolor
  );
  const authUser = useSelector((state) => state?.auth?.user);
  const roleName = authUser?.role?.name || "";
  const isStaff = STAFF_ROLES.includes(roleName);
  const isAdmin = ["Admin", "SuperAdmin"].includes(roleName);
  const isClient =
    roleName === "Client" || !!authUser?.clients;
  const isCandidate = roleName === "Candidate";

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [text, setText] = useState("");
  const [visibleToClient, setVisibleToClient] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editVisibleToClient, setEditVisibleToClient] = useState(false);

  const canView =
    !!candidateId &&
    !isCandidate &&
    (isStaff || isClient);

  const loadComments = useCallback(async () => {
    if (!candidateId || !canView) return;
    setLoading(true);
    try {
      const res = await getRecruiterInternalCommentsAPI({
        candidateId,
        page: 1,
        perPage: 100,
      });
      setComments(res?.results || []);
    } catch (err) {
      console.log("load internal comments err", err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [candidateId, canView]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  if (!canView) {
    return null;
  }

  const handleAdd = async () => {
    if (!text.trim() || isDisabledAllFields) return;
    setSaving(true);
    try {
      await createRecruiterInternalCommentAPI({
        candidateId,
        comment: text.trim(),
        visibleToClient: isStaff ? visibleToClient : false,
      });
      setText("");
      setVisibleToClient(false);
      tostifySuccess("Comment added");
      await loadComments();
    } catch (err) {
      tostify(err?.response?.data?.msg || "Failed to add comment");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditText(item.comment || "");
    setEditVisibleToClient(!!item.visibleToClient);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setEditVisibleToClient(false);
  };

  const handleUpdate = async (id) => {
    if (!editText.trim()) return;
    setSaving(true);
    try {
      await updateRecruiterInternalCommentAPI({
        id,
        data: {
          comment: editText.trim(),
          visibleToClient: editVisibleToClient,
        },
      });
      tostifySuccess("Comment updated");
      cancelEdit();
      await loadComments();
    } catch (err) {
      tostify(err?.response?.data?.msg || "Failed to update comment");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "Delete this comment?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ea5455",
      cancelButtonColor: "#82868b",
      // Candidate form Bootstrap modal upar show thay
      heightAuto: false,
      allowOutsideClick: false,
      customClass: {
        container: "recruiter-internal-comment-swal",
      },
      didOpen: () => {
        const container = document.querySelector(
          ".recruiter-internal-comment-swal"
        );
        if (container) {
          container.style.zIndex = "20000";
        }
      },
    });
    if (!result.isConfirmed) return;

    setSaving(true);
    try {
      await deleteRecruiterInternalCommentAPI({ id: item.id });
      tostifySuccess("Comment deleted");
      await loadComments();
    } catch (err) {
      tostify(err?.response?.data?.msg || "Failed to delete comment");
    } finally {
      setSaving(false);
    }
  };

  const canEditItem = (item) =>
    isStaff &&
    !isDisabledAllFields &&
    (isAdmin || item.userId === authUser?.id);

  return (
    <div style={{ marginTop: "20px" }}>
      <Row className="gy-1">
        <Col xs={12}>
          <Label style={{ fontWeight: 600 }}>
            Internal Comments
            {isStaff ? " (Recruiter)" : ""}
          </Label>
        </Col>

        {isStaff && !isDisabledAllFields && (
          <Col xs={12}>
            <Input
              type="textarea"
              rows="3"
              maxLength={1000}
              placeholder="Add internal comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ borderColor: themecolor || undefined }}
            />
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ marginTop: "8px" }}
            >
              <Label
                check
                className="d-flex align-items-center"
                style={{ marginBottom: 0, cursor: "pointer", gap: "6px" }}
              >
                <Input
                  type="checkbox"
                  checked={visibleToClient}
                  onChange={(e) => setVisibleToClient(e.target.checked)}
                />
                Visible to Client
              </Label>
              <Button
                type="button"
                size="sm"
                color="default"
                disabled={saving || !text.trim()}
                onClick={handleAdd}
                style={{ backgroundColor: themecolor, color: "white" }}
              >
                {saving ? <Spinner size="sm" /> : "Add Comment"}
              </Button>
            </div>
          </Col>
        )}

        <Col xs={12}>
          {loading ? (
            <div className="text-center py-2">
              <Spinner size="sm" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
              No internal comments yet.
            </p>
          ) : (
            <div
              style={{
                maxHeight: "280px",
                overflowY: "auto",
                borderTop: "1px solid #eee",
                paddingTop: "8px",
              }}
            >
              {comments.map((item) => {
                const author =
                  item.authorName || item.user?.name || "Recruiter";
                const isEditing = editingId === item.id;
                return (
                  <div
                    key={item.id}
                    style={{
                      padding: "10px 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    {isEditing ? (
                      <>
                        <Input
                          type="textarea"
                          rows="3"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <div
                          className="d-flex align-items-center justify-content-between"
                          style={{ marginTop: "8px" }}
                        >
                          <Label
                            check
                            className="d-flex align-items-center"
                            style={{
                              marginBottom: 0,
                              cursor: "pointer",
                              gap: "6px",
                            }}
                          >
                            <Input
                              type="checkbox"
                              checked={editVisibleToClient}
                              onChange={(e) =>
                                setEditVisibleToClient(e.target.checked)
                              }
                            />
                            Visible to Client
                          </Label>
                          <div>
                            <Button
                              type="button"
                              size="sm"
                              color="secondary"
                              outline
                              className="me-1"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              color="default"
                              disabled={saving || !editText.trim()}
                              onClick={() => handleUpdate(item.id)}
                              style={{
                                backgroundColor: themecolor,
                                color: "white",
                              }}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <p
                          style={{
                            marginBottom: "4px",
                            whiteSpace: "pre-wrap",
                            fontSize: "14px",
                          }}
                        >
                          {item.comment}
                        </p>
                        <div
                          className="d-flex align-items-center justify-content-between"
                          style={{ fontSize: "12px", color: "#6e6b7b" }}
                        >
                          <span>
                            - {author}
                            {" · "}
                            {formatCommentDateTime(item.createdAt)}
                            {item.visibleToClient ? " · Client visible" : ""}
                          </span>
                          {canEditItem(item) && (
                            <span className="d-flex align-items-center">
                              <span
                                style={{ cursor: "pointer", marginRight: 8 }}
                                onClick={() => startEdit(item)}
                                title="Edit"
                              >
                                <Edit2 size={14} />
                              </span>
                              <span
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDelete(item);
                                }}
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </span>
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default RecruiterInternalComments;
export { formatCommentDateTime };
