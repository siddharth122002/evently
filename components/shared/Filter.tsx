"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from "@/lib/actions/event.action";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
interface ICategory {
  _id: string;
  name: string;
}
const Filter = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      const res = await getAllCategories();
      setCategories(res);
    };
    getCategories();
  }, []);
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectCategory = (value: string) => {
    let newUrl = "";
    if (value && value !== "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "category",
        value: value,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["category"],
      });
    }
    router.push(newUrl, { scroll: false });
  };
  return (
    <Select onValueChange={(value: string) => selectCategory(value)}>
      <SelectTrigger className="w-full ">
        <SelectValue placeholder="All" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">All</SelectItem>
        {categories.map((category) => {
          return (
            <SelectItem key={category._id} value={`${category.name}`}>
              {category.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default Filter;
