"use client";

import { serverMutation } from "./server";

export const updateRecipe = async (id, data) => {
  const res = await serverMutation(`/api/recipe/${id}`, "PATCH", data);
  return res;
};