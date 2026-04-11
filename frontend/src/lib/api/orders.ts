import { AdminOrder } from "@/types/order";

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${baseurl}/orders`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  const json = await res.json();
  return json.data;
}
