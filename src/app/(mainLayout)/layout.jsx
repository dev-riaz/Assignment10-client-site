import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const layout = ({ children }) => {
  return (
    <div className="">
      <Navbar />
      <div className="min-h-full flex flex-col bg-[#fdf3e9a1]">{children}</div>
      <Footer />
    </div>
  );
};

export default layout;
