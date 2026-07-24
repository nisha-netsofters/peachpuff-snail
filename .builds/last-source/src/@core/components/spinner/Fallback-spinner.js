// ** Logo
import { useSelector } from "react-redux";

const SpinnerComponent = () => {
  const theamcolour = localStorage.getItem("themecolor");
  const agency = useSelector((state) => state?.auth?.user?.agency);
  return (
    <div className="fallback-spinner app-loader">
      {agency?.logo && (
        <img
          className="fallback-logo"
          style={{ width: "300px" }}
          src={agency?.logo}
          alt="logo"
        />
      )}
      <div className="loading">
        <div
          className="effect-1 effects"
          style={{ borderLeft: "3px solid " + theamcolour }}
        ></div>
        <div
          className="effect-2 effects"
          style={{ borderLeft: "3px solid " + theamcolour }}
        ></div>
        <div
          className="effect-3 effects"
          style={{ borderLeft: "3px solid " + theamcolour }}
        ></div>
      </div>
    </div>
  );
};

export default SpinnerComponent;
