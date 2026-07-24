const ComponentSpinner = ({ isClientCandidate = false, theamcolour }) => {
  return (
    <div
      className="fallback-spinner"
      style={isClientCandidate ? { height: "500px" } : {}}
    >
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

export default ComponentSpinner;
