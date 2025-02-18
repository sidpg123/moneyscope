"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import CategorySelector from "../ui/addCategory";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addTransactionFormSchema } from "@/lib/zodSchemas";
import { selectedDateAtom, totalExpensesAtom, totalIncomeAtom, transactionsAtom } from "@/state/RecoilState";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { z } from "zod";
import TransactionTypeSelector from "../ui/selectTransactionType";

export function AddTransaction() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Transaction</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>
              Managing your finances is easy! Just enter the details and save
              your transaction.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm setDialog={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Add Transaction</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add Transaction</DrawerTitle>
          <DrawerDescription>
            Managing your finances is easy! Just enter the details and save your
            transaction.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm setDialog={setOpen} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
type ProfileFormProps = {
  // className?: React.ComponentProps<"form">;
  setDialog: (open: boolean) => void; // Callback function to control dialog visibility
};
function ProfileForm({ setDialog }: ProfileFormProps) {
  const setTotalIncome = useSetRecoilState(totalIncomeAtom)
  const  setTransactions = useSetRecoilState(transactionsAtom);
  const setTotalExpenses = useSetRecoilState(totalExpensesAtom);
  const form = useForm<z.infer<typeof addTransactionFormSchema>>({
    resolver: zodResolver(addTransactionFormSchema),
  });

  const selectedDate = useRecoilValue(selectedDateAtom); // Get date from Recoil
  // console.log(selectedDate)
  async function onSubmit(values: z.infer<typeof addTransactionFormSchema>) {
    const transactionData = {
      ...values,
      date: selectedDate.toISOString(), // Ensure it's in a valid format
    };

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

      setDialog(false);
      // Handle success (e.g., reset form, show message, refetch transactions)
      console.log("Transaction added successfully");

      // const localDate = new Date(selectedDate);
      // localDate.setDate(localDate.getDate() + 1); // Adjust for UTC shift

      const date = selectedDate.toISOString().split("T")[0];

      const res = await fetch(`/api/transactions/by-date/${date}`);
      const data = await res.json();
      setTransactions(data.transactions); // Update the transactions list
      setTotalIncome(data.totalIncome);
      setTotalExpenses(data.totalExpenses);

      form.reset(); // Reset the form after submission
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-row gap-2 justify-evenly px-3 md:px-0 ">
          {/* Category Selector */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <CategorySelector
                    onCategorySelect={(category) => field.onChange(category)} // Ensure it updates the form state
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <TransactionTypeSelector
                    onTypeSelect={(type) => field.onChange(type)} // Ensure it updates the form state
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Amount Field */}

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="number"
                  id="amount"
                  placeholder="Enter Amount"
                  {...field} // Binds the field
                  value={field.value || ""} // Ensures empty string if undefined
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)} // Convert to number
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <div className="px-3 md:px-0 flex flex-col gap-3">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Description</FormLabel>
                <FormControl>
                  <Input
                    className="py-5"
                    placeholder="What was this transaction for?"
                    {...field} // Binds value & onChange
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
