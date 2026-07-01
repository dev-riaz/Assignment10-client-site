import Banner from "@/components/Banner";
import RecipeHubWorks from "@/components/RecipeHubWorks";
import Subscription from "@/components/Subscription";
import UserPopularRecipe from "@/components/UserPopularRecipe";


export default function Home() {
  return (
   <div>
    <Banner></Banner>
    <UserPopularRecipe></UserPopularRecipe>
    <RecipeHubWorks></RecipeHubWorks>
    <Subscription></Subscription>
   </div>
  );
}
