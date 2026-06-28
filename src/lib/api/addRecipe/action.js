"use client"

import { serverMutation } from "../server"

export const addRecipe = async (data) => {
    const res = await serverMutation("/api/recipe","POST", data)
    return res
}