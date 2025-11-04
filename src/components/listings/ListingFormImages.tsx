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
      
      {imagePreviewUrls.length === 0 ? (
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
      ) : (
        <>
          <p className="text-sm text-muted-foreground">Kéo và thả để sắp xếp lại</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imagePreviewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Hình ${index + 1}`}
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
            
            {imagePreviewUrls.length < 10 && (
              <div className="border-2 border-dashed rounded-lg flex items-center justify-center h-32">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onImageSelect}
                  className="hidden"
                  id="image-upload-more"
                />
                <label htmlFor="image-upload-more" className="cursor-pointer text-center p-4">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-1 text-xs text-muted-foreground">Thêm</p>
                </label>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
