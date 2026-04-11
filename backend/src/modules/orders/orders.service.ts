import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export async function createOrderService(req: any) {
  const { userId, role } = req.user;

  if (role !== "CUSTOMER") {
    throw new Error("ONLY_CUSTOMER_CAN_ORDER");
  }

  // Check user status directly from DB if needed, or assume checkAuth did it.
  // checkAuth already checks for SUSPENDED status.
  
  const { providerId, deliveryAddress, items } = req.body;

  if (!providerId || !deliveryAddress || !items?.length) {
    throw new Error("INVALID_PAYLOAD");
  }


  const provider = await prisma.providerProfile.findFirst({
    where: {
      id: providerId,
      isActive: true,
    },
  });

  if (!provider) {
    throw new Error("PROVIDER_NOT_FOUND");
  }

  //  Fetch valid meals
  const mealIds = items.map((i: any) => i.mealId);

  const meals = await prisma.meal.findMany({
    where: {
      id: { in: mealIds },
      providerId,
      isAvailable: true,
    },
  });

  if (meals.length !== items.length) {
    throw new Error("INVALID_MEALS");
  }

  // 💰 Calculate total
  let totalAmount = new Prisma.Decimal(0);

  const orderItemsData = items.map((item: any) => {
    const meal = meals.find(m => m.id === item.mealId)!;
    const lineTotal = meal.price.mul(item.quantity);
    totalAmount = totalAmount.add(lineTotal);

    return {
      mealId: meal.id,
      quantity: item.quantity,
      price: meal.price,
    };
  });

  //  Create order
  const order = await prisma.order.create({
    data: {
      customerId: userId,
      providerId,
      deliveryAddress,
      totalAmount,
      items: {
        create: orderItemsData,
      },
    },
    include: {
      items: true,
    },
  });

  return order;
}


export async function getMyOrdersService(req: any) {
  const { userId, role } = req.user;


  if (role === "CUSTOMER") {
    return prisma.order.findMany({
      where: { customerId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        deliveryAddress: true,
        createdAt: true,
        provider: {
          select: {
            id: true,
            name: true,
          },
        },
        items: {
          select: {
            quantity: true,
            price: true,
            meal: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }


  if (role === "PROVIDER") {
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!providerProfile) return [];

    return prisma.order.findMany({
      where: { providerId: providerProfile.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        deliveryAddress: true,
        totalAmount: true,
        createdAt: true,
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          select: {
            quantity: true,
            meal: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }


  if (role === "ADMIN") {
    return prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        deliveryAddress: true,
        createdAt: true,
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
          },
        },
        items: {
          select: {
            quantity: true,
            price: true,
            meal: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  return [];
}







export async function getOrderDetailsService(req: any) {
  const { userId, role } = req.user;
  const orderId = req.params.id;

  if (!orderId) {
    throw new Error("ORDER_ID_REQUIRED");
  }

  // ADMIN → full access
  if (role === "ADMIN") {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: fullOrderInclude,
    });

    if (!order) throw new Error("ORDER_NOT_FOUND");
    return order;
  }

  // PROVIDER → only own orders
  if (role === "PROVIDER") {
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!providerProfile) {
      throw new Error("PROVIDER_PROFILE_NOT_FOUND");
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        providerId: providerProfile.id,
      },
      include: fullOrderInclude,
    });

    if (!order) throw new Error("ORDER_NOT_FOUND");
    return order;
  }

  // CUSTOMER → only own orders
  if (role === "CUSTOMER") {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId: userId,
      },
      include: fullOrderInclude,
    });

    if (!order) throw new Error("ORDER_NOT_FOUND");
    return order;
  }

  throw new Error("FORBIDDEN");
}

const fullOrderInclude = {
  provider: {
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
    },
  },
  customer: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  items: {
    include: {
      meal: {
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
        },
      },
    },
  },
};
