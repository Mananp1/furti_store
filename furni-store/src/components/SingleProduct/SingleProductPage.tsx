import NotFoundPage from "@/pages/NotFoundPage";
import {
  ProductLayout,
  ProductHeader,
  ProductMain,
  ProductImages,
  ProductDetails,
  ProductQuantity,
  ProductActions,
  ProductLoading,
  useProductLogic,
} from "./index";

interface SingleProductPageProps {
  customBackUrl?: string;
  customBackText?: string;
  showWishlistButton?: boolean;
  quantityOptions?: number[];
  loadingMessage?: string;
}

export const SingleProductPage = ({
  customBackUrl,
  customBackText,
  showWishlistButton = true,
  quantityOptions,
  loadingMessage,
}: SingleProductPageProps) => {
  const {
    product,
    isLoading,
    isError,
    quantity,
    setQuantity,
    session,
    isWishlisted,
    isInStock,
    toggleWishlist,
    handleAddToCart,
  } = useProductLogic();

  if (isLoading) return <ProductLoading message={loadingMessage} />;

  if (isError || !product) return <NotFoundPage />;

  return (
    <ProductLayout>
      <ProductHeader backUrl={customBackUrl} backText={customBackText} />
      <ProductMain>
        <ProductImages images={product.images} title={product.title} />
        <div className="flex flex-col gap-4">
          <ProductDetails
            title={product.title}
            price={product.price}
            currency="INR"
            status={product.status}
            description={product.description}
            category={product.category}
            material={product.material}
            dimensions={product.dimensions}
          />
          <ProductQuantity
            quantity={quantity}
            onQuantityChange={setQuantity}
            options={quantityOptions}
          />
          <ProductActions
            isInStock={isInStock}
            isWishlisted={isWishlisted}
            onAddToCart={handleAddToCart}
            onToggleWishlist={toggleWishlist}
            showWishlistButton={showWishlistButton && !!session}
          />
        </div>
      </ProductMain>
    </ProductLayout>
  );
};
