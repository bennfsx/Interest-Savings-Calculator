import React, { useState } from "react";
import styles from "./FinancialGoal.module.css";

const FinancialGoal = ({ accumulatedAmount }) => {
  const [goalAmount, setGoalAmount] = useState(0);
  const [timeToGoal, setTimeToGoal] = useState(null);

  const handleGoalAmountChange = (e) => {
    const amount = parseFloat(e.target.value.replace("S$", ""));
    setGoalAmount(isNaN(amount) ? 0 : amount);
  };

  const calculateTimeToGoal = () => {
    if (goalAmount <= accumulatedAmount) {
      setTimeToGoal("Already achieved!");
    } else {
      const interestRate = 0.05; // Example annual interest rate (5%)
      const monthlySavings = 500; // Example monthly savings amount
      let currentAmount = accumulatedAmount;
      let months = 0;

      while (currentAmount < goalAmount) {
        const monthlyInterest = currentAmount * (interestRate / 12);
        currentAmount += monthlyInterest + monthlySavings;
        months++;
      }

      setTimeToGoal(months);
    }
  };

  return (
    <div className={styles.goalContainer}>
      <h2>Set Your Savings Goal</h2>
      <div className={styles.inputContainer}>
        <label className={styles.label}>Goal Amount:</label>
        <input
          type="text"
          className={styles.input}
          placeholder="S$100,000"
          value={"S$" + goalAmount}
          onChange={handleGoalAmountChange}
        />
      </div>
      <button className={styles.calculateButton} onClick={calculateTimeToGoal}>
        Calculate Time to Reach Goal
      </button>
      {timeToGoal !== null && (
        <div className={styles.resultContainer}>
          <p>
            Time to reach goal: {timeToGoal === "Already achieved!" ? timeToGoal : `${timeToGoal} months`}
          </p>
        </div>
      )}
    </div>
  );
};

export default FinancialGoal;
