import { AdminOrder } from "@/types/order";

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  const baseurl = process.env.AUTH_URL;
  const res = await fetch(`${baseurl}/api/orders`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  const json = await res.json();
  return json.data;
}
