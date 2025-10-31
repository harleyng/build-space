import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ListingFormStep4AmenitiesProps {
  amenities: string[];
  setAmenities: (value: string[]) => void;
}

// Define amenity groups
const AMENITY_GROUPS = {
  furniture: {
    title: "Nội thất",
    required: true,
    type: "radio" as const,
    options: [
      { value: "full_furnished", label: "Đầy đủ nội thất" },
      { value: "basic_furnished", label: "Nội thất cơ bản" },
      { value: "unfurnished", label: "Không có nội thất" },
    ],
  },
  cooling: {
    title: "Làm mát",
    type: "checkbox" as const,
    options: [
      { value: "air_conditioning", label: "Điều hòa" },
      { value: "ceiling_fan", label: "Quạt trần" },
      { value: "standing_fan", label: "Quạt đứng" },
    ],
  },
  heating: {
    title: "Sưởi ấm",
    type: "checkbox" as const,
    options: [
      { value: "heater", label: "Máy sưởi" },
      { value: "water_heater", label: "Bình nóng lạnh" },
    ],
  },
  appliances: {
    title: "Thiết bị điện",
    type: "checkbox" as const,
    options: [
      { value: "washing_machine", label: "Máy giặt" },
      { value: "refrigerator", label: "Tủ lạnh" },
      { value: "microwave", label: "Lò vi sóng" },
      { value: "tv", label: "TV" },
      { value: "kitchen", label: "Bếp nấu" },
    ],
  },
  security: {
    title: "An ninh",
    type: "checkbox" as const,
    options: [
      { value: "security_guard", label: "Bảo vệ 24/7" },
      { value: "cctv", label: "Camera an ninh" },
      { value: "fingerprint_lock", label: "Khóa vân tay" },
    ],
  },
  facilities: {
    title: "Tiện ích khác",
    type: "checkbox" as const,
    options: [
      { value: "elevator", label: "Thang máy" },
      { value: "parking", label: "Chỗ đậu xe" },
      { value: "balcony", label: "Ban công" },
      { value: "gym", label: "Phòng gym" },
      { value: "swimming_pool", label: "Hồ bơi" },
      { value: "garden", label: "Sân vườn" },
    ],
  },
};

export const ListingFormStep4Amenities = ({
  amenities,
  setAmenities,
}: ListingFormStep4AmenitiesProps) => {
  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setAmenities([...amenities, value]);
    } else {
      setAmenities(amenities.filter((a) => a !== value));
    }
  };

  const handleRadioChange = (groupKey: string, value: string) => {
    // Remove all options from this radio group first
    const groupOptions = AMENITY_GROUPS[groupKey as keyof typeof AMENITY_GROUPS].options.map(
      (opt) => opt.value
    );
    const filtered = amenities.filter((a) => !groupOptions.includes(a));
    setAmenities([...filtered, value]);
  };

  const getRadioValue = (groupKey: string) => {
    const groupOptions = AMENITY_GROUPS[groupKey as keyof typeof AMENITY_GROUPS].options.map(
      (opt) => opt.value
    );
    return amenities.find((a) => groupOptions.includes(a)) || "";
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold mb-2">
          Cho khách biết chỗ ở của bạn có những gì
        </h2>
        <p className="text-muted-foreground text-lg">
          Chia sẻ nhiều hơn sẽ giúp người thuê hình dung rõ hơn về nơi ở của bạn.
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(AMENITY_GROUPS).map(([groupKey, group]) => (
          <div key={groupKey} className="space-y-4 border-b pb-6 last:border-b-0">
            <Label className="text-base font-semibold">
              {group.title}
              {'required' in group && group.required && <span className="text-destructive ml-1">*</span>}
            </Label>

            {group.type === "radio" ? (
              <RadioGroup
                value={getRadioValue(groupKey)}
                onValueChange={(value) => handleRadioChange(groupKey, value)}
              >
                <div className="space-y-3">
                  {group.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label
                        htmlFor={option.value}
                        className="text-base font-normal cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3">
                    <Checkbox
                      id={option.value}
                      checked={amenities.includes(option.value)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(option.value, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={option.value}
                      className="text-base font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
