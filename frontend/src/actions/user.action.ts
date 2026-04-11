"use server";

import { getUserInfo } from "@/services/auth.services";

export const getUser = async () => {
  const data = await getUserInfo();
  return { data };
};
