"use client"
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

interface transactionTypeSelector {
  onTypeSelect: (type: string) => void,
  initialType?: string
}

export default function TransactionTypeSelector({ onTypeSelect, initialType }: transactionTypeSelector) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    setSelectedType(initialType as string);
  }, [selectedType])
  const handleSelectType = (type: string) => {
    setSelectedType(type);
    onTypeSelect(type);
    setOpen(false);
  };

  const typesOfExpense = ["income", "expense"]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedType || "Select a type"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2">
        <Command>
          {/* <CommandInput placeholder="Search or add category..." /> */}
          <CommandList>
            {typesOfExpense.map((typeOFExpense) => (
              <CommandItem
                key={typeOFExpense}
                onSelect={() => handleSelectType(typeOFExpense)}
              >
                {typeOFExpense}{" "}
                {selectedType === typeOFExpense && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
