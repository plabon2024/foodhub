import { AdminOrder } from "@/types/order";

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  const res = await fetch("http://localhost:5000/api/orders", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  const json = await res.json();
  return json.data;
}
