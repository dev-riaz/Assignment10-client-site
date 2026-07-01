"use client";

import { FiEdit2, FiTrash2 } from "react-icons/fi";

const recipes = [
  {
    id: 1,
    recipe: "Chicken Curry",
    author: "Daniel Ahmed",
    category: "Indian",
    featured: "Yes",
  },
  {
    id: 2,
    recipe: "Beef Burger",
    author: "John Brown",
    category: "Fast Food",
    featured: "No",
  },
  {
    id: 3,
    recipe: "Pasta Alfredo",
    author: "Sarah Johnson",
    category: "Italian",
    featured: "Yes",
  },
  {
    id: 4,
    recipe: "Veggie Pizza",
    author: "Daniel Ahmed",
    category: "Italian",
    featured: "No",
  },
];

export default function ManageRecipesPage() {
  return (
    <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Recipes</h2>

      <div className="overflow-x-auto">
        <table className="table">
          <thead className="bg-gray-50">
            <tr>
              <th>Recipe</th>

              <th>Author</th>

              <th>Category</th>

              <th>Featured</th>

              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
           
            {recipes.map((recipe) => (
              <tr key={recipe.id}>
                <td className="font-medium">{recipe.recipe}</td>

                <td>{recipe.author}</td>

                <td>{recipe.category}</td>

                <td>
                  <span
                    className={`font-semibold ${
                      recipe.featured === "Yes"
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {recipe.featured}
                  </span>
                </td>

                <td>
                  <div className="flex justify-center gap-2">
                    <button className="btn btn-sm btn-outline border-orange-300 text-orange-500 hover:bg-orange-500 hover:text-white">
                      <FiEdit2 />
                    </button>

                    <button className="btn btn-sm btn-outline border-red-300 text-red-500 hover:bg-red-500 hover:text-white">
                      <FiTrash2 />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
