export type AdminOrder = {
  id: string;
  status: "PLACED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
  totalAmount: string;
  deliveryAddress: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  provider: {
    id: string;
    name: string;
  };
  items: {
    quantity: number;
    price: string;
    meal: {
      id: string;
      name: string;
    };
  }[];
};
