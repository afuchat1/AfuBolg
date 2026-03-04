import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ImagePlus, X, Loader2 } from "lucide-react";

interface CoverImageUploadProps {
  imageUrl: string | null;
  userId: string;
  onImageChange: (url: string | null) => void;
}

const CoverImageUpload = ({ imageUrl, userId, onImageChange }: CoverImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${userId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("article-images").upload(path, file);
    if (error) { toast.error("Upload failed"); setUploading(false); return; }

    const { data } = supabase.storage.from("article-images").getPublicUrl(path);
    onImageChange(data.publicUrl);
    setUploading(false);
    toast.success("Cover image uploaded");
  };

  return (
    <div className="mb-6">
      {imageUrl ? (
        <div className="relative group rounded-xl overflow-hidden aspect-[21/9] bg-muted">
          <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
          <button
            onClick={() => onImageChange(null)}
            className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-foreground p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-border rounded-xl aspect-[21/9] flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
        >
          {uploading ? <Loader2 size={24} className="animate-spin" /> : <ImagePlus size={24} />}
          <span className="text-xs">{uploading ? "Uploading..." : "Add cover image"}</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={upload} className="hidden" />
    </div>
  );
};

export default CoverImageUpload;
