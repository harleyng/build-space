import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, ParkingSquare, Lightbulb, DollarSign, MoreVertical } from "lucide-react";
import { AddFeeDialog } from "./AddFeeDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [editingFee, setEditingFee] = useState<Fee | null>(null);
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
    if (editingFee) {
      // Update existing fee
      setFees(fees.map(f => f.id === editingFee.id ? { ...fee, id: editingFee.id } : f));
    } else {
      // Add new fee
      const newFee: Fee = {
        ...fee,
        id: Date.now().toString()
      };
      setFees([...fees, newFee]);
    }
    setIsDialogOpen(false);
    setSelectedCategory(null);
    setEditingFee(null);
  };

  const handleEditFee = (fee: Fee) => {
    setEditingFee(fee);
    setSelectedCategory(fee.category);
    setIsDialogOpen(true);
  };

  const handleDeleteFee = (feeId: string) => {
    setFees(fees.filter(f => f.id !== feeId));
  };

  const getCategoryFees = (categoryId: string) => {
    return fees.filter(f => f.category === categoryId);
  };
  return <div className="max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Bạn có thu thêm chi phí nào không?</h1>
        <p className="text-muted-foreground mb-8">Chúng tôi đã làm nổi bật các loại phí phổ biến nhất. </p>

        <div className="space-y-4">
          {categories.map(category => {
          const Icon = category.icon;
          const categoryFees = getCategoryFees(category.id);
          return <div key={category.id} className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:border-foreground transition-colors">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <Button type="button" variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-transparent underline font-semibold" onClick={() => handleAddFee(category.id)}>
                    Thêm
                  </Button>
                </div>

                {categoryFees.length > 0 && <div className="ml-4 space-y-2">
                    {categoryFees.map(fee => <div key={fee.id} className="flex items-start justify-between p-4 bg-background border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium mb-1">{fee.feeName}</div>
                          <div className="text-sm text-muted-foreground space-y-0.5">
                            <div>
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
                }).format(fee.amount)}
                            </div>
                            <div>{paymentFrequencyLabels[fee.paymentFrequency] || fee.paymentFrequency}</div>
                            {fee.isRequired === "included" && <div className="text-xs">Bao gồm trong tiền thuê</div>}
                            {fee.isRequired === "required" && <div className="text-xs">Bắt buộc</div>}
                            {fee.isRequired === "optional" && <div className="text-xs">Tùy chọn</div>}
                            {fee.isRefundable === "refundable" && <div className="text-xs">Có hoàn lại</div>}
                            {fee.isRefundable === "non-refundable" && <div className="text-xs">Không hoàn lại</div>}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditFee(fee)}>
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteFee(fee.id)} className="text-destructive">
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>)}
                  </div>}
              </div>;
        })}
        </div>
      </div>

      <AddFeeDialog isOpen={isDialogOpen} onClose={() => {
      setIsDialogOpen(false);
      setSelectedCategory(null);
      setEditingFee(null);
    }} onSave={handleSaveFee} category={selectedCategory} editingFee={editingFee} />
    </div>;
};