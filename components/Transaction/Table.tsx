import { Transaction } from "@/state/RecoilState";
import { Payment, columns } from "./Columns";
import { DataTable } from "./DataTable";

async function getData(): Promise<Transaction[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      amount: 500,
      date: new Date("2025-02-16").toISOString(),
      description: "Dinner at restaurant",
      category: "Food",
      type: "expense",
    },
    {
      id: "2",
      amount: 1200,
      date: new Date("2025-02-15").toISOString(),
      description: "Uber Ride",
      category: "Transport",
      type: "expense",
    },
    {
      id: "3",
      amount: 2500,
      date: new Date("2025-02-14").toISOString(),
      description: "Groceries",
      category: "Shopping",
      type: "expense",
    },
    {
      id: "4",
      amount: 10000,
      date: new Date("2025-02-10").toISOString(),
      description: "Freelance Payment",
      category: "Other",
      type: "income",
    },
    {
      id: "5",
      amount: 800,
      date: new Date("2025-02-09").toISOString(),
      description: "Movie Tickets",
      category: "Entertainment",
      type: "expense",
    },
    {
      id: "6",
      amount: 15000,
      date: new Date("2025-02-05").toISOString(),
      description: "Salary Credit",
      category: "Salary",
      type: "income",
    },
    {
      id: "7",
      amount: 300,
      date: new Date("2025-02-03").toISOString(),
      description: "Coffee with friends",
      category: "Food",
      type: "expense",
    },
    {
      id: "8",
      amount: 4500,
      date: new Date("2025-02-01").toISOString(),
      description: "New Headphones",
      category: "Electronics",
      type: "expense",
    },
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container  py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
