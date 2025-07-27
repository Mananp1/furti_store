import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, ArrowRight } from "lucide-react"; // Added ShoppingCart icon for relevance

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
      {/* Light background for furniture feel */}
      <div className="text-center max-w-2xl">
        {/* Updated badge for 'New Arrivals' */}
        <Badge className="rounded-full border-none bg-gradient-to-r from-black to-gray-800 text-white">
          New Arrivals
        </Badge>

        {/* Updated Heading */}
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl md:leading-[1.2] font-bold">
          Discover Your Dream Furniture
        </h1>

        {/* Updated Description */}
        <p className="mt-6 text-[17px] md:text-lg text-gray-700">
          Explore our exclusive furniture collections designed to fit your home.
          From modern styles to classic pieces, find exactly what you need to
          create your perfect space.
        </p>

        {/* Action Buttons */}
        <div className="mt-12 flex items-center justify-center gap-6">
          {/* Shop Now Button */}
          <Button variant="default" size="lg" className="flex items-center gap-2">
            <Link to="/products" className="flex items-center gap-2">
              Shop Now
              <ArrowRight className="!h-5 !w-5" />
            </Link>
          </Button>

          {/* Explore Collections Button */}
          <Button variant="outline" size="lg" className="flex items-center gap-2">
            <ShoppingCart className="!h-5 !w-5" />
            Explore Collections
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
