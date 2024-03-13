import React, { useState, useEffect } from "react";
import styles from "./Form.module.css";
import Calculate from "./Calculate";
import style from "./Display.module.css";

const Form = (props) => {
  const [accountBalance, setAccountBalance] = useState("");
  const [baseInterest, setBaseInterest] = useState(null);

  const [isCreditSalaryValid, setIsCreditSalaryValid] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.ocbc.com:8243/OCBC360_Interest/1.0?accountBalance=${accountBalance}`,
          {
            headers: {
              Authorization: "Bearer 09bc8a7e-728d-3abb-ab56-945e58871f3b",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setBaseInterest(data.results.component.baseInterest);
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [accountBalance]); // Trigger useEffect on accountBalance change

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.ocbc.com:8243/OCBC360_Interest/1.0?accountBalance=${creditSalary}`,
          {
            headers: {
              Authorization: "Bearer 09bc8a7e-728d-3abb-ab56-945e58871f3b",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setBaseInterest(data.results.component.baseInterest);
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [accountBalance]); // Trigger useEffect on accountBalance change

  const handleAccountBalanceChange = (e) => {
    setAccountBalance(e.target.value);
  };

  const interestRate = (baseInterest / accountBalance) * 100;

  const handleCreditSalaryCheck = (e) => {
    const creditSalary = parseFloat(e.target.value);

    if (!isNaN(creditSalary) && creditSalary > 1800) {
      setIsCreditSalaryValid(true);
    } else {
      setIsCreditSalaryValid(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.formTitle}>Savings Interest Calculator</h1>
      <form className={styles.form}>
        <label className={styles.label}>
          Account Balance
          <input
            type="text"
            className={styles.input}
            placeholder="S$50,000"
            value={accountBalance}
            onChange={handleAccountBalanceChange}
          />
        </label>
        <label className={styles.label}>
          Credit Salary
          <input
            type="text"
            className={styles.input}
            placeholder="S$52,000"
            onChange={handleCreditSalaryCheck}
          />
        </label>
        <label className={styles.label}>
          Interest Rate &nbsp;
          <input
            type="text"
            className={styles.inputInterest}
            readOnly
            value={interestRate !== null ? interestRate + "%" : "Loading..."}
          />
        </label>
        <button type="submit" className={styles.calculateButton}>
          Calculate
        </button>
      </form>

      <div className={style.calculateContainer}>
        <Calculate />
      </div>
    </div>
  );
};

export default Form;
