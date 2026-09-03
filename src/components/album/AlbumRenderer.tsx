import type { AlbumPlan } from "@/interface/album";
import { AlbumBlockRenderer } from "./AlbumBlockRenderer";

interface AlbumRendererProps {
  album: AlbumPlan;
  images: Record<string, string>;
}

export function AlbumRenderer({ album, images }: AlbumRendererProps) {
  const coverId = album.chapters
    .flatMap((chapter) => chapter.blocks)
    .find((block) => block.type === "album_cover")?.imageIds?.[0];
  const coverImage = coverId ? images[coverId] : undefined;

  return (
    <article className="album-story bg-midnight text-sand">
      <header className="relative flex min-h-[88vh] items-end overflow-hidden px-6 py-24 md:px-12 md:py-32">
        {coverImage ? (
          <img src={coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-midnight to-midnight" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/55 to-midnight/15" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="mb-6 text-[10px] uppercase tracking-ultra text-gold">
            {album.tone ? `${album.tone.replaceAll("_", " ")} · ` : ""}A VoyaLoom travel story
          </p>
          <h1 className="max-w-5xl font-serif text-6xl leading-[0.88] tracking-tight md:text-9xl">
            {album.title}
          </h1>
          {album.subtitle && (
            <p className="mt-6 max-w-xl font-serif italic text-2xl text-sand/75">
              {album.subtitle}
            </p>
          )}
          <div className="mt-12 flex items-center gap-3 text-[9px] uppercase tracking-ultra text-sand/45">
            <span className="h-px w-12 bg-gold/60" />
            <span>
              {
                album.chapters.filter((chapter) => chapter.order > 0 && chapter.id !== "closing")
                  .length
              }{" "}
              chapters
            </span>
          </div>
        </div>
      </header>

      {album.quotes && album.quotes.length > 0 && (
        <div className="border-y border-sand/10 bg-charcoal/35 px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-4xl space-y-16 text-center">
            {album.quotes
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((quote) => (
                <blockquote key={`${quote.order}-${quote.from}-${quote.to}`}>
                  <p className="font-serif text-3xl italic leading-tight text-sand/85 md:text-5xl">
                    “{quote.text}”
                  </p>
                  <footer className="mt-5 text-[10px] uppercase tracking-ultra text-gold/75">
                    {quote.from} / {quote.to}
                  </footer>
                </blockquote>
              ))}
          </div>
        </div>
      )}

      {album.chapters
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((chapter, chapterIndex) => (
          <section
            key={chapter.id}
            className={`mx-auto max-w-7xl px-6 md:px-12 ${
              chapter.order === 0 ? "py-16 md:py-24" : "border-t border-sand/10 py-24 md:py-40"
            }`}
          >
            {chapter.order !== 0 && (
              <div className="mb-16 flex items-end justify-between gap-6">
                <div className="max-w-3xl">
                  {chapter.eyebrow && (
                    <p className="mb-4 text-[10px] uppercase tracking-ultra text-gold">
                      {chapter.eyebrow}
                    </p>
                  )}
                  <h2 className="font-serif text-5xl leading-tight md:text-7xl">{chapter.title}</h2>
                  {chapter.description && (
                    <p className="mt-5 max-w-xl leading-relaxed text-sand/60">
                      {chapter.description}
                    </p>
                  )}
                </div>
                <span className="hidden font-serif text-7xl leading-none text-sand/10 md:block">
                  {String(chapterIndex).padStart(2, "0")}
                </span>
              </div>
            )}
            <div
              className={
                chapter.order === 0 ? "space-y-16 md:space-y-24" : "space-y-20 md:space-y-32"
              }
            >
              {chapter.blocks
                .filter((block) => block.type !== "album_cover")
                .map((block, index) => (
                  <div key={`${chapter.id}-${index}`} className="album-reveal">
                    <AlbumBlockRenderer block={block} images={images} />
                  </div>
                ))}
            </div>
          </section>
        ))}
    </article>
  );
}
