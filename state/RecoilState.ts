import { atom, selector } from "recoil";

// Define Transaction Type
export interface Transaction {
    id: string;
    amount: number;
    category: string;
    description: string;
    date: string; // Store date as ISO string (e.g., "2024-02-16T10:30:00.000Z")
    type: string;
}

// Define Category Breakdown Type
export interface CategoryBreakdown {
    category: string;
    amount: number;
}

// Transactions State (Holds all transactions)
export const transactionsState = atom<Transaction[]>({
    key: "transactionsState",
    default: [],
});

// Time Range State (Controls the duration filter)
export type TimeRange = "daily" | "weekly" | "monthly" | "custom";

export const timeRangeState = atom<TimeRange>({
    key: "timeRangeState",
    default: "monthly",
});

// Chart Type State (Controls which chart is displayed)
export type ChartType = "pie" | "bar";

export const chartTypeState = atom<ChartType>({
    key: "chartTypeState",
    default: "pie",
});

export const categoriesAtom = atom<string[]>({
    key: "categoriesAtom",
    default: [],
  });

// Filtered Transactions (Based on selected time range)
export const filteredTransactionsState = selector<Transaction[]>({
    key: "filteredTransactionsState",
    get: ({ get }) => {
        const transactions = get(transactionsState);
        const timeRange = get(timeRangeState);

        const now = new Date();
        let filtered = transactions;

        if (timeRange === "daily") {
            filtered = transactions.filter(
                (t) => new Date(t.date).toDateString() === now.toDateString()
            );
        } else if (timeRange === "weekly") {
            const oneWeekAgo = new Date(now);
            oneWeekAgo.setDate(now.getDate() - 7);
            filtered = transactions.filter((t) => new Date(t.date) >= oneWeekAgo);
        } else if (timeRange === "monthly") {
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            filtered = transactions.filter((t) => new Date(t.date) >= monthStart);
        }

        return filtered;
    },
});

// Category Breakdown State (Aggregates expenses by category)
export const categoryBreakdownState = selector<CategoryBreakdown[]>({
    key: "categoryBreakdownState",
    get: ({ get }) => {
        const transactions = get(filteredTransactionsState);
        const categoryMap: Record<string, number> = {};

        transactions.forEach((t) => {
            categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
        });

        return Object.entries(categoryMap).map(([category, amount]) => ({
            category,
            amount,
        }));
    },
});


export const selectedDateAtom = atom<Date>({
    key: "selectedDate",
    default: new Date(), // Default to today's date
  });
  
  export const transactionsAtom = atom<Transaction[]>({
    key: "transactions",
    default: [],
  });
  
  export const totalIncomeAtom = atom<number>({
    key: "totalIncome",
    default: 0,
  });
  
  export const totalExpensesAtom = atom<number>({
    key: "totalExpenses",
    default: 0,
  });