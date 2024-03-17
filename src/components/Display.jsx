import React from "react";
import styles from "./Display.module.css";
import Form from "./Form";
import FinancialGoal from "./FinancialGoal";

const Display = () => {
  return (
    <div className={styles.displaybg}>
      <Form />
    </div>
  );
};

export default Display;
