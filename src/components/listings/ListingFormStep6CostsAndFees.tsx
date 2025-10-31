import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, ParkingSquare, Lightbulb, DollarSign, Megaphone } from "lucide-react";
import { AddFeeDialog } from "./AddFeeDialog";

const paymentFrequencyLabels: Record<string, string> = {
  monthly: "Hàng tháng",
  quarterly: "Hàng quý",
  yearly: "Hàng năm",
  "one-time": "Một lần",
};

interface Fee {
  id: string;
  category: string;
  feeName: string;
  paymentFrequency: string;
  isRequired: string;
  isRefundable?: string;
  feeType: string;
  amount: number;
  maxAmount?: number;
}

interface ListingFormStep6CostsAndFeesProps {
  fees: Fee[];
  setFees: (fees: Fee[]) => void;
}

export const ListingFormStep6CostsAndFees = ({
  fees,
  setFees,
}: ListingFormStep6CostsAndFeesProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: "administrative", name: "Phí hành chính", icon: Users },
    { id: "parking", name: "Phí đỗ xe", icon: ParkingSquare },
    { id: "utilities", name: "Phí tiện ích", icon: Lightbulb },
    { id: "other", name: "Các danh mục khác", icon: DollarSign },
  ];

  const handleAddFee = (category: string) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleSaveFee = (fee: Omit<Fee, "id">) => {
    const newFee: Fee = {
      ...fee,
      id: Date.now().toString(),
    };
    setFees([...fees, newFee]);
    setIsDialogOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="flex gap-8 max-w-6xl mx-auto">
      <div className="flex-1 max-w-2xl">
        <h1 className="text-3xl font-semibold mb-2">
          Bạn có thu thêm chi phí và phí nào không?
        </h1>
        <p className="text-muted-foreground mb-8">
          Chúng tôi đã làm nổi bật các danh mục phí phổ biến nhất. Những chi tiết này giúp người thuê nhà hiểu rõ chi phí thực tế khi thuê bất động sản của bạn.
        </p>

        <div className="space-y-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:border-foreground transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{category.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-700 hover:bg-transparent underline font-semibold"
                  onClick={() => handleAddFee(category.id)}
                >
                  Thêm
                </Button>
              </div>
            );
          })}
        </div>

        {fees.length > 0 && (
          <div className="mt-6 space-y-2">
            <h3 className="font-semibold">Phí đã thêm:</h3>
            {fees.map((fee) => (
              <div key={fee.id} className="p-3 bg-muted rounded-lg text-sm">
                <div className="font-medium">{fee.feeName}</div>
                <div className="text-muted-foreground">
                  {fee.feeType === "range" && fee.maxAmount ? (
                    <>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(fee.amount)}{" "}
                      -{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(fee.maxAmount)}
                    </>
                  ) : (
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(fee.amount)
                  )}{" "}
                  - {paymentFrequencyLabels[fee.paymentFrequency] || fee.paymentFrequency}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-80 shrink-0">
        <div className="sticky top-24 p-6 border rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="w-5 h-5" />
            <h3 className="font-semibold">Mẹo thêm chi phí và phí</h3>
          </div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              Chờ đến khi có phí đăng ký — chúng tôi sẽ hỏi về những khoản đó sau.
            </li>
            <li>
              Chỉ thêm các khoản phí bạn cần và ghi chú những khoản phí đã bao gồm trong tiền thuê cơ bản.
            </li>
            <li>
              Một số khu vực yêu cầu tiết lộ các khoản phí nhất định — hãy đảm bảo kiểm tra những gì được yêu cầu ở khu vực của bạn.
            </li>
          </ul>
        </div>
      </div>

      <AddFeeDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedCategory(null);
        }}
        onSave={handleSaveFee}
        category={selectedCategory}
      />
    </div>
  );
};
