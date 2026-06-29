"use client";

import { serverMutation } from "./server";

export const deleteRecipe = async (id) => {
    const res = await serverMutation(`/api/recipe/${id}`, "DELETE");
    return res;
};