import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";
import { createCategory, getAllCategories } from "@/lib/actions/event.action";

interface DropdownProps {
  onChangeHandler: () => void;
  value: string;
}
interface ICategory {
  _id: string;
  name: string;
}
function DropDown({ onChangeHandler, value }: DropdownProps) {
  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories();
      // console.log(categoryList);
      categoryList && setCategories(categoryList as ICategory[]);
    };
    getCategories();
  }, []);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");

  const addNewCategory = () => {
    createCategory(newCategory.trim()).then((category) => {
      setCategories((prevState) => [...prevState, category]);
    });
  };
  return (
    <div className="mx-1">
      <Select onValueChange={onChangeHandler} defaultValue={value}>
        <SelectTrigger className="bg-gray-50 h-[54px] placeholder-gray-500 mt-2 rounded-md px-4 py-3 text-[16px] border-none focus:ring-0 focus:outline-none">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent className="bg-gray-50  placeholder-gray-500 text-[16px] border-none focus:ring-0 focus:outline-none">
          {categories.map((category) => {
            return (
              <div key={category._id}>
                <SelectItem value={`${category._id}`}>
                  {category.name}
                </SelectItem>
              </div>
            );
          })}
          <AlertDialog>
            <AlertDialogTrigger className="w-full mt-1 ">
              Add new category
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>New Category</AlertDialogTitle>
              </AlertDialogHeader>
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-[#624CF5] hover:bg-[#4d32ff]"
                  onClick={addNewCategory}
                >
                  Add
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SelectContent>
      </Select>
    </div>
  );
}

export default DropDown;
