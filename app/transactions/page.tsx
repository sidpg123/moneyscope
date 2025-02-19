"use client";
import {
  selectedDateAtom,
  totalExpensesAtom,
  totalIncomeAtom,
  Transaction,
  transactionsAtom,
} from "@/state/RecoilState";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
// import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "@/components/DatePicker";
import { AddTransaction } from "@/components/Transaction/AddTransaction";
import { columns as defaultColumns } from "@/components/Transaction/Columns";
import { DataTable } from "@/components/Transaction/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Row } from "@tanstack/react-table";
import AlertDialogComponent from "@/components/AlertDialog";

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

  const handleEditTransaction = async (transaction: Transaction) => {
    console.log("received transaction in handleEditTransaction function", transaction)

    const transactionData = {
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description,
    };

    try {
      const response = await fetch(`/api/transactions/${transaction._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }


      const localDate = new Date(selectedDate);
      localDate.setHours(localDate.getHours() + 5, localDate.getMinutes() + 30); // ✅ Correct

      const date = localDate.toISOString().split("T")[0];

      const res = await fetch(`/api/transactions/by-date/${date}`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data.transactions); // Update the transactions list
      setTotalIncome(data.totalIncome);
      setTotalExpenses(data.totalExpenses);

    } catch (error) {
      console.error("Error adding transaction:", error);
    }

  }

  const handleDeleteTransaction = async (id: string) => {
    console.log(id);
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const localDate = new Date(selectedDate);
      localDate.setHours(localDate.getHours() + 5, localDate.getMinutes() + 30); // ✅ Correct

      const date = localDate.toISOString().split("T")[0];

      const res = await fetch(`/api/transactions/by-date/${date}`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data.transactions); // Update the transactions list
      setTotalIncome(data.totalIncome);
      setTotalExpenses(data.totalExpenses);

    } catch (error) {
      console.log(error)
    }
  }


  const columns = defaultColumns.map((col) =>
    col.id === "actions"
      ? {
        ...col,
        cell: ({ row }: { row: Row<Transaction> }) => {
          const transaction = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-4 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <AddTransaction onSubmit={handleEditTransaction} initialData={transaction} text={"Edit Transaction"} />

                {/* <DropdownMenuItem
                  onClick={() => console.log(transaction)}
                >Log</DropdownMenuItem> */}

                <AlertDialogComponent text={"Delete"}
                  alertText="Delete this transaction ?"
                  subText={"If ther is mistake in transaction, you can rather edit transaction"}
                  _id={transaction._id}
                  onSubmit={handleDeleteTransaction} />

              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }
      : col
  );



  const handleAddTransaction = async (transaction: Transaction) => {

    console.log("transaction", transaction)
    const transactionData = {
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date
    };
    console.log("transaction Data", transactionData)
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }

      // Handle success (e.g., reset form, show message, refetch transactions)
      console.log("Transaction added successfully");

      const localDate = new Date(selectedDate);
      localDate.setHours(localDate.getHours() + 5, localDate.getMinutes() + 30); // ✅ Correct

      const date = localDate.toISOString().split("T")[0];

      const res = await fetch(`/api/transactions/by-date/${date}`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data.transactions); // Update the transactions list
      setTotalIncome(data.totalIncome);
      setTotalExpenses(data.totalExpenses);

      // Reset the form after submission
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  }

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
          <AddTransaction onSubmit={handleAddTransaction} initialData={undefined} text={"Add Transaction"} />
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
