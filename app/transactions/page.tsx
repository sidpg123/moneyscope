"use client";
import {
  selectedDateAtom,
  totalExpensesAtom,
  totalIncomeAtom,
  transactionsAtom,
} from "@/state/RecoilState";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
// import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "@/components/DatePicker";
import { AddTransaction } from "@/components/Transaction/AddTransaction";
import { columns } from "@/components/Transaction/Columns";
import { DataTable } from "@/components/Transaction/DataTable";

export default function Transactions() {
  const selectedDate = useRecoilValue(selectedDateAtom);
  // const [selectedDate, setSelectedDate] = useRecoilState(selectedDateAtom);
  const [transactions, setTransactions] = useRecoilState(transactionsAtom);
  const [totalIncome, setTotalIncome] = useRecoilState(totalIncomeAtom);
  const [totalExpenses, setTotalExpenses] = useRecoilState(totalExpensesAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      const localDate = new Date(selectedDate);
      localDate.setHours(localDate.getHours() + 5, localDate.getMinutes() + 30); // ✅ Correct

      console.log("selectedDate", selectedDate);
      console.log("localDate", localDate);
      const date = localDate.toISOString().split("T")[0];
      console.log("Formatted Date for API:", date); // This should be in YYYY-MM-DD
      // console.log("Selected Date:", selectedDate); // This logs the original Date object

      try {
        const res = await fetch(`/api/transactions/by-date/${date}`);
        if (!res.ok) throw new Error("Failed to fetch transactions");
        const data = await res.json();
        setTransactions(data.transactions);
        setTotalIncome(data.totalIncome);
        setTotalExpenses(data.totalExpenses);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
      setLoading(false)
    };

    fetchTransactions();
  }, [selectedDate]);

  return (
    <div className="flex flex-col p-6 w-[95vw] md:w-[80vw] mx-auto bg-white shadow-lg rounded-xl">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800 tracking-wider">
        Wellcome Siddharth!
      </h1>

      {/* Top Bar: Date Picker, Add Transaction, and Summary in One Row */}
      <div className="flex flex-col sm:flex-row  items-center justify-between  gap-4 p-4 rounded-lg shadow-md">
        {/* Date Picker */}
        <div className=" flex flex-col gap-6 ">
          <DatePicker />

          {/* Add Transaction Button */}
          <AddTransaction />
        </div>

        {/* Income & Expense Summary */}
        <div className="flex flex-col md:flex-col  gap-2 md:gap-4">
          <div className="flex-1 text-center bg-green-100 text-green-700 px-3 py-2 text-sm md:px-5 md:py-3 md:text-base rounded-full shadow font-semibold">
            💰 Total Income: ₹{totalIncome}
          </div>
          <div className="flex-1 text-center bg-red-100 text-red-700 px-3 py-2 text-sm md:px-5 md:py-3 md:text-base rounded-full shadow font-semibold">
            💸 Total Expenses: ₹{totalExpenses}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="mt-6">
        <DataTable loading={loading} columns={columns} data={transactions} />
      </div>
    </div>
  );
}
