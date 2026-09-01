import { motion } from "framer-motion";
import { Upload, QrCode } from "lucide-react";
import { useState } from "react";

export function UploadDropzone({ onFiles }: { onFiles?: (files: FileList) => void }) {
  const [drag, setDrag] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <motion.label
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        if (e.dataTransfer.files) {
          setCount(e.dataTransfer.files.length);
          onFiles?.(e.dataTransfer.files);
        }
      }}
      whileHover={{ scale: 1.005 }}
      className={`relative block w-full cursor-pointer rounded-sm border border-dashed transition-all duration-500 ${
        drag ? "border-gold bg-gold/5" : "border-white/15 bg-charcoal/40"
      }`}
    >
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            setCount(e.target.files.length);
            onFiles?.(e.target.files);
          }
        }}
      />
      <div className="py-24 px-8 text-center">
        <motion.div
          animate={{ y: drag ? -8 : 0 }}
          className="inline-flex items-center justify-center size-20 rounded-full bg-gold/10 border border-gold/30 mb-8"
        >
          <Upload className="size-8 text-gold" />
        </motion.div>
        <h3 className="font-serif text-4xl text-sand mb-3">
          {count > 0 ? `${count} memories ready` : "Drop your memories here"}
        </h3>
        <p className="text-sand/50 text-sm max-w-md mx-auto mb-8">
          Or browse from your device. Photos and videos from any moment of your journey.
        </p>
        <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-luxury text-gold">
          <QrCode className="size-4" />
          <span>Or scan QR for mobile upload</span>
        </div>
      </div>
    </motion.label>
  );
}
