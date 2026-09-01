import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  pending?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  pending = false,
  onOpenChange,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="font-sans border-white/10 bg-charcoal text-sand shadow-cinematic sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-3xl font-normal text-sand">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="font-sans text-sm leading-relaxed text-sand/55">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-3 sm:gap-3">
          <AlertDialogCancel
            disabled={pending}
            className="mt-2 font-sans text-[10px] uppercase tracking-luxury border-white/15 bg-transparent text-sand/70 hover:bg-white/5 hover:text-sand sm:mt-0"
          >
            Keep it
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            onClick={(event) => {
              event.preventDefault();
              void onConfirm();
            }}
            className="font-sans text-[10px] uppercase tracking-luxury bg-ember text-white hover:bg-ember/80"
          >
            {pending ? "Removing..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
