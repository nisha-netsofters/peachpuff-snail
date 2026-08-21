import { Route, Redirect } from "react-router-dom";
import { persistor } from "./redux/store";
import { getAgencyDetailBySlug } from "./apis/agency";
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import agencyActions from "./redux/agency/actions";
import authActions from "./redux/auth/actions";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("token");
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const [agencyError, setAgencyError] = useState(false);
  const [loading, setLoading] = useState(Boolean(params?.slug));
  const { user } = useSelector((state) => state.auth);
  const userRef = useRef(user);
  userRef.current = user;
  const loadedSlugRef = useRef(null);

  const hasToken =
    Boolean(token) && token !== "null" && token !== "undefined";

  // Fetch agency once per slug — do NOT re-run on every user redux update
  // (that was unmounting the page and looked like a continuous refresh).
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!hasToken) {
        setLoading(false);
        return;
      }

      if (!params?.slug) {
        setLoading(false);
        return;
      }

      if (userRef.current?.role?.name === "SuperAdmin") {
        setLoading(false);
        return;
      }

      // Already loaded this slug in this mount cycle — keep page mounted
      if (loadedSlugRef.current === params.slug) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setAgencyError(false);

      try {
        const resp = await getAgencyDetailBySlug(params.slug);

        if (cancelled) return;

        if (resp?.msg === "invalid token or expired token") {
          localStorage.clear();
          window.localStorage.removeItem("persist:root");
          persistor.pause();
          dispatch({
            type: authActions.SET_STATE,
            payload: { token: null, user: null },
          });
          setAgencyError("auth");
        } else if (resp?.error === "Your slug is not present in agency") {
          setAgencyError("slug");
        } else {
          loadedSlugRef.current = params.slug;
          dispatch({
            type: agencyActions.SET_AGENCY_STATE,
            payload: { agencyDetail: resp },
          });
        }
      } catch (error) {
        console.error("Error fetching agency details:", error);
        if (!cancelled) setAgencyError("slug");
      }

      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [params?.slug, location.pathname, dispatch, hasToken]);

  const loginRedirectTo = () => {
    let returnTo = `${location.pathname || ""}${location.search || ""}`;
    const candidateMatch = (location.pathname || "").match(
      /^\/([^/]+)\/candidate\/?$/
    );
    if (
      candidateMatch &&
      new URLSearchParams(location.search || "").has("id")
    ) {
      returnTo = `/${candidateMatch[1]}/profile`;
    }
    const safe =
      returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "";
    return safe
      ? `/login?redirect=${encodeURIComponent(safe)}`
      : "/login";
  };

  if (!hasToken) {
    return <Redirect to={loginRedirectTo()} />;
  }

  if (agencyError === "auth") {
    return <Redirect to={loginRedirectTo()} />;
  }

  if (agencyError === "slug") {
    return <Redirect to="/error" />;
  }

  if (loading && params?.slug) {
    return <div>Loading...</div>;
  }

  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default PrivateRoute;
