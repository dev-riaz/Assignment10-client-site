import { serverFetch, serverMutation } from "./server";

export const getMyRecipe = async (email) => {
    return await serverFetch(`/api/myRecipe/${email}`);
};

export const getRecipes = async ({
    page = 1,
    limit = 6,
    search = "",
    category = "",
    cuisineType = "",
    difficultyLevel = "",
    sortBy = "",
} = {}) => {
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", limit);
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (cuisineType) params.set("cuisineType", cuisineType);
    if (difficultyLevel) params.set("difficultyLevel", difficultyLevel);
    if (sortBy) params.set("sortBy", sortBy);
    return await serverFetch(`/api/recipes?${params.toString()}`);
};

export const getRecipeById = async (id) => {
    return await serverFetch(`/api/recipe/${id}`);
};

export const getUserById = async (id) => {
    return await serverFetch(`/api/user/${id}`);
};

export const getUserByEmail = async (email) => {
    return await serverFetch(`/api/user/by-email/${email}`);
};

export const likeRecipe = async (id) => {
    return await serverMutation(`/api/recipe/like/${id}`, "PATCH", {});
};

export const unlikeRecipe = async (id) => {
    return await serverMutation(`/api/recipe/unlike/${id}`, "PATCH", {});
};

export const addFavorite = async (favoriteData) => {
    return await serverMutation(`/api/favorites`, "POST", favoriteData);
};

export const getMyFavorites = async (email) => {
    return await serverFetch(`/api/favorites/${email}`);
};

export const deleteFavorite = async (id) => {
    return await serverMutation(`/api/favorites/${id}`, "DELETE", {});
};