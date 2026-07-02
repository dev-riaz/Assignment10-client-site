import Banner from "@/components/Banner";
import FeaturedRecipe from "@/components/FeaturedRecipe";


import RecipeHubWorks from "@/components/RecipeHubWorks";
import Subscription from "@/components/Subscription";
import UserPopularRecipe from "@/components/UserPopularRecipe";


export default function Home() {
  return (
    <div>
      <Banner></Banner>
      <FeaturedRecipe></FeaturedRecipe>
      <UserPopularRecipe></UserPopularRecipe>
      <RecipeHubWorks></RecipeHubWorks>
      <Subscription></Subscription>
    </div>
  );
}
