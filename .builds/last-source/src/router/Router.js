import { Suspense, lazy, Fragment, useEffect } from "react";
import { useLayout } from "@hooks/useLayout";
import { useRouterTransition } from "@hooks/useRouterTransition";
import LayoutWrapper from "@layouts/components/layout-wrapper";
import {
  BrowserRouter as AppRouter,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Routes } from "./routes";
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import HorizontalLayout from "@src/layouts/HorizontalLayout";
import PrivateRoute from "../PrivateRoutes";
import { useDispatch, useSelector } from "react-redux";
import actions from "../redux/auth/actions";
import PublicCandidate from "../views/Pages/PublicCandidate";
import PublicClient from "../views/Pages/PublicClient";
import LandingPage from "../views/Pages/LandingPage/LandingPage";
import Policy from "../views/Pages/FooterPolicy/Policy";
import Error from "../views/Error";
import CancellationAndRefund from "../views/Pages/FooterPolicy/CancellationAndRefund";
import ContactUs from "../views/Pages/FooterPolicy/ContactUs";
import TermsAndCondition from "../views/Pages/FooterPolicy/TermsAndCondition";
import ShippingAndDelivery from "../views/Pages/FooterPolicy/ShippingAndDelivery";
import Login from "../views/Pages/Login";
import SuperAdminLogin from "../views/Pages/superAdminPages/Login";
import Pricing from "../views/Pages/LandingPage/Pricing/Pricing";
import ClientRegistration from "../views/Pages/ClientRegistration";
import ForgotPassword from "../components/Forms/Login/ForgotPassword";
import { canAccessOnBoarding } from "../utility/canAccessOnBoarding";

