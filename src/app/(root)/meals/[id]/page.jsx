type MealDetails = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: { id: string; name: string };
  provider: {
    id: string;
    name: string;
    description: string;
  };
};

async function getMeal(id: string): Promise<MealDetails> {
  const res = await fetch(`http://localhost:5000/meals/${id}`, {
    cache: "no-store",
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error("Meal not found");
  }

  return json.data;
}

export default async function MealDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const meal = await getMeal(params.id);

  return (
    <div style={{ padding: 24 }}>
      <h1>{meal.name}</h1>

      <p>{meal.description}</p>

      <p>
        <strong>Price:</strong> ${meal.price}
      </p>

      <p>
        <strong>Category:</strong> {meal.category.name}
      </p>

      <hr />

      <h3>Provider</h3>
      <p>{meal.provider.name}</p>
      <p>{meal.provider.description}</p>

      <br />
      <a href="/meals">← Back to meals</a>
    </div>
  );
}
