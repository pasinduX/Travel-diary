import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { X, ImagePlus, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { CinematicFooter } from "@/components/voyaloom/CinematicFooter";
import { UploadDropzone } from "@/components/voyaloom/UploadDropzone";
import { AIProcessingLoader } from "@/components/voyaloom/AIProcessingLoader";
import { requireAuth } from "@/lib/auth/guards";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, type TripImage } from "@/interface/trip-image";
import { uploadTripImagesFn } from "@/services/trip-image.functions";
import { seo } from "@/lib/seo/seo";

export const Route = createFileRoute("/upload")({
  validateSearch: z.object({ trip: z.string().optional().catch(undefined) }),
  beforeLoad: ({ context, location }) => requireAuth(context, location.pathname),
  head: () =>
    seo({
      title: "Upload photos",
      description: "Upload your travel photos and let VoyaLoom build your album.",
      robots: "private",
    }),
  component: Upload,
});

const acceptedTypes = new Set<string>(ACCEPTED_IMAGE_TYPES);

interface Picked {
  file: File;
  url: string;
}

function Upload() {
  const { trip: tripId } = Route.useSearch();
  const [stage, setStage] = useState<"upload" | "processing" | "done">("upload");
  const [picked, setPicked] = useState<Picked[]>([]);
  const [uploaded, setUploaded] = useState<TripImage[]>([]);

  // Release every object URL we created, once, on unmount.
  const pickedRef = useRef<Picked[]>([]);
  pickedRef.current = picked;
  useEffect(() => () => pickedRef.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

  function clearPicked() {
    setPicked((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return [];
    });
  }

  function addFiles(list: FileList) {
    const incoming = Array.from(list);
    const valid: Picked[] = [];
    let skipped = 0;

    for (const file of incoming) {
      const typeOk = file.type ? acceptedTypes.has(file.type) : true;
      const sizeOk = file.size > 0 && file.size <= MAX_IMAGE_BYTES;
      const dup = picked.some((p) => p.file.name === file.name && p.file.size === file.size);
      if (typeOk && sizeOk && !dup) {
        valid.push({ file, url: URL.createObjectURL(file) });
      } else if (!dup) {
        skipped += 1;
      }
    }

    if (skipped > 0) {
      toast.warning(
        `${skipped} file${skipped > 1 ? "s were" : " was"} skipped (JPEG, PNG or GIF up to 15 MB).`,
      );
    }
    if (valid.length > 0) setPicked((prev) => [...prev, ...valid]);
  }

  function removeAt(index: number) {
    setPicked((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.url);
      return next;
    });
  }

  async function handleUpload() {
    if (!tripId) {
      toast.error("Create a trip before uploading memories.");
      return;
    }
    if (picked.length === 0) {
      toast.error("Choose at least one image.");
      return;
    }

    const form = new FormData();
    form.append("tripId", tripId);
    for (const { file } of picked) form.append("images", file, file.name);

    setStage("processing");
    try {
      const { uploaded: result, failed } = await uploadTripImagesFn({ data: form });
      setUploaded(result);
      setStage("done");

      const n = result.length;
      toast.success(`${n} memor${n === 1 ? "y" : "ies"} uploaded.`);
      if (failed.length > 0) {
        toast.warning(
          `${failed.length} couldn't be uploaded: ${failed.map((f) => f.fileName).join(", ")}`,
        );
      }
    } catch (error) {
      setStage("upload");
      toast.error(error instanceof Error ? error.message : "The upload failed.");
    }
  }

  return (
    <div className="bg-midnight text-sand min-h-screen">
      <LuxuryNavbar />

      <section className="pt-40 pb-20 px-6 md:px-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] uppercase tracking-ultra text-gold mb-4 block">
            {tripId ? "Add to your trip" : "New Trip"}
          </span>
          <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] mb-6">
            {stage === "upload"
              ? "Bring us your moments."
              : stage === "processing"
                ? "Uploading your memories"
                : "Your memories are in."}
          </h1>
          <p className="font-serif italic text-xl text-sand/60 max-w-xl mx-auto">
            {stage === "upload"
              ? "We'll take it from here."
              : stage === "processing"
                ? "Sit back. This takes a moment of stillness."
                : "Step inside your story."}
          </p>
        </motion.div>

        {stage === "upload" && !tripId && (
          <div className="glass-strong rounded-sm p-10 text-center">
            <h3 className="font-serif text-3xl mb-3">No trip selected</h3>
            <p className="text-sand/60 text-sm mb-8">
              Memories are attached to a trip. Start one first.
            </p>
            <Link
              to="/create-trip"
              className="inline-block bg-gold text-midnight px-10 py-4 text-[11px] uppercase tracking-luxury font-semibold hover:bg-sand transition-colors shadow-gold"
            >
              Create a trip
            </Link>
          </div>
        )}

        {stage === "upload" && tripId && (
          <>
            <UploadDropzone onFiles={addFiles} />

            {picked.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase tracking-luxury text-sand/50">
                    {picked.length} selected
                  </span>
                  <button
                    type="button"
                    onClick={clearPicked}
                    className="text-[10px] uppercase tracking-luxury text-sand/40 hover:text-gold transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {picked.map((p, i) => (
                    <div
                      key={p.url}
                      className="group relative aspect-square overflow-hidden rounded-sm"
                    >
                      <img src={p.url} alt={p.file.name} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeAt(i)}
                        aria-label={`Remove ${p.file.name}`}
                        className="absolute top-1 right-1 size-6 rounded-full bg-midnight/80 text-sand/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:text-gold"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={handleUpload}
                disabled={picked.length === 0}
                className="inline-flex items-center gap-3 bg-gold text-midnight px-12 py-4 text-[11px] uppercase tracking-luxury font-semibold hover:bg-sand transition-colors shadow-gold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ImagePlus className="size-4" />
                {picked.length > 0 ? `Upload ${picked.length}` : "Upload memories"}
              </button>
            </div>
          </>
        )}

        {stage === "processing" && (
          <div className="py-20">
            <AIProcessingLoader />
            <p className="text-center text-[10px] uppercase tracking-luxury text-sand/40 mt-16 flex items-center justify-center gap-2">
              <Loader2 className="size-3 animate-spin" />
              Uploading {picked.length} file{picked.length === 1 ? "" : "s"} — this can take a
              while, don't close this tab
            </p>
          </div>
        )}

        {stage === "done" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex size-20 rounded-full bg-gold/10 border border-gold/30 mb-8 items-center justify-center">
              <span className="font-serif italic text-gold text-3xl">✓</span>
            </div>
            <h2 className="font-serif text-4xl mb-4">
              {uploaded.length} memor{uploaded.length === 1 ? "y" : "ies"} saved.
            </h2>

            {uploaded.length > 0 && (
              <div className="mt-10 mb-12 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {uploaded.map((img) => (
                  <div
                    key={img.id}
                    className="aspect-square overflow-hidden rounded-sm bg-charcoal/40"
                  >
                    {img.s3Url ? (
                      <img
                        src={img.s3Url}
                        alt={img.fileName}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  clearPicked();
                  setUploaded([]);
                  setStage("upload");
                }}
                className="border border-white/20 px-8 py-4 text-[11px] uppercase tracking-luxury hover:bg-white/5 transition-colors"
              >
                Add more
              </button>
              {tripId && (
                <Link
                  to="/trip/$slug"
                  params={{ slug: tripId }}
                  className="inline-block bg-gold text-midnight px-10 py-4 text-[11px] uppercase tracking-luxury font-semibold hover:bg-sand transition-colors shadow-gold"
                >
                  Open trip
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </section>

      <CinematicFooter />
    </div>
  );
}