const Router = () => {
  const { layout, setLayout, setLastLayout } = useLayout();
  const { transition, setTransition } = useRouterTransition();
  const { user } = useSelector((state) => state.auth); // Fixed: use state.auth instead of state.user

  const DefaultLayout =
    layout === "horizontal" ? "HorizontalLayout" : "VerticalLayout";

  const Layouts = { BlankLayout, VerticalLayout, HorizontalLayout };

  const currentActiveItem = null;

  // useEffect(() => {
  //   async function fetchData() {
  //     const token = localStorage.getItem("token");
  //     if (token) {
  //       const check_token_timeOut = await check_token(token);

  //       if (check_token_timeOut.expired != false) {
  //         localStorage.clear();
  //         window.localStorage.removeItem("persist:root");
  //         persistor.pause();
  //       }
  //     }
  //   }
  //   fetchData();
  // }, [user]);

  const LayoutRoutesAndPaths = (layout) => {
    const LayoutRoutes = [];
    const LayoutPaths = [];
    if (Routes) {
      Routes.filter((route) => {
        if (
          route.layout === layout ||
          (route.layout === undefined && DefaultLayout === layout)
        ) {
          // Only filter by role when we have a real role; otherwise keep
          // routes registered so PrivateRoute can send users to /login.
          if (user?.role?.name) {
            const roleAllowed = route.permission.includes(user.role.name) === true;
            const onboardingAllowed =
              route.path !== "/:slug/onboarding" || canAccessOnBoarding(user);
            if (
              (roleAllowed && onboardingAllowed) ||
              route.meta?.authRoute === true
            ) {
              LayoutRoutes.push(route);
              LayoutPaths.push(route.path);
            }
          } else {
            LayoutRoutes.push(route);
            LayoutPaths.push(route.path);
          }
        }
      });
    }
    return { LayoutRoutes, LayoutPaths };
  };

  const NotAuthorized = lazy(() => import("@src/views/NotAuthorized"));

  const ResolveRoutes = () => {
    return Object.keys(Layouts).map((layout, index) => {
      const LayoutTag = Layouts[layout];

      const { LayoutRoutes, LayoutPaths } = LayoutRoutesAndPaths(layout);

      const routerProps = {};

      return (
        <Route path={LayoutPaths} key={index}>
          <LayoutTag
            layout={layout}
            setLayout={setLayout}
            transition={transition}
            routerProps={routerProps}
            setLastLayout={setLastLayout}
            setTransition={setTransition}
            currentActiveItem={currentActiveItem}
          >
            <Switch>
              {LayoutRoutes?.map((route) => {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact === true}
                    render={(props) => {
                      Object.assign(routerProps, {
                        ...props,
                        meta: route.meta,
                      });

                      return (
                        <Fragment>
                          {route.layout === "BlankLayout" ? (
                            <Fragment>
                              <route.component {...props} />
                            </Fragment>
                          ) : (
                            <LayoutWrapper
                              layout={DefaultLayout}
                              transition={transition}
                              setTransition={setTransition}
                              {...(route.appLayout
                                ? {
                                    appLayout: route.appLayout,
                                  }
                                : {})}
                              {...(route.meta
                                ? {
                                    routeMeta: route.meta,
                                  }
                                : {})}
                              {...(route.className
                                ? {
                                    wrapperClass: route.className,
                                  }
                                : {})}
                            >
                              <Suspense fallback={<div>Loading...</div>}>
                                <PrivateRoute
                                  key={props.location.pathname} // Add key to force remount on route change
                                  component={route.component}
                                  {...props}
                                />
                              </Suspense>
                            </LayoutWrapper>
                          )}
                        </Fragment>
                      );
                    }}
                  />
                );
              })}
            </Switch>
          </LayoutTag>
        </Route>
      );
    });
  };

  const dispatch = useDispatch();
  
  useEffect(() => {
    async function fetchData() {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (token && user) {
        dispatch({
          type: actions.SET_STATE,
          payload: {
            user,
            token,
          },
        });
      }
    }
    fetchData();
  }, [dispatch]);

  return (
    <AppRouter>
      <Switch>
        <Route
          exact
          path={"/"}
          render={() => {
            return <LandingPage />;
          }}
        />
        <Route
          path="/:slug/candidate/apply"
          exact
          render={() => {
            return <PublicCandidate />;
          }}
        />

        <Route
          path="/login"
          exact
          render={() => {
            return <Login />;
          }}
        />
        <Route
          path="/superadmin/login"
          exact
          render={() => {
            return <SuperAdminLogin />;
          }}
        />
        <Route
          path="/forgotpassword"
          exact
          render={() => {
            return <ForgotPassword />;
          }}
        />
        <Route
          path={"/:slug/client-registration"}
          exact
          render={() => <PublicClient />}
        />
        <Route
          path={"/client-registration"}
          exact
          render={() => <ClientRegistration />}
        />
        <Route path={"/policy"} exact render={() => <Policy />} />
        <Route
          path={"/refund"}
          exact
          render={() => <CancellationAndRefund />}
        />
        <Route path={"/contact_us"} exact render={() => <ContactUs />} />
        <Route path={"/plan-pricing"} exact render={() => <Pricing />} />
        <Route
          path={"/shipping"}
          exact
          render={() => <ShippingAndDelivery />}
        />
        <Route path={"/terms"} exact render={() => <TermsAndCondition />} />
          {/* <Route
          exact
          path={"/"}
          render={() => {
            return <Redirect to={user?.clients?.id ? "/candidate" : "/dashboard"} />
          }}
        /> */}

        {user?.clients?.id && (
          <Route
            exact
            path={"/dashboard"}
            render={() => {
              return <Redirect to={"/candidate"} />;
            }}
          />
        )}
        <Route
          exact
          path="/misc/not-authorized"
          render={() => (
            <Layouts.BlankLayout>
              <NotAuthorized />
            </Layouts.BlankLayout>
          )}
        />
        {ResolveRoutes()}
        <Route
          path="*"
          render={({ location }) => {
            const token = localStorage.getItem("token");
            let storedUser = null;
            try {
              storedUser = JSON.parse(localStorage.getItem("user") || "null");
            } catch (e) {
              storedUser = null;
            }

            // Old WhatsApp profile links: /{slug}/candidate?id=...
            // Candidates cannot open the recruiter candidate page → send to Profile
            const candidateDeepLink = (location.pathname || "").match(
              /^\/([^/]+)\/candidate\/?$/
            );
            const hasCandidateId = new URLSearchParams(
              location.search || ""
            ).has("id");
            if (candidateDeepLink && hasCandidateId) {
              const profilePath = `/${candidateDeepLink[1]}/profile`;
              if (
                !token ||
                token === "null" ||
                token === "undefined"
              ) {
                return (
                  <Redirect
                    to={`/login?redirect=${encodeURIComponent(profilePath)}`}
                  />
                );
              }
              if (storedUser?.role?.name === "Candidate") {
                return <Redirect to={profilePath} />;
              }
            }

            if (
              !token ||
              token === "null" ||
              token === "undefined"
            ) {
              const returnTo = `${location.pathname || ""}${location.search || ""}`;
              const safe =
                returnTo.startsWith("/") && !returnTo.startsWith("//")
                  ? returnTo
                  : "";
              return (
                <Redirect
                  to={
                    safe
                      ? `/login?redirect=${encodeURIComponent(safe)}`
                      : "/login"
                  }
                />
              );
            }
            return <Error />;
          }}
        />
      </Switch>
    </AppRouter>
  );
};

export default Router;