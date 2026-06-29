"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getMyFavorites } from "@/lib/api/getRecipe";


const MyFavoritesPage = () => {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!session?.user?.email) return;

    const loadFavorites = async () => {
      const res = await getMyFavorites(session.user.email);
      console.log("SESSION:", session);
      console.log("EMAIL:", session?.user?.email);
      if (res.success) {
        setFavorites(res.data);
      }
    };

    loadFavorites();
  }, [session?.user?.email]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Favorites</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorites found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {favorites.map((item) => (
            <div key={item._id} className="border rounded-xl p-3">
              <img
                src={item.recipeImage}
                alt={item.recipeName}
                className="w-full h-40 object-cover rounded-lg"
              />

              <h2 className="font-bold mt-2">{item.recipeName}</h2>
              <p className="text-sm text-gray-500">{item.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFavoritesPage;
