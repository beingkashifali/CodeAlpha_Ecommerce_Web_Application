import { useState } from "react";

const ProductGallery = ({ images = [] }) => {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [];
  // const list = Array.isArray(images) ? images : [];

  return (
    <div>
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-brand-50">
        {list[active] ? (
          <img
            src={list[active]}
            alt="product"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-300">
            No image available
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 ${
                active === i ? "border-brand-700" : "border-transparent"
              }`}
            >
              <img
                src={img}
                alt={`thumbnail ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
