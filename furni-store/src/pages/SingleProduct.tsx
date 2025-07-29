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
} from "@/components/SingleProduct";

export default function SingleProduct() {
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

  if (isLoading) return <ProductLoading />;

  if (isError || !product) return <NotFoundPage />;

  return (
    <ProductLayout>
      <ProductHeader />
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
          <ProductQuantity quantity={quantity} onQuantityChange={setQuantity} />
          <ProductActions
            isInStock={isInStock}
            isWishlisted={isWishlisted}
            onAddToCart={handleAddToCart}
            onToggleWishlist={toggleWishlist}
            showWishlistButton={!!session}
          />
            </div>
      </ProductMain>
    </ProductLayout>
  );
}
