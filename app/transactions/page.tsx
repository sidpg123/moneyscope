"use client";
import { useEffect, useState, useTransition } from "react";
import { useRecoilState } from "recoil";
import {
  selectedDateAtom,
  transactionsAtom,
  totalIncomeAtom,
  totalExpensesAtom,
} from "@/state/RecoilState";
// import "react-datepicker/dist/react-datepicker.css";
import { fetchTransactionsByDate } from "@/actions/FetchTransaction";
import DatePicker from "@/components/DatePicker";
import { AddTransaction } from "@/components/Transaction/AddTransaction";
import { DataTable } from "@/components/Transaction/DataTable";
import { columns } from "@/components/Transaction/Columns";

export default function Transactions() {
  const [selectedDate, setSelectedDate] = useRecoilState(selectedDateAtom);
  const [transactions, setTransactions] = useRecoilState(transactionsAtom);
  const [totalIncome, setTotalIncome] = useRecoilState(totalIncomeAtom);
  const [totalExpenses, setTotalExpenses] = useRecoilState(totalExpensesAtom);
  const [isPending, startTransition] = useTransition(); // For async state updates

  useEffect(() => {
    const fetchTransactions = async () => {
      const localDate = new Date(selectedDate);
      localDate.setDate(localDate.getDate() + 1); // Adjust for UTC shift

      const date = localDate.toISOString().split("T")[0];
      // console.log("Formatted Date for API:", date); // This should be in YYYY-MM-DD
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
    };

    fetchTransactions();
  }, [selectedDate]);

  return (
    <div className="flex flex-col p-6 w-[95vw] md:w-[80vw] mx-auto bg-white shadow-lg rounded-xl">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800 tracking-wider">Wellcome Siddharth!</h1>

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
        <DataTable columns={columns} data={transactions} />
      </div>
    </div>
  );
}
