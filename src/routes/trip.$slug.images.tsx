import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LuxuryNavbar } from "@/components/voyaloom/LuxuryNavbar";
import { UploadDropzone } from "@/components/voyaloom/UploadDropzone";
import { ConfirmDialog } from "@/components/voyaloom/ConfirmDialog";
import { requireAuth } from "@/lib/auth/guards";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, type TripImage } from "@/interface/trip-image";
import { seo } from "@/lib/seo/seo";
import {
  deleteTripImageFn,
  listTripImagesFn,
  uploadTripImagesFn,
} from "@/services/trip-image.functions";

export const Route = createFileRoute("/trip/$slug/images")({
  beforeLoad: ({ context, location }) => requireAuth(context, location.pathname),
  head: () =>
    seo({
      title: "Your photographs",
      description: "Manage your trip photographs.",
      robots: "private",
    }),
  component: TripImages,
});

const acceptedTypes = new Set<string>(ACCEPTED_IMAGE_TYPES);

function TripImages() {
  const { slug: tripId } = Route.useParams();
  const [images, setImages] = useState<TripImage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [imagePendingDelete, setImagePendingDelete] = useState<TripImage | null>(null);

  useEffect(() => {
    listTripImagesFn({ data: { tripId } })
      .then(setImages)
      .catch((reason) =>
        setError(reason instanceof Error ? reason.message : "Could not load images."),
      );
  }, [tripId]);

  function pickFiles(list: FileList) {
    const valid = Array.from(list).filter(
      (file) =>
        (file.type ? acceptedTypes.has(file.type) : true) &&
        file.size > 0 &&
        file.size <= MAX_IMAGE_BYTES,
    );
    if (valid.length !== list.length)
      toast.warning("Some files were skipped. Use JPEG, PNG or GIF up to 15 MB.");
    setSelected((current) => [...current, ...valid]);
  }

  async function addPhotos() {
    if (selected.length === 0) return;
    const form = new FormData();
    form.append("tripId", tripId);
    selected.forEach((file) => form.append("images", file, file.name));
    setUploading(true);
    try {
      const result = await uploadTripImagesFn({ data: form });
      setImages((current) => [...(current ?? []), ...result.uploaded]);
      setSelected([]);
      toast.success(
        `${result.uploaded.length} photo${result.uploaded.length === 1 ? "" : "s"} added.`,
      );
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Could not add photos.");
    } finally {
      setUploading(false);
    }
  }

  async function removePhoto(image: TripImage) {
    setDeletingId(image.id);
    try {
      await deleteTripImageFn({ data: { tripId, imageId: image.id } });
      setImages((current) => current?.filter((item) => item.id !== image.id) ?? []);
      setImagePendingDelete(null);
      toast.success("Photo deleted.");
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Could not delete photo.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-midnight text-sand">
      <LuxuryNavbar />
      <ConfirmDialog
        open={imagePendingDelete !== null}
        title="Remove this photograph?"
        description={`${imagePendingDelete?.fileName || "This photograph"} will be permanently removed from this trip.`}
        pending={deletingId !== null}
        onOpenChange={(open) => {
          if (!open && deletingId === null) setImagePendingDelete(null);
        }}
        onConfirm={() => (imagePendingDelete ? removePhoto(imagePendingDelete) : undefined)}
      />
      <main className="mx-auto max-w-7xl px-6 pb-32 pt-40 md:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <p className="text-[10px] uppercase tracking-ultra text-gold">Your photographs</p>
            <h1 className="mt-4 font-serif text-5xl md:text-7xl">Every moment.</h1>
            <p className="mt-4 text-sm text-sand/50">
              Add more memories or remove the ones you no longer want in this journey.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/album/$slug"
              params={{ slug: tripId }}
              className="border border-white/20 px-5 py-3 text-[10px] uppercase tracking-luxury hover:border-gold hover:text-gold"
            >
              View album
            </Link>
            <Link
              to="/dashboard"
              className="border border-white/20 px-5 py-3 text-[10px] uppercase tracking-luxury hover:border-gold hover:text-gold"
            >
              Dashboard
            </Link>
          </div>
        </div>

        <section className="mt-12">
          <UploadDropzone onFiles={pickFiles} />
          {selected.length > 0 && (
            <div className="mt-6 flex items-center justify-between border border-gold/20 bg-gold/5 px-5 py-4">
              <span className="text-[10px] uppercase tracking-luxury text-gold">
                {selected.length} ready to add
              </span>
              <button
                type="button"
                onClick={() => void addPhotos()}
                disabled={uploading}
                className="inline-flex items-center gap-2 bg-gold px-5 py-3 text-[10px] font-semibold uppercase tracking-luxury text-midnight disabled:opacity-60"
              >
                {uploading && <Loader2 className="size-3 animate-spin" />}
                Add photos
              </button>
            </div>
          )}
        </section>

        {error && <p className="py-20 text-center text-sm text-ember">{error}</p>}
        {!images && !error && (
          <div className="flex justify-center py-24">
            <Loader2 className="size-5 animate-spin text-gold" />
          </div>
        )}
        {images && images.length === 0 && (
          <p className="py-24 text-center font-serif text-3xl text-sand/60">No photographs yet.</p>
        )}
        {images && images.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((image) => (
              <figure
                key={image.id}
                className="group relative aspect-square overflow-hidden bg-charcoal"
              >
                <img
                  src={image.s3Url}
                  alt={image.fileName || "Trip photograph"}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => setImagePendingDelete(image)}
                  disabled={deletingId === image.id}
                  aria-label={`Delete ${image.fileName || "photo"}`}
                  className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full border border-white/20 bg-midnight/80 text-sand opacity-100 transition-colors hover:border-ember hover:text-ember md:opacity-0 md:group-hover:opacity-100"
                >
                  {deletingId === image.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </button>
                <figcaption className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-midnight/90 to-transparent px-4 pb-3 pt-8 text-[10px] text-sand/70">
                  {image.fileName}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
