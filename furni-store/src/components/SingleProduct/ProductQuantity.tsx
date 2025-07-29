interface ProductQuantityProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  options?: number[];
}

export const ProductQuantity = ({
  quantity,
  onQuantityChange,
  options = [1, 2, 3, 4, 5, 10],
}: ProductQuantityProps) => {
  return (
    <div className="flex items-center gap-2 mt-4">
      <label htmlFor="quantity" className="text-sm font-medium">
        Quantity:
      </label>
      <select
        id="quantity"
        value={quantity}
        onChange={(e) => onQuantityChange(Number(e.target.value))}
        className="border rounded px-2 py-1"
      >
        {options.map((q) => (
          <option key={q} value={q}>
            {q}
          </option>
        ))}
      </select>
    </div>
  );
};
