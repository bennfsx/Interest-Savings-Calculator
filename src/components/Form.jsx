import React, { useState, useEffect } from "react";
import styles from "./Form.module.css";
import Calculate from "./Calculate";
import style from "./Display.module.css";

const Form = (props) => {
  const [accountBalance, setAccountBalance] = useState("");
  const [baseInterest, setBaseInterest] = useState(null);
  const [annualAmount, setAnnualAmount] = useState(null);
  const [monthlyAmount, setMonthlyAmount] = useState(null);
  const [isCreditSalaryValid, setIsCreditSalaryValid] = useState(null);
  const [salaryBonus, setSalaryBonus] = useState(null);
  const [uniqueBillPayments, setUniqueBillPayments] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `https://api.ocbc.com:8243/OCBC360_Interest/1.0?accountBalance=${accountBalance}`;
        if (isCreditSalaryValid)  {
          url += `&salary=true`;
        } else if (isCreditSalaryValid !== null && !uniqueBillPayments) {
          url += `&salary=true&payBill=true`;
        }
        const response = await fetch(url, {
          headers: {
            Authorization: "Bearer 09bc8a7e-728d-3abb-ab56-945e58871f3b",
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setBaseInterest(data.results.component.baseInterest);
          setAnnualAmount(data.results.totalYearly);
          setSalaryBonus(data.results.component.salaryBonus);
          setMonthlyAmount(data.results.totalMonthly);
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
  
    fetchData();
  }, [accountBalance, isCreditSalaryValid, uniqueBillPayments]);

  const handleAccountBalanceChange = (e) => {
    setAccountBalance(e.target.value);
  };

  const interestRate = ((annualAmount) / accountBalance) * 100;

  const handleCreditSalaryCheck = (e) => {
    const creditSalary = parseFloat(e.target.value);
    if (!isNaN(creditSalary) && creditSalary >= 1800) {
      setIsCreditSalaryValid(true);
    } else {
      setIsCreditSalaryValid(false);
    }
  };

  const handleToggleBillPayments = () => {
    setUniqueBillPayments((prevState) => !prevState);
  };
  
  return (
    <div className={styles.formContainer}>
      <h1 className={styles.formTitle}>Savings Interest Calculator</h1>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
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
          Made at least 3 unique bill payments?
          <button onClick={handleToggleBillPayments}>
            {uniqueBillPayments ? "No" : "Yes"}
          </button>
        </label>
        <label className={styles.label}>
          Interest Rate &nbsp;
          <input
            type="text"
            className={styles.inputInterest}
            readOnly
            value={interestRate !== null ? interestRate.toFixed(4) + "%" : "Loading..."}
          />
        </label>
      </form>

      <div className={style.calculateContainer}>
        <Calculate annualAmount={annualAmount} monthlyAmount={monthlyAmount} />
      </div>
    </div>
  );
};

export default Form;
