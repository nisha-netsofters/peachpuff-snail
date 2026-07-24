import { Route, Redirect } from "react-router-dom";
import { persistor } from "./redux/store";
import { getAgencyDetailBySlug } from "./apis/agency";
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import agencyActions from "./redux/agency/actions";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("token");
  const params = useParams();
  const location = useLocation(); // Add location to track route changes
  const dispatch = useDispatch();
  const [agencyError, setAgencyError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setAgencyError(false); // Reset error state on route change
      
      if (user?.role?.name !== "SuperAdmin" && params?.slug) {
        try {
          const resp = await getAgencyDetailBySlug(params?.slug);

          if (resp?.error === "Your slug is not present in agency") {
            setAgencyError(true);
          } else {
            dispatch({
              type: agencyActions.SET_AGENCY_STATE,
              payload: {
                agencyDetail: resp,
              },
            });
          }
        } catch (error) {
          console.error("Error fetching agency details:", error);
          setAgencyError(true);
        }
      }
      
      setLoading(false);
    })();
  }, [params?.slug, user?.role?.name, location.pathname ,dispatch]); // Add dependencies

  if (
    token === null ||
    token === "null" ||
    token === undefined ||
    token === "undefined"
  ) {
    localStorage.clear();
    window.localStorage.removeItem("persist:root");
    persistor.pause();
    return <Redirect to="/login" />;
  }

  if (agencyError) {
    return <Redirect to="/error" />;
  }

  if (loading && params?.slug) {
    return <div>Loading...</div>; // Or your loading component
  }

  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default PrivateRoute;