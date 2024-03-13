import React from "react";
import styles from "./Display.module.css";
import Form from "./Form";
import Calculate from "./Calculate";

const Display = () => {
  return (
    <div className={styles.displaybg}>
      <Form />
    </div>
  );
};

export default Display;
