import { formatCurrency } from "@/lib/utils";

interface ProductDetailsProps {
  title: string;
  price: number;
  currency?: string;
  status?: string;
  description?: string;
  category?: string;
  material?: string;
  dimensions?: string;
}

export const ProductDetails = ({
  title,
  price,
  currency = "INR",
  status,
  description,
  category,
  material,
  dimensions,
}: ProductDetailsProps) => {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">{title}</h1>

      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold">
          {formatCurrency(price, currency)}
        </span>
        {status && (
          <span
            className={`text-xs px-2 py-1 rounded ${
              status === "In Stock"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status}
          </span>
        )}
      </div>

      <p className="text-muted-foreground">
        {description || "No description available."}
      </p>

      <div className="text-sm text-muted-foreground space-y-1">
        {category && (
          <p>
            <strong>Category:</strong> {category}
          </p>
        )}
        {material && (
          <p>
            <strong>Material:</strong> {material}
          </p>
        )}
        {dimensions && (
          <p>
            <strong>Dimensions:</strong> {dimensions}
          </p>
        )}
      </div>
    </section>
  );
};
