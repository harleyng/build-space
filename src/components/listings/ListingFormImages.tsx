import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface ListingFormImagesProps {
  imagePreviewUrls: string[];
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export const ListingFormImages = ({
  imagePreviewUrls,
  onImageSelect,
  onRemoveImage,
}: ListingFormImagesProps) => {
  return (
    <div className="space-y-4">
      <Label>Hình ảnh <span className="text-destructive">*</span></Label>
      <div className="border-2 border-dashed rounded-lg p-6 text-center">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onImageSelect}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Nhấn để chọn ảnh (tối đa 10 ảnh)
          </p>
        </label>
      </div>

      {imagePreviewUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imagePreviewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
