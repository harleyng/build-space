import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ListingFormContactProps {
  contactName: string;
  setContactName: (value: string) => void;
  contactPhone: string;
  setContactPhone: (value: string) => void;
  contactEmail: string;
  setContactEmail: (value: string) => void;
}

export const ListingFormContact = ({
  contactName,
  setContactName,
  contactPhone,
  setContactPhone,
  contactEmail,
  setContactEmail,
}: ListingFormContactProps) => {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Thông tin liên hệ</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactName">Tên liên hệ <span className="text-destructive">*</span></Label>
          <Input
            id="contactName"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone">Số điện thoại <span className="text-destructive">*</span></Label>
          <Input
            id="contactPhone"
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            required
            maxLength={15}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactEmail">Email liên hệ <span className="text-destructive">*</span></Label>
        <Input
          id="contactEmail"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          required
          maxLength={255}
        />
      </div>
    </div>
  );
};
