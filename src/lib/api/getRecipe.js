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

export const likeRecipe = async (id, userEmail) => {
    return await serverMutation(`/api/recipe/like/${id}`, "PATCH", { userEmail });
};

export const unlikeRecipe = async (id, userEmail) => {
    return await serverMutation(`/api/recipe/unlike/${id}`, "PATCH", { userEmail });
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

export const addPayment = async (paymentData) => {
    return await serverMutation(`/api/payments`, "POST", paymentData);
};

export const getMyPayments = async (email) => {
    return await serverFetch(`/api/payments/${email}`);
};



// Admin data
export const getAllUsers = async () => {
    return await serverFetch(`/api/admin/users`);
};

export const updateUserStatus = async (id, status) => {
    return await serverMutation(`/api/admin/users/${id}/status`, "PATCH", { status });
};

// Admin: get all recipes (any status)
export const getAllRecipesAdmin = async ({ search = "", status = "", category = "" } = {}) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (category) params.set("category", category);

    const query = params.toString();
    return await serverFetch(`/api/admin/recipes${query ? `?${query}` : ""}`);
};

// Admin: update a recipe's status (Published / Pending / Rejected)
export const updateRecipeStatus = async (id, status) => {
    return await serverMutation(`/api/recipe/${id}`, "PATCH", { status });
};

// Admin: delete a recipe
export const deleteRecipeAdmin = async (id) => {
    return await serverMutation(`/api/recipe/${id}`, "DELETE", {});
};

// Admin: get all transactions
export const getAllTransactionsAdmin = async ({ search = "", status = "" } = {}) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);

    const query = params.toString();
    return await serverFetch(`/api/admin/payments${query ? `?${query}` : ""}`);
};


// Reports

export const submitReport = async (reportData) => {
    return await serverMutation(`/api/reports`, "POST", reportData);
};

export const getMyReports = async (email) => {
    return await serverFetch(`/api/reports/${email}`);
};

// Admin: get all reports (any status)
export const getAllReportsAdmin = async ({ search = "", status = "" } = {}) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);

    const query = params.toString();
    return await serverFetch(`/api/admin/reports${query ? `?${query}` : ""}`);
};

// Admin: update a report's status (Pending / Reviewed / Resolved / Dismissed)
export const updateReportStatus = async (id, status) => {
    return await serverMutation(`/api/admin/reports/${id}`, "PATCH", { status });
};

// Admin: delete a report
export const deleteReportAdmin = async (id) => {
    return await serverMutation(`/api/admin/reports/${id}`, "DELETE", {});
};