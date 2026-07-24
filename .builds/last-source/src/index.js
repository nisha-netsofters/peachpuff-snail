// ** React Imports
import { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

// ** Redux Imports
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";

// ** Intl, CASL & ThemeColors Context
import { ToastContainer } from "react-toastify";
import { AbilityContext } from "./utility/context/Can";
import { ThemeContext } from "./utility/context/ThemeColors";
import Spinner from "./@core/components/spinner/Fallback-spinner";
// ** i18n
// import './configs/i18n'

// ** Spinner (Splash Screen)
// import Spinner from "./@core/components/spinner/Fallback-spinner";

// ** Ripple Button
import "./@core/components/ripple-button";

// ** Fake Database
// import './@fake-db'

// ** PrismJS
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-jsx.min";

// ** React Perfect Scrollbar
import "react-perfect-scrollbar/dist/css/styles.css";

// ** React Toastify
import "@styles/react/libs/toastify/toastify.scss";

// ** Core styles
import "./@core/assets/fonts/feather/iconfont.css";
import "./@core/scss/core.scss";
import "./assets/scss/style.scss";

import "./index.scss";
import { PersistGate } from "redux-persist/integration/react";

// ** Service Worker
import * as serviceWorker from "./serviceWorker";
import { SpeedInsights } from "@vercel/speed-insights/react"

// ** Lazy load app
const LazyApp = lazy(() => import("./App"));

const root = createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Suspense fallback={<Spinner />}>
        <ThemeContext>
          <LazyApp />
          <ToastContainer newestOnTop />
          <SpeedInsights />
        </ThemeContext>
      </Suspense>
    </PersistGate>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
