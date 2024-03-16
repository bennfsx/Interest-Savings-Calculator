import React from "react";
import styles from "./Calculate.module.css";

const Calculate = (props) => {
  // Calculate total amount
  const totalAmount = parseFloat(props.annualAmount) + parseFloat(props.accountBalance);
  
  // Format total amount to 2 decimal places with commas
  const formattedTotalAmount = totalAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Total Savings</h1>
        <p>Estimated Savings</p>
      </div>
      <div className={styles.amountContainer}>
        <div className={styles.amountBox}>
          <p>Annual amount</p>
          <h2>S$ {props.annualAmount}</h2>
        </div>
        <div className={styles.amountBox}>
          <p>Monthly Amount</p>
          <h2>S$ {props.monthlyAmount}</h2>
        </div>

        <div className={styles.amountBox}>
          <p>Total Amount</p>
          <h2>S$ {formattedTotalAmount}</h2>
        </div>
      </div>
      <button className={styles.saveButton} onClick={props.onSave}>Save Results</button>
    </div>
  );
};

export default Calculate;
