// src/lib/favoriteUtils.js
export const LS_LIKED = "likedRecipes";
export const LS_FAV = "favoritedRecipes";

export const getIds = (key) =>
    JSON.parse(localStorage.getItem(key) || "[]");

export const addToLS = (key, id) => {
    const arr = getIds(key);
    if (!arr.includes(id)) {
        arr.push(id);
        localStorage.setItem(key, JSON.stringify(arr));
    }
};

export const removeFromLS = (key, id) => {
    const arr = getIds(key);
    localStorage.setItem(key, JSON.stringify(arr.filter((v) => v !== id)));
};