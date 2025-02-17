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


export default function CategorySelector({ onCategorySelect }: { onCategorySelect: (category: string) => void }) {
  const [categories, setCategories] = useRecoilState(categoriesAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, [setCategories]);

  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  // const [categoryList, setCategoryList] = useState(categories);
  // console.log(categories)
  // console.log(categoryList)

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    onCategorySelect(category);
    setOpen(false);
  };


  const handleAddCategory = async () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      try {
        const addedCategory = await addCategory(newCategory); // Call server action
        setCategories((prev) => [...prev, addedCategory.category]); // Update global state
        setSelectedCategory(addedCategory.category);
        onCategorySelect(addedCategory.category);
      } catch (error) {
        console.error("Error adding category:", error);
      } finally {
        setNewCategory("");
        setOpen(false);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedCategory || "Select a category"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2">
        <Command>
          <CommandInput placeholder="Search or add category..." />
          <CommandList>
            {categories.map((category) => (
              <CommandItem
                key={category}
                onSelect={() => handleSelectCategory(category)}
              >
                {category}{" "}
                {selectedCategory === category && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </CommandItem>
            ))}
            <CommandItem>
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category name"
                className="w-full"
              />
              <Button onClick={handleAddCategory} size="icon" variant="ghost">
                <Plus />
              </Button>
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
