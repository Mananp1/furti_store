interface ProductLoadingProps {
  message?: string;
}

export const ProductLoading = ({
  message = "Loading...",
}: ProductLoadingProps) => {
  return <div className="flex justify-center items-center h-96">{message}</div>;
};
