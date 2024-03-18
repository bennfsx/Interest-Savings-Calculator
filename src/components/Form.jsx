import React, { useState, useEffect } from "react";
import styles from "./Form.module.css";
import Calculate from "./Calculate";
import style from "./Display.module.css";
import Toggle from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import Disclaimer from "./Disclaimer";

const Form = () => {
  const [accountBalance, setAccountBalance] = useState("");
  const [baseInterest, setBaseInterest] = useState(null);
  const [annualAmount, setAnnualAmount] = useState(null);
  const [monthlyAmount, setMonthlyAmount] = useState(null);
  const [isCreditSalaryValid, setIsCreditSalaryValid] = useState(null);
  const [uniqueBillPayments, setUniqueBillPayments] = useState(false); // Initialize to false
  const [creditCardSpent, setCreditCardSpent] = useState(null);
  const currentDate = new Date().toISOString().slice(0, 10); // Current Date YYYY-MM-DD
  const [disclaimer, setDisclaimer] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `https://api.ocbc.com:8243/OCBC360_Interest/1.0?accountBalance=${accountBalance}`;
        if (isCreditSalaryValid && uniqueBillPayments && creditCardSpent) {
          console.log("paybill Trigger");
          url += `&salary=true&payBill=true&ccSpend=true`;
        } else if (isCreditSalaryValid && uniqueBillPayments) {
          console.log("paybill Trigger");
          url += `&salary=true&payBill=true`;
        } else if (isCreditSalaryValid) {
          console.log("Salary Trigger");
          url += `&salary=true`;
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
          setMonthlyAmount(data.results.totalMonthly);
          setDisclaimer(data.disclaimer);
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [
    accountBalance,
    isCreditSalaryValid,
    uniqueBillPayments,
    creditCardSpent,
    disclaimer,
  ]);

  //set accBalance value as current target value
  const handleAccountBalanceChange = (e) => {
    setAccountBalance(e.target.value.replace("S$", ""));
  };

  const interestRate = (annualAmount / accountBalance) * 100;

  const handleCreditSalaryCheck = (e) => {
    const creditSalary = parseFloat(e.target.value.replace("S$", ""));
    if (!isNaN(creditSalary) && creditSalary >= 1800) {
      setIsCreditSalaryValid(true);
    } else {
      setIsCreditSalaryValid(false);
    }
  };

  const handleUniqueBillPaymentToggle = () => {
    setUniqueBillPayments((prevState) => !prevState);
  };

  useEffect(() => {
    console.log("Unique Bill Payments:", uniqueBillPayments);
  }, [uniqueBillPayments]);

  const handleCreditCardSpending = (e) => {
    const spending = parseFloat(e.target.value.replace("S$", ""));
    if (!isNaN(spending) && spending >= 500) {
      setCreditCardSpent(true);
    } else {
      setCreditCardSpent(false);
    }
  };

  // POST method to airtable
  const handleCalculateSave = async () => {
    try {
      const airtableURL =
        "https://api.airtable.com/v0/appETAOnMCK006o6N/InterestCalculator";
      const response = await fetch(airtableURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer patvMJsFSeycxRJiT.0a334de1aedd5f7ff42ce8d7db915df4c27917c34bc79c7805b1ccdaff50484b",
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                date: currentDate,
                accountBalance: accountBalance.toString(),
                annualAmount: annualAmount.toString(),
                monthlyAmount: monthlyAmount.toString(),
              },
            },
          ],
        }),
      });

      if (response.ok) {
        console.log("Data saved to Airtable successfully");
        navigate("/Dashboard"); // Redirect to Dashboard

        // Clear the form fields or show a success message
      } else {
        console.error("Failed to save data to Airtable:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving data to Airtable:", error.message);
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
            value={"S$" + accountBalance}
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
          Have you made at least 3 unique bill payments?
          <div className={styles.toggleContainer}>
            <label className={styles.toggleLabel}>
              <Toggle.Check
                type="switch"
                id="uniqueBillPaymentsToggle"
                label={uniqueBillPayments ? "Yes" : "No"}
                checked={uniqueBillPayments}
                onChange={handleUniqueBillPaymentToggle}
              />
            </label>
          </div>
          <label className={styles.label}>
            Credit Card Spendings
            <input
              type="text"
              className={styles.input}
              placeholder="S$500"
              onChange={handleCreditCardSpending}
            />
          </label>
        </label>
        <label className={styles.label}>
          Interest Rate &nbsp;
          <input
            type="text"
            className={styles.inputInterest}
            readOnly
            value={
              interestRate !== null
                ? interestRate.toFixed(4) + "%"
                : "Loading..."
            }
          />
        </label>
      </form>

      <div className={style.calculateContainer}>
        <Calculate
          accountBalance={accountBalance}
          annualAmount={annualAmount}
          monthlyAmount={monthlyAmount}
          onSave={handleCalculateSave}
        />
      </div>

      {disclaimer && <Disclaimer disclaimer={disclaimer} />}
    </div>
  );
};

export default Form;
