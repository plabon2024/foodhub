"use client";

import { useEffect, useState } from "react";

type Meal = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: { id: string; name: string };
  provider: { id: string; name: string };
};

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [q, setQ] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  async function fetchMeals() {
    setLoading(true);

    const params = new URLSearchParams();
    if (q) params.append("q", q);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);

    const res = await fetch(
      `http://localhost:5000/meals?${params.toString()}`
    );
    const json = await res.json();

    setMeals(json.data.items);
    setLoading(false);
  }

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Browse Meals</h1>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input
          placeholder="Search meals..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <button onClick={fetchMeals}>Apply</button>
      </div>

      {/* Meals List */}
      {loading ? (
        <p>Loading...</p>
      ) : meals.length === 0 ? (
        <p>No meals found</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {meals.map((meal) => (
            <li
              key={meal.id}
              style={{
                border: "1px solid #ddd",
                padding: 16,
                marginBottom: 12,
              }}
            >
              <h3>{meal.name}</h3>
              <p>{meal.description}</p>
              <p>
                <strong>${meal.price}</strong>
              </p>
              <p>
                {meal.category.name} · {meal.provider.name}
              </p>

              <a href={`/meals/${meal.id}`}>View details →</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
