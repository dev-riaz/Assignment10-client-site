import Banner from "@/components/Banner";

import RecipeHubWorks from "@/components/RecipeHubWorks";
import Subscription from "@/components/Subscription";
import TopRecipe from "@/components/TopRecipe";
import UserPopularRecipe from "@/components/UserPopularRecipe";


export default function Home() {
  return (
    <div>
      <Banner></Banner>
      <TopRecipe></TopRecipe>
      <UserPopularRecipe></UserPopularRecipe>
      <RecipeHubWorks></RecipeHubWorks>
      <Subscription></Subscription>
    </div>
  );
}
