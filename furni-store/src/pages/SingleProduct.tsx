import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import NotFoundPage from "@/pages/NotFoundPage";
import { Link } from "@tanstack/react-router";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/lib/hooks/useCart";
import { useWishlist } from "@/lib/hooks/useWishlist";

const productSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  price: z.number(),
  currency: z.string().optional(),
  images: z.array(z.string()),
  category: z.string().optional(),
  material: z.string().optional(),
  dimensions: z.string().optional(),
  status: z.string().optional(),
  rating: z.number().optional(),
});

type Product = z.infer<typeof productSchema>;
const quantityOptions = [1, 2, 3, 4, 5, 10];

export default function SingleProduct() {
  const { id } = useParams({ strict: false }) as { id: string };
  const [quantity, setQuantity] = useState(1);
  const { data: session } = useSession();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/api/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      const json = await res.json();
      return productSchema.parse(json);
    },
    enabled: !!id,
  });

  const isWishlisted = product ? isInWishlist(product._id) : false;

  const toggleWishlist = async () => {
    if (!product) return;

    if (isWishlisted) {
      await removeFromWishlist(product._id);
    } else {
      // Transform product to match Product type
      const wishlistProduct = {
        _id: product._id,
        title: product.title,
        category: product.category || "Uncategorized",
        material: product.material || "Unknown",
        price: product.price,
        images: product.images,
        description: product.description,
      };
      await addToWishlist(wishlistProduct);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    // Add the product to cart with the selected quantity
    const cartProduct = {
      _id: product._id,
      title: product.title,
      category: product.category || "Uncategorized",
      material: product.material || "Unknown",
      price: product.price,
      images: product.images,
      description: product.description,
    };

    // Add multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      await addToCart(cartProduct);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">Loading...</div>
    );

  if (isError || !product) return <NotFoundPage />;

  return (
    <>
      {/* Full-width Back Button */}
      <div className="max-w-5xl mt-6 mx-auto px-4">
        <Button>
          <Link to="/products" className="flex items-center space-x-2">
            <ArrowLeft />
            <span>Back to Products</span>
          </Link>
        </Button>
      </div>

      {/* Two-column layout for product */}
      <main className="max-w-5xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Product Images */}
        <section className="flex flex-col gap-4">
          <Card className="overflow-hidden p-0">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-[22rem] object-cover"
            />
          </Card>
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-2">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-16 h-16 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </section>

        {/* Right: Product Details */}
        <section className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">
              {product.currency === "USD" ? "$" : product.currency}
              {product.price.toFixed(2)}
            </span>
            {product.status && (
              <span
                className={`text-xs px-2 py-1 rounded ${
                  product.status === "In Stock"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.status}
              </span>
            )}
          </div>
          <p className="text-muted-foreground">
            {product.description || "No description available."}
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            {product.category && (
              <p>
                <strong>Category:</strong> {product.category}
              </p>
            )}
            {product.material && (
              <p>
                <strong>Material:</strong> {product.material}
              </p>
            )}
            {product.dimensions && (
              <p>
                <strong>Dimensions:</strong> {product.dimensions}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <label htmlFor="quantity" className="text-sm font-medium">
              Quantity:
            </label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {quantityOptions.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              size="lg"
              className="flex items-center gap-2"
              disabled={product.status !== "In Stock"}
              variant={product.status !== "In Stock" ? "secondary" : undefined}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </Button>
            {session && (
              <Button
                variant="outline"
                size="lg"
                className={`flex items-center gap-2 ${
                  isWishlisted ? "border-red-500 bg-red-50" : ""
                }`}
                onClick={toggleWishlist}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWishlisted ? "text-red-500 fill-current" : ""
                  }`}
                />
                {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
