import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, ParkingSquare, Lightbulb, DollarSign } from "lucide-react";
import { AddFeeDialog } from "./AddFeeDialog";
const paymentFrequencyLabels: Record<string, string> = {
  monthly: "Hàng tháng",
  quarterly: "Hàng quý",
  yearly: "Hàng năm",
  "one-time": "Một lần"
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
  setFees
}: ListingFormStep6CostsAndFeesProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = [{
    id: "administrative",
    name: "Phí hành chính",
    icon: Users
  }, {
    id: "parking",
    name: "Phí đỗ xe",
    icon: ParkingSquare
  }, {
    id: "utilities",
    name: "Phí tiện ích",
    icon: Lightbulb
  }, {
    id: "other",
    name: "Các danh mục khác",
    icon: DollarSign
  }];
  const handleAddFee = (category: string) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };
  const handleSaveFee = (fee: Omit<Fee, "id">) => {
    const newFee: Fee = {
      ...fee,
      id: Date.now().toString()
    };
    setFees([...fees, newFee]);
    setIsDialogOpen(false);
    setSelectedCategory(null);
  };
  return <div className="max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Bạn có thu thêm chi phí nào không?</h1>
        <p className="text-muted-foreground mb-8">Chúng tôi đã làm nổi bật các loại phí phổ biến nhất. </p>

        <div className="space-y-4">
          {categories.map(category => {
          const Icon = category.icon;
          return <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-foreground transition-colors">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{category.name}</span>
                </div>
                <Button type="button" variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-transparent underline font-semibold" onClick={() => handleAddFee(category.id)}>
                  Thêm
                </Button>
              </div>;
        })}
        </div>

        {fees.length > 0 && <div className="mt-6 space-y-2">
            <h3 className="font-semibold">Phí đã thêm:</h3>
            {fees.map(fee => <div key={fee.id} className="p-3 bg-muted rounded-lg text-sm">
                <div className="font-medium">{fee.feeName}</div>
                <div className="text-muted-foreground">
                  {fee.feeType === "range" && fee.maxAmount ? <>
                      {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND"
              }).format(fee.amount)}{" "}
                      -{" "}
                      {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND"
              }).format(fee.maxAmount)}
                    </> : new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND"
            }).format(fee.amount)}{" "}
                  - {paymentFrequencyLabels[fee.paymentFrequency] || fee.paymentFrequency}
                </div>
              </div>)}
          </div>}
      </div>

      <AddFeeDialog isOpen={isDialogOpen} onClose={() => {
      setIsDialogOpen(false);
      setSelectedCategory(null);
    }} onSave={handleSaveFee} category={selectedCategory} />
    </div>;
};