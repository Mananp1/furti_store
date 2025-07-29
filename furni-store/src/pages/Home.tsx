import { Link } from "@tanstack/react-router";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4 text-primary">
        Welcome to FurniStore
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-xl">
        Discover beautiful, modern furniture for every room. Shop our curated
        collection and enjoy fast delivery, easy returns, and top-notch customer
        service.
      </p>
      <Link
        to="/products"
        className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-primary/90 transition"
      >
        Browse Products
      </Link>
    </div>
  );
}
