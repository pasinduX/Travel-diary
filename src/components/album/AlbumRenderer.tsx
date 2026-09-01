import type { AlbumPlan } from "@/interface/album";
import { AlbumBlockRenderer } from "./AlbumBlockRenderer";

interface AlbumRendererProps {
  album: AlbumPlan;
  images: Record<string, string>;
}

export function AlbumRenderer({ album, images }: AlbumRendererProps) {
  return (
    <article className="bg-midnight text-sand">
      <header className="relative flex min-h-[80vh] items-end overflow-hidden px-6 py-20 md:px-12 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-midnight to-midnight" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="mb-6 text-[10px] uppercase tracking-ultra text-gold">
            A VoyaLoom travel story
          </p>
          <h1 className="max-w-4xl font-serif text-6xl leading-[0.9] md:text-8xl">{album.title}</h1>
          {album.subtitle && (
            <p className="mt-6 font-serif italic text-2xl text-sand/60">{album.subtitle}</p>
          )}
        </div>
      </header>

      {album.chapters
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((chapter) => (
          <section key={chapter.id} className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-40">
            <div className="mb-16 max-w-3xl">
              {chapter.eyebrow && (
                <p className="mb-4 text-[10px] uppercase tracking-ultra text-gold">
                  {chapter.eyebrow}
                </p>
              )}
              <h2 className="font-serif text-5xl leading-tight md:text-7xl">{chapter.title}</h2>
              {chapter.quote && (
                <p className="mt-6 font-serif italic text-2xl text-sand/70">“{chapter.quote}”</p>
              )}
              {chapter.description && (
                <p className="mt-5 max-w-xl leading-relaxed text-sand/60">{chapter.description}</p>
              )}
            </div>
            <div className="space-y-20 md:space-y-32">
              {chapter.blocks.map((block, index) => (
                <AlbumBlockRenderer key={`${chapter.id}-${index}`} block={block} images={images} />
              ))}
            </div>
          </section>
        ))}
    </article>
  );
}
