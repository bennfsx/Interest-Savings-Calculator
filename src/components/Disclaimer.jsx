import React from "react";

const Disclaimer = (props) => {
  return (
    <div>
      <p>
        <b>Disclaimer: </b>
        {props.disclaimer}
      </p>
    </div>
  );
};

export default Disclaimer;
