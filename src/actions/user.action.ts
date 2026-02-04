"use server";


import { userService } from "@/servides/user.service";


export const getUser = async () => {
  return await userService.getSession();
};

