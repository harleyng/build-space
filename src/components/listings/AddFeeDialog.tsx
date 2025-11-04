import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
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
interface AddFeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fee: {
    category: string;
    feeName: string;
    paymentFrequency: string;
    isRequired: string;
    isRefundable?: string;
    feeType: string;
    amount: number;
    maxAmount?: number;
  }) => void;
  category: string | null;
  editingFee?: Fee | null;
}
const categoryNames: Record<string, string> = {
  administrative: "phí hành chính",
  parking: "phí đỗ xe",
  utilities: "phí tiện ích",
  other: "phí"
};
const feeNamesByCategory: Record<string, string[]> = {
  administrative: ["Phí quản lý", "Phí dịch vụ", "Phí bảo trì", "Phí vệ sinh"],
  parking: ["Chỗ đỗ xe trong nhà", "Chỗ đỗ xe ngoài trời", "Chỗ đỗ xe có mái che", "Chỗ đỗ xe cho khách"],
  utilities: ["Điện", "Nước", "Gas", "Internet", "Truyền hình cáp", "Phí rác"],
  other: ["Phí thú cưng", "Phí lưu trữ", "Phí sân thượng", "Phí phòng tập"]
};
const paymentFrequencies = [{
  value: "monthly",
  label: "Hàng tháng"
}, {
  value: "quarterly",
  label: "Hàng quý"
}, {
  value: "yearly",
  label: "Hàng năm"
}, {
  value: "one-time",
  label: "Một lần"
}];
export const AddFeeDialog = ({
  isOpen,
  onClose,
  onSave,
  category,
  editingFee
}: AddFeeDialogProps) => {
  const [feeName, setFeeName] = useState("");
  const [paymentFrequency, setPaymentFrequency] = useState("");
  const [isRequired, setIsRequired] = useState("");
  const [isRefundable, setIsRefundable] = useState("");
  const [feeType, setFeeType] = useState("");
  const [amount, setAmount] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  useEffect(() => {
    if (!isOpen) {
      // Reset form
      setFeeName("");
      setPaymentFrequency("");
      setIsRequired("");
      setIsRefundable("");
      setFeeType("");
      setAmount("");
      setMinAmount("");
      setMaxAmount("");
    } else if (editingFee) {
      // Populate form with editing fee data
      setFeeName(editingFee.feeName);
      setPaymentFrequency(editingFee.paymentFrequency);
      setIsRequired(editingFee.isRequired);
      setIsRefundable(editingFee.isRefundable || "");
      setFeeType(editingFee.feeType);
      if (editingFee.feeType === "range") {
        setMinAmount(editingFee.amount.toString());
        setMaxAmount(editingFee.maxAmount?.toString() || "");
      } else {
        setAmount(editingFee.amount.toString());
      }
    }
  }, [isOpen, editingFee]);
  const handleSave = () => {
    if (!category || !feeName || !paymentFrequency || !isRequired || !feeType) {
      return;
    }

    // Validation for fee range
    if (feeType === "range" && (!minAmount || !maxAmount)) {
      return;
    }

    // Validation for other fee types
    if (feeType !== "range" && !amount) {
      return;
    }
    onSave({
      category,
      feeName,
      paymentFrequency,
      isRequired,
      isRefundable: isRefundable || undefined,
      feeType,
      amount: feeType === "range" ? parseFloat(minAmount) : parseFloat(amount),
      maxAmount: feeType === "range" ? parseFloat(maxAmount) : undefined
    });
  };
  const canSave = feeName && paymentFrequency && isRequired && feeType && (feeType === "range" ? minAmount && maxAmount : amount);
  const dialogTitle = editingFee ? `Chỉnh sửa ${categoryNames[editingFee.category] || "phí"}` : category ? `Thêm ${categoryNames[category] || "phí"}` : "Thêm phí";
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{dialogTitle}</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mb-6">
          Cho người thuê biết loại phí và số tiền, khi nào được tính phí, và liệu nó có được bao gồm trong tiền thuê cơ bản hay không. Những chi tiết này sẽ xuất hiện trên tin đăng của bạn.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="feeName">
              Tên phí <span className="text-red-500">*</span>
            </Label>
            <Select value={feeName} onValueChange={setFeeName}>
              <SelectTrigger id="feeName">
                <SelectValue placeholder="Chọn" />
              </SelectTrigger>
              <SelectContent>
                {category && feeNamesByCategory[category]?.map(name => <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>)}
              </SelectContent>
            </Select>
            
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentFrequency">
              Tần suất thanh toán <span className="text-red-500">*</span>
            </Label>
            <Select value={paymentFrequency} onValueChange={setPaymentFrequency}>
              <SelectTrigger id="paymentFrequency">
                <SelectValue placeholder="Chọn" />
              </SelectTrigger>
              <SelectContent>
                {paymentFrequencies.map(freq => <SelectItem key={freq.value} value={freq.value}>
                    {freq.label}
                  </SelectItem>)}
              </SelectContent>
            </Select>
            
          </div>

          

          <div className="space-y-3">
            <Label>Phí này có được hoàn lại không? (tùy chọn)</Label>
            <RadioGroup value={isRefundable} onValueChange={setIsRefundable}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-refundable" id="non-refundable" />
                <Label htmlFor="non-refundable" className="font-normal cursor-pointer">
                  Không hoàn lại
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="refundable" id="refundable" />
                <Label htmlFor="refundable" className="font-normal cursor-pointer">
                  Hoàn lại
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>
              Đây là phí cố định hay theo một khoảng?{" "}
              <span className="text-red-500">*</span>
            </Label>
            <RadioGroup value={feeType} onValueChange={setFeeType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="flat" id="flat" />
                <Label htmlFor="flat" className="font-normal cursor-pointer">
                  Phí cố định
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="flat-per-item" id="flat-per-item" />
                <Label htmlFor="flat-per-item" className="font-normal cursor-pointer">
                  Phí cố định, mỗi mục
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="range" />
                <Label htmlFor="range" className="font-normal cursor-pointer">
                  Khoảng phí
                </Label>
              </div>
            </RadioGroup>
          </div>

          {feeType === "range" ? <div className="space-y-4">
              <Label>
                Khoảng phí <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minAmount" className="text-sm font-normal">
                    Từ
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
                      ₫
                    </span>
                    <NumberInput id="minAmount" value={minAmount} onChange={setMinAmount} className="pl-7" placeholder="0" allowDecimal={false} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAmount" className="text-sm font-normal">
                    Đến
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
                      ₫
                    </span>
                    <NumberInput id="maxAmount" value={maxAmount} onChange={setMaxAmount} className="pl-7" placeholder="0" allowDecimal={false} />
                  </div>
                </div>
              </div>
            </div> : <div className="space-y-2">
              <Label htmlFor="amount">
                Số tiền phí <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
                  ₫
                </span>
                <NumberInput id="amount" value={amount} onChange={setAmount} className="pl-7" placeholder="0" allowDecimal={false} />
              </div>
            </div>}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button type="button" variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button type="button" onClick={handleSave} disabled={!canSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            Lưu
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
};