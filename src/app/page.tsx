"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MemoItem from "./MemoItem";

interface MemoItemData {
  id: string;
  content: string;
  tags: string[];
}

const url = '/db.json';

async function fetchData() {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.reverse(); // Reverse the array before returning
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export default function Home() {
  const [data, setData] = useState<MemoItemData[]>([]);
  const [filteredData, setFilteredData] = useState<MemoItemData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filtered = data.filter((item) =>
      item.content.toLowerCase().includes(value.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredData(filtered);
  };

  const refreshData = async () => {
    const result = await fetchData();
    setData(result);
    setFilteredData(result);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="p-10">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">MEMO</h1>
        <Link href="/create">
          <button className="btn">Create</button>
        </Link>
      </header>
      <main className="flex flex-col items-center justify-between p-10">
        <div className="w-full">
          <input type="text" placeholder="Search..." className="w-full border p-2 mb-4" value={searchTerm} onChange={handleSearch} />
          {
            filteredData.map((item: MemoItemData) => (
              <MemoItem
                key={item.id}
                id={item.id}
                content={item.content}
                tags={item.tags}
                onDelete={refreshData} // Pass the refreshData function as a prop
              />
            ))
          }
        </div>
      </main>
      <footer></footer>
    </div>
  );
}
