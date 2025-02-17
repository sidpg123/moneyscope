import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, Plus } from "lucide-react";
import { addCategory, fetchCategories } from "@/actions/FetchAndAddCategories";
import { useRecoilState } from "recoil";
import { categoriesAtom } from "@/state/RecoilState";


export default function TransactionTypeSelector({ onTypeSelect }: { onTypeSelect: (type: string) => void }) {
//   const [categories, setCategories] = useRecoilState(categoriesAtom);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("expense");

//   useEffect(() => {
//     async function loadCategories() {
//       try {
//         const fetchedCategories = await fetchCategories();
//         setCategories(fetchedCategories);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadCategories();
//   }, [setCategories]);

  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
//   const [newCategory, setNewCategory] = useState("");
  // const [categoryList, setCategoryList] = useState(categories);
  // console.log(categories)
  // console.log(categoryList)

  const handleSelectType = (type: string) => {
    setSelectedType(type);
    onTypeSelect(type);
    setOpen(false);
  };


//   const handleAddCategory = async () => {
//     if (newCategory.trim() && !categories.includes(newCategory)) {
//       try {
//         const addedCategory = await addCategory(newCategory); // Call server action
//         setCategories((prev) => [...prev, addedCategory.category]); // Update global state
//         setSelectedType(addedCategory.category);
//         onCategorySelect(addedCategory.category);
//       } catch (error) {
//         console.error("Error adding category:", error);
//       } finally {
//         setNewCategory("");
//         setOpen(false);
//       }
//     }
//   };

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
