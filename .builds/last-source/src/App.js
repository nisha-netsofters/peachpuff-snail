// ** Router Import
// import { useEffect } from 'react'
// import { useSelector } from 'react-redux'
// import { useHistory } from 'react-router-dom'
import Router from "./router/Router";
import Protected from "./PrivateRoutes";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import DocumentationModal from "./components/DocumentationModal";
import Index from "./views/Pages/FooterPolicy/Policy";
import CancellationAndRefund from "./views/Pages/FooterPolicy/CancellationAndRefund";

const App = () => {
  const { user } = useSelector((state) => state.auth);

  
  // const [modal, setModal] = useState(false);

  useEffect(() => {
    if (
      user?.role?.name === "Client" &&
      localStorage.getItem("modal") === null
    ) {
      localStorage.setItem("modal", true);
      // setModal(true);
    }
  }, [user]);
  // const isLoggedIn = useSelector((state) => state.user.token)
  // console.log(isLoggedIn)

  return (
    <>
      {/* <Protected isLoggedIn={isLoggedIn}> */}
      <Router />
      {/* {modal && <DocumentationModal modal={modal} setModal={setModal} />} */}
      {/* <Index /> */}

      {/* </Protected> */}
    </>
  );
};

export default App;
