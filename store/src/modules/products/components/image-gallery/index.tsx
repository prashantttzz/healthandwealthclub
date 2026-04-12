import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <div className="flex flex-col gap-y-4 lg:gap-y-6">
      {images.length > 0 && images[0].url && (
        <div className="relative aspect-[4/5] w-full h-100 overflow-hidden bg-neutral-100">
          <Image
            src={images[0].url}
            priority={true}
            className="absolute inset-0 object-cover"
            alt="Main product image"
            fill
            sizes="100vw"
          />
        </div>
      )}

      {/* Mosaic Grid */}
      <div className="grid grid-cols-2 gap-4 lg:gap-6">
        {images.slice(1).map((image, index) => {
          return (
            <div
              key={image.id}
              className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100"
            >
              <Image
                src={image.url || ""}
                priority={false}
                className="absolute inset-0 object-cover"
                alt={`Product image ${index + 2}`}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ImageGallery
