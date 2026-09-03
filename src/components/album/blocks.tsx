import type { AlbumBlock } from "@/interface/album";

type BlockProps = { block: AlbumBlock; images: Record<string, string> };

export function AlbumCover({ block, images }: BlockProps) {
  return <FullBleedImage block={block} images={images} />;
}

export function ChapterSplit({ block, images }: BlockProps) {
  const image = firstImage(block, images);
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <div className="order-1 space-y-5">
        {block.eyebrow && (
          <p className="text-[10px] uppercase tracking-ultra text-gold">{block.eyebrow}</p>
        )}
        {block.title && <h3 className="font-serif text-4xl md:text-6xl">{block.title}</h3>}
        {block.quote && <p className="font-serif italic text-2xl text-sand/70">“{block.quote}”</p>}
        {block.description && (
          <p className="max-w-md leading-relaxed text-sand/60">{block.description}</p>
        )}
      </div>
      {image && (
        <img
          src={image}
          alt={block.title ?? "Travel moment"}
          loading="lazy"
          className="order-2 aspect-[4/5] w-full object-cover"
        />
      )}
    </div>
  );
}

export function FullBleedImage({ block, images }: BlockProps) {
  const image = firstImage(block, images);
  if (!image) return null;
  return (
    <figure className="group relative overflow-hidden bg-charcoal">
      <img
        src={image}
        alt={block.title ?? "Travel moment"}
        loading="lazy"
        className="h-[70vh] min-h-[420px] w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/10 to-transparent" />
      {(block.title || block.caption) && (
        <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-12">
          {block.title && <h3 className="font-serif text-4xl md:text-6xl">{block.title}</h3>}
          {block.caption && <p className="mt-3 max-w-lg text-sm text-sand/65">{block.caption}</p>}
        </figcaption>
      )}
    </figure>
  );
}

export function FullBleedQuote({ block, images }: BlockProps) {
  const image = firstImage(block, images);
  if (!image) return <StoryText block={block} />;
  return (
    <div className="relative flex min-h-[65vh] items-center overflow-hidden">
      <img
        src={image}
        alt={block.title ?? "Travel moment"}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-midnight/55" />
      <div
        className={`relative z-10 max-w-2xl px-8 py-20 md:px-16 ${positionClass(block.textPosition)}`}
      >
        {block.eyebrow && (
          <p className="mb-5 text-[10px] uppercase tracking-ultra text-gold">{block.eyebrow}</p>
        )}
        {block.quote && (
          <p className="font-serif text-4xl leading-tight md:text-6xl">“{block.quote}”</p>
        )}
      </div>
    </div>
  );
}

export function EditorialGrid({ block, images }: BlockProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-5">
      {imageList(block, images).map((image, index) => (
        <img
          key={image}
          src={image}
          alt="Travel moment"
          loading="lazy"
          className={`w-full object-cover ${index === 1 ? "col-span-2 aspect-[4/3] md:col-span-5 md:row-span-2 md:aspect-[3/4]" : "aspect-square md:col-span-3"}`}
        />
      ))}
    </div>
  );
}

export function PortraitPair({ block, images }: BlockProps) {
  return <PairLayout block={block} images={images} aspect="aspect-[3/4]" />;
}

export function LandscapePair({ block, images }: BlockProps) {
  return <PairLayout block={block} images={images} aspect="aspect-[4/3]" />;
}

export function ImageCaption({ block, images }: BlockProps) {
  const image = firstImage(block, images);
  if (!image) return null;
  return (
    <figure className="group">
      <img
        src={image}
        alt={block.title ?? "Travel moment"}
        loading="lazy"
        className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
      />
      {block.title && <h3 className="mt-5 font-serif text-3xl text-sand/90">{block.title}</h3>}
      {block.caption && (
        <figcaption className="mt-4 max-w-lg font-serif italic text-xl text-sand/60">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

export function Panorama({ block, images }: BlockProps) {
  const image = firstImage(block, images);
  return image ? (
    <img
      src={image}
      alt={block.title ?? "Panorama"}
      loading="lazy"
      className="aspect-[2/1] w-full object-cover md:aspect-[3/1]"
    />
  ) : null;
}

export function FilmStrip({ block, images }: BlockProps) {
  return (
    <figure>
      {(block.title || block.caption) && (
        <figcaption className="mb-6 flex items-end justify-between gap-6">
          {block.title && <h3 className="font-serif text-4xl md:text-5xl">{block.title}</h3>}
          {block.caption && (
            <p className="max-w-sm text-right text-sm text-sand/55">{block.caption}</p>
          )}
        </figcaption>
      )}
      <div className="flex snap-x gap-3 overflow-x-auto pb-4">
        {imageList(block, images)
          .slice(0, 4)
          .map((image) => (
            <img
              key={image}
              src={image}
              alt="Travel moment"
              loading="lazy"
              className="aspect-[4/3] w-[78vw] shrink-0 snap-start object-cover sm:w-[45vw] md:w-[28vw]"
            />
          ))}
      </div>
    </figure>
  );
}

export function StoryText({ block }: { block: AlbumBlock }) {
  return (
    <div className="mx-auto max-w-2xl py-12 text-center md:py-24">
      <p className="font-serif text-3xl leading-tight text-sand/85 md:text-5xl">
        {block.text ?? block.description}
      </p>
    </div>
  );
}

export function ChapterTransition({ block, images }: BlockProps) {
  return (
    <div className="py-12 text-center md:py-24">
      {block.eyebrow && (
        <p className="text-[10px] uppercase tracking-ultra text-gold">{block.eyebrow}</p>
      )}
      {firstImage(block, images) && (
        <img
          src={firstImage(block, images)}
          alt="Travel transition"
          loading="lazy"
          className="mx-auto mt-8 h-48 w-full max-w-3xl object-cover opacity-75"
        />
      )}
    </div>
  );
}

export function ClosingFrame({ block, images }: BlockProps) {
  return (
    <div className="text-center">
      {firstImage(block, images) && (
        <img
          src={firstImage(block, images)}
          alt={block.title ?? "Closing travel moment"}
          loading="lazy"
          className="h-[65vh] min-h-[420px] w-full object-cover"
        />
      )}
      {block.text && (
        <p className="mx-auto max-w-2xl pt-10 font-serif text-3xl italic text-sand/75 md:text-5xl">
          {block.text}
        </p>
      )}
      {block.title && <h3 className="mt-10 font-serif text-5xl md:text-7xl">{block.title}</h3>}
      {block.caption && (
        <p className="mx-auto mt-4 max-w-lg text-sm text-sand/55">{block.caption}</p>
      )}
    </div>
  );
}

function PairLayout({ block, images, aspect }: BlockProps & { aspect: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {imageList(block, images)
        .slice(0, 2)
        .map((image) => (
          <img
            key={image}
            src={image}
            alt="Travel moment"
            loading="lazy"
            className={`w-full object-cover ${aspect}`}
          />
        ))}
    </div>
  );
}

function imageList(block: AlbumBlock, images: Record<string, string>): string[] {
  return (block.imageIds ?? [])
    .map((id) => images[id])
    .filter((image): image is string => Boolean(image));
}

function firstImage(block: AlbumBlock, images: Record<string, string>): string | undefined {
  return imageList(block, images)[0];
}

function positionClass(position: AlbumBlock["textPosition"]): string {
  switch (position) {
    case "right":
    case "top_right":
      return "ml-auto";
    case "center":
      return "mx-auto text-center";
    default:
      return "mr-auto";
  }
}
