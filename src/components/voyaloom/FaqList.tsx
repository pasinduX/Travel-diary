import type { FaqItem } from "@/lib/seo/faq";

/**
 * Renders FAQ content as crawlable, semantic HTML (a `<dl>` of question /
 * answer pairs). The text here is the same text emitted into the FAQPage
 * JSON-LD, so search engines and answer engines see one consistent set.
 */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <dl className="divide-y divide-white/10 border-y border-white/10">
      {items.map((item) => (
        <div key={item.question} className="py-7">
          <dt className="font-serif text-2xl md:text-3xl text-sand leading-snug">
            {item.question}
          </dt>
          <dd className="mt-3 text-sand/60 font-light leading-relaxed max-w-2xl">{item.answer}</dd>
        </div>
      ))}
    </dl>
  );
}
