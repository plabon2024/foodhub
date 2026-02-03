"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";

const API = "http://localhost:5000/api/meals";

async function fetchMeals() {
  const res = await fetch(API);
  return (await res.json()).data.items;
}

export default function MealsPage() {
  const { data } = useQuery({ queryKey: ["meals"], queryFn: fetchMeals });

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto  container">
      {data?.map((m: any) => (
        <Link
          key={m.id}
          href={`/meals/${m.id}`}
          className="border rounded-xl p-4"
        >
          <Image
            src={m.imageUrl}
            alt={m.name}
            width={300}
            height={200}
            className="rounded"
          />
          <h3 className="font-semibold mt-2">{m.name}</h3>
          <p className="text-sm text-muted-foreground">{m.category.name}</p>
          <p className="font-bold">৳{m.price}</p>
        </Link>
      ))}
    </div>
  );
}
