"use client";

import {
  getRecipeById,
  likeRecipe,
  unlikeRecipe,
  addFavorite,
  deleteFavorite,
  getMyFavorites,
  getUserById,
  getUserByEmail,
} from "../../../../lib/api/getRecipe";
import { LS_LIKED, getIds, addToLS, removeFromLS } from "@/lib/favoriteUtils";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaClock,
  FaUserCircle,
  FaUtensils,
} from "react-icons/fa";
import { IoMdBackspace } from "react-icons/io";
import { MdReport } from "react-icons/md";
import { BiSolidPurchaseTag } from "react-icons/bi";

/* ── Star Rating ── */
const StarRating = ({ rating = 0 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i)
      stars.push(<FaStar key={i} className="text-amber-400 text-sm" />);
    else if (rating >= i - 0.5)
      stars.push(<FaStarHalfAlt key={i} className="text-amber-400 text-sm" />);
    else stars.push(<FaRegStar key={i} className="text-amber-300 text-sm" />);
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

/* ── Tag Badge ── */
const Tag = ({ label }) => {
  const colorMap = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-3 py-0.5 rounded-full text-xs font-medium border border-gray-200 ${colorMap[label] ?? "bg-gray-100 text-gray-600"}`}
    >
      {label}
    </span>
  );
};

/* ── Parse multiline string to array ── */
const parseLines = (str = "") =>
  str
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

/* ── Main Component ── */
const RecipeDetailsPage = ({ params }) => {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();

  const [recipe, setRecipe] = useState(null);
  const [authorImage, setAuthorImage] = useState(null);

  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const [favorited, setFavorited] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [favLoading, setFavLoading] = useState(false);
  const [favChecking, setFavChecking] = useState(true);

  /* ── Recipe fetch ── */
  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await getRecipeById(id);
      if (res.success) {
        setRecipe(res.data);
        setLiked(getIds(LS_LIKED).includes(res.data._id));
      }
    };
    fetchRecipe();
  }, [id]);

  /* ── Author profile image fetch (authorId → fallback authorEmail) ── */
  useEffect(() => {
    if (!recipe?.authorId && !recipe?.authorEmail) return;

    const fetchAuthor = async () => {
      // প্রথমে authorId দিয়ে try
      if (recipe?.authorId) {
        const res = await getUserById(recipe.authorId);
        if (res.success && res.data?.image) {
          setAuthorImage(res.data.image);
          return;
        }
      }

      // authorId দিয়ে না পেলে authorEmail দিয়ে fallback
      if (recipe?.authorEmail) {
        const res = await getUserByEmail(recipe.authorEmail);
        if (res.success && res.data?.image) {
          setAuthorImage(res.data.image);
        }
      }
    };
    fetchAuthor();
  }, [recipe?.authorId, recipe?.authorEmail]);

  /* ── Favorite status check — DB theke, localStorage na ── */
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!session?.user?.email || !recipe?._id) {
        setFavorited(false);
        setFavoriteId(null);
        setFavChecking(false);
        return;
      }

      setFavChecking(true);
      const res = await getMyFavorites(session.user.email);
      if (res.success) {
        const match = res.data.find((f) => f.recipeId === recipe._id);
        if (match) {
          setFavorited(true);
          setFavoriteId(match._id);
        } else {
          setFavorited(false);
          setFavoriteId(null);
        }
      }
      setFavChecking(false);
    };

    checkFavoriteStatus();
  }, [session, recipe]);

  /* ── Like / Unlike toggle ── */
  const handleLike = async () => {
    if (!recipe || likeLoading) return;
    setLikeLoading(true);

    if (liked) {
      const res = await unlikeRecipe(recipe._id);
      if (res.success) {
        removeFromLS(LS_LIKED, recipe._id);
        setLiked(false);
        setRecipe((prev) => ({
          ...prev,
          likesCount: Math.max(0, (prev.likesCount || 0) - 1),
        }));
      }
    } else {
      const res = await likeRecipe(recipe._id);
      if (res.success) {
        addToLS(LS_LIKED, recipe._id);
        setLiked(true);
        setRecipe((prev) => ({
          ...prev,
          likesCount: (prev.likesCount || 0) + 1,
        }));
      }
    }
    setLikeLoading(false);
  };

  /* ── Favorite / Unfavorite toggle ── */
  const handleFavorite = async () => {
    if (!recipe || favLoading || favChecking) return;

    if (!session?.user?.email) {
      router.push("/login");
      return;
    }

    setFavLoading(true);

    try {
      if (favorited) {
        // ── Unfavorite ──
        if (favoriteId) {
          const res = await deleteFavorite(favoriteId);
          if (res.success) {
            setFavorited(false);
            setFavoriteId(null);
          }
        }
      } else {
        // ── Favorite ──
        const favoriteData = {
          recipeId: recipe._id.toString(),
          userEmail: session.user.email,
          recipeName: recipe.recipeName,
          recipeImage: recipe.recipeImage,
          authorName: recipe.authorName,
          category: recipe.category,
          cuisineType: recipe.cuisineType,
          difficultyLevel: recipe.difficultyLevel,
          preparationTime: recipe.preparationTime,
          likesCount: recipe.likesCount,
        };

        const res = await addFavorite(favoriteData);
        if (res.success) {
          setFavorited(true);
          setFavoriteId(res.insertedId);
        } else if (res.message === "Already favorited") {
          setFavorited(true);
        }
      }
    } finally {
      setFavLoading(false);
    }
  };

  /* ── Loading ── */
  if (!recipe) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-green-500" />
      </div>
    );
  }

  const ingredients = parseLines(recipe.ingredients);
  const instructions = parseLines(recipe.instructions);

  return (
    <div className="min-h-screen bg-[#faf9f7] px-4 py-6">
      <div className="w-10/12 mx-auto">
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-6">
          {/* Back */}
          <div className="text-end">
            <button
              onClick={() => router.back()}
              className="hover:cursor-pointer"
            >
              <IoMdBackspace size={40} />
            </button>
          </div>

          {/* TOP SECTION */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Image */}
            <div className="flex-shrink-0">
              <div className="relative w-full md:w-[400px] h-[300px] rounded-2xl overflow-hidden bg-gray-100">
                {recipe.recipeImage ? (
                  <Image
                    src={recipe.recipeImage}
                    alt={recipe.recipeName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <FaUtensils className="text-4xl" />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-5 flex-1">
              <h1 className="text-4xl font-bold text-gray-600 leading-tight">
                {recipe.recipeName}
              </h1>

              <div className="flex items-center gap-2">
                <StarRating rating={4.8} />
                <span className="text-md font-semibold text-gray-700">4.8</span>
                <span className="text-sm text-gray-400">
                  ({recipe.likesCount} reviews)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Tag label={recipe.cuisineType} />
                <Tag label={recipe.category} />
                <Tag label={recipe.difficultyLevel} />
                <span className="flex items-center gap-1 text-xs text-gray-500 ml-1">
                  <FaClock className="text-gray-400" />
                  {recipe.preparationTime} mins
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {authorImage ? (
                      <Image
                        src={authorImage}
                        alt={recipe.authorName}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    ) : (
                      <FaUserCircle className="text-gray-400 text-2xl" />
                    )}
                  </div>
                  <span className="text-sm text-gray-600">
                    by{" "}
                    <span className="font-medium text-gray-800">
                      {recipe.authorName}
                    </span>
                  </span>
                </div>
                <button className="ml-2 btn btn-xs rounded-full border border-gray-300 bg-white text-gray-600 hover:border-gray-400 text-xs font-medium px-4">
                  Follow
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${recipe.status === "Published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  {recipe.status}
                </span>
                {recipe.isFeatured && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    Featured
                  </span>
                )}
              </div>

              {/* Like / Favorite / Report */}
              <div className="flex items-center gap-5 mt-4">
                {/* Like toggle */}
                <button
                  onClick={handleLike}
                  disabled={likeLoading}
                  className="flex items-center gap-1.5 text-sm font-medium transition hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {liked ? (
                    <FaHeart className="text-red-500 text-base" />
                  ) : (
                    <FaRegHeart className="text-red-400 text-base" />
                  )}
                  <span className="text-gray-700 font-bold">
                    {recipe.likesCount}
                  </span>
                </button>

                {/* Favorite toggle */}
                <button
                  onClick={handleFavorite}
                  disabled={favLoading || favChecking}
                  className={`flex items-center gap-1.5 text-sm font-bold transition disabled:opacity-60 ${
                    favorited
                      ? "text-amber-500 hover:text-amber-600 hover:cursor-pointer"
                      : "text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                  }`}
                >
                  {favorited ? (
                    <FaBookmark className="text-base" />
                  ) : (
                    <FaRegBookmark className="text-base" />
                  )}
                  <span>{favorited ? "Saved" : "Favorite"}</span>
                </button>

                {/* Report */}
                <button className="flex hover:cursor-pointer items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 transition font-bold">
                  <MdReport className="text-base" />
                  <span>Report</span>
                </button>
              </div>
            </div>
          </div>

          <div className="divider my-6" />

          {/* INGREDIENTS & INSTRUCTIONS */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Ingredients
              </h2>
              {ingredients.length > 0 ? (
                <ul className="space-y-2">
                  {ingredients.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  No ingredients listed.
                </p>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Instructions
              </h2>
              {instructions.length > 0 ? (
                <ol className="space-y-3">
                  {instructions.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-gray-600"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-400 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  No instructions listed.
                </p>
              )}
            </div>
          </div>

          {/* PURCHASE */}
          <div className="text-end">
            <button className="mt-4 btn py-10 px-10 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl">
              <span className="text-2xl flex justify-center items-center font-bold gap-3">
                <BiSolidPurchaseTag />
                $2.99
              </span>
              <span className="text-xs font-normal opacity-90">
                Purchase Recipe
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsPage;
