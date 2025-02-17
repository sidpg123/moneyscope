"use client";
import { useState, useTransition } from "react";
import { useRecoilState } from "recoil";
import { selectedDateAtom, transactionsAtom, totalIncomeAtom, totalExpensesAtom } from "@/state/RecoilState";
// import "react-datepicker/dist/react-datepicker.css";
import { fetchTransactionsByDate } from "@/actions/FetchTransaction";
import DatePicker from "@/components/DatePicker";

export default function Transactions() {
  // const [selectedDate, setSelectedDate] = useRecoilStat`e(selectedDateAtom);
  const [transactions, setTransactions] = useRecoilState(transactionsAtom);
  const [totalIncome, setTotalIncome] = useRecoilState(totalIncomeAtom);
  const [totalExpenses, setTotalExpenses] = useRecoilState(totalExpensesAtom);
  const [isPending, startTransition] = useTransition(); // For async state updates

  async function handleDateChange(date: Date) {

    startTransition(async () => {
      const data = await fetchTransactionsByDate(date);
      setTransactions(data.transactions);
      setTotalIncome(data.totalIncome);
      setTotalExpenses(data.totalExpenses);
    });
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Transactions</h1>
      
      {/* Date Picker */}
      <DatePicker onDateChange={handleDateChange} />

      {/* Show loading state while fetching */}
      {isPending && <p className="text-gray-500">Loading...</p>}

      {/* Income & Expense Summary */}
      <div className="mt-4 p-4 border rounded">
        <p className="text-green-600">Total Income: ₹{totalIncome}</p>
        <p className="text-red-600">Total Expenses: ₹{totalExpenses}</p>
      </div>

      {/* Transactions List */}
      <ul className="mt-4">
        {transactions.map((t) => (
          <li key={t.id} className="p-2 border-b">
            <p>{t.description} - ₹{t.amount}</p>
            <p className="text-gray-500">{t.category} ({t.type})</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
