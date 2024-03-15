import React, { useState, useEffect } from "react";
import styles from "./Form.module.css";
import Calculate from "./Calculate";
import style from "./Display.module.css";

const Form = (props) => {
  const [accountBalance, setAccountBalance] = useState("");
  const [baseInterest, setBaseInterest] = useState(null);
  const [salaryBonus, setSalaryBonus] = useState(null);
  const [payBillBonus, setPayBillBonus] = useState(null);
  const [ccSpendBonus, setccSpendBonus] = useState(null);
  const [isCreditSalaryValid, setIsCreditSalaryValid] = useState(null);
  const [calculate, setCalculate] = useState([]);

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
          setSalaryBonus(data.results.component.salaryBonus);
          setPayBillBonus(data.results.component.payBillBonus);
          setccSpendBonus(data.result.component.ccSpendBonus);
          console.log(setBaseInterest);
          console.log(setSalaryBonus);
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
          Number of bills Paid
          <input
            type="text"
            className={styles.input}
            placeholder="3"
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
        {/* <button type="submit" className={styles.calculateButton}>
          Calculate
        </button> */}
      </form>

      <div className={style.calculateContainer}>
        <Calculate ></Calculate>
    {/* <div>
      <h1>Calculate Testing</h1>
      {calculate.map((item, index)=> (
            <Calculate
            id={item.id}
            annualAmount={item.annualAmount}
            monthlyAmount={item.monthlyAmount}
            // onUpdate={handleAccountBalanceChange}
            /> 

      )) }
    </div> */}
    
      </div>
    </div>
  );
};

export default Form;
