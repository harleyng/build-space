import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ListingFormImages } from "./ListingFormImages";

interface ListingFormStep5MediaProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  prominentFeatures: string;
  setProminentFeatures: (value: string) => void;
  imagePreviewUrls: string[];
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export const ListingFormStep5Media = ({
  title,
  setTitle,
  description,
  setDescription,
  prominentFeatures,
  setProminentFeatures,
  imagePreviewUrls,
  onImageSelect,
  onRemoveImage,
}: ListingFormStep5MediaProps) => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold mb-2">Hình ảnh và Mô tả</h2>
        <p className="text-muted-foreground text-lg">
          Thêm hình ảnh và mô tả chi tiết để thu hút khách hàng
        </p>
      </div>

      <ListingFormImages
        imagePreviewUrls={imagePreviewUrls}
        onImageSelect={onImageSelect}
        onRemoveImage={onRemoveImage}
      />

      <div className="space-y-2">
        <Label htmlFor="title">Tiêu đề tin đăng <span className="text-destructive">*</span></Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ví dụ: Bán căn hộ 3PN view đẹp Vinhomes Central Park"
          maxLength={100}
          required
        />
        <p className="text-xs text-muted-foreground">{title.length}/100 ký tự</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả chi tiết <span className="text-destructive">*</span></Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả chi tiết về bất động sản, vị trí, tiện ích xung quanh..."
          rows={8}
          required
        />
        <p className="text-xs text-muted-foreground">{description.length} ký tự (Tối thiểu 300)</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="prominentFeatures">Đặc điểm nổi bật</Label>
        <Input
          id="prominentFeatures"
          value={prominentFeatures}
          onChange={(e) => setProminentFeatures(e.target.value)}
          placeholder="Ví dụ: Gần trường học, Có sân vườn, View sông (cách nhau bởi dấu phẩy)"
        />
        <p className="text-xs text-muted-foreground">
          Nhập các đặc điểm nổi bật, cách nhau bởi dấu phẩy
        </p>
      </div>
    </div>
  );
};
