import { Card } from "@/components/ui/card";

interface ProductImagesProps {
  images: string[];
  title: string;
}

export const ProductImages = ({ images, title }: ProductImagesProps) => {
  return (
    <section className="flex flex-col gap-4">
      <Card className="overflow-hidden p-0">
        <img
          src={images[0]}
          alt={title}
          className="w-full h-[22rem] object-cover"
        />
      </Card>
      {images.length > 1 && (
        <div className="flex gap-2 mt-2">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${title} - Thumbnail ${i + 1}`}
              className="w-16 h-16 object-cover rounded border"
            />
          ))}
        </div>
      )}
    </section>
  );
};
