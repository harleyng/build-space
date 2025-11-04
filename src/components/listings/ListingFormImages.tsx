import { Label } from "@/components/ui/label";
import { Upload, X, GripVertical } from "lucide-react";
import { useState } from "react";

interface ListingFormImagesProps {
  imagePreviewUrls: string[];
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onReorderImages?: (newOrder: string[]) => void;
}

export const ListingFormImages = ({
  imagePreviewUrls,
  onImageSelect,
  onRemoveImage,
  onReorderImages,
}: ListingFormImagesProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...imagePreviewUrls];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    if (onReorderImages) {
      onReorderImages(newImages);
    }
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

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
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative group cursor-move ${draggedIndex === index ? 'opacity-50' : ''}`}
              >
                <div className="absolute top-2 left-2 bg-background/80 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
                <img
                  src={url}
                  alt={`Hình ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="absolute top-2 right-2 bg-foreground text-background rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            {imagePreviewUrls.length < 10 && (
              <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center h-32">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onImageSelect}
                  className="hidden"
                  id="image-upload-more"
                />
                <label htmlFor="image-upload-more" className="cursor-pointer text-center p-4 w-full h-full flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="mt-1 text-xs text-muted-foreground">Thêm</p>
                  <p className="text-xs text-muted-foreground font-medium">{imagePreviewUrls.length}/10</p>
                </label>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
