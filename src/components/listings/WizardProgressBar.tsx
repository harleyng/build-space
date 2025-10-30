import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  { number: 1, label: "Loại hình" },
  { number: 2, label: "Vị trí" },
  { number: 3, label: "Giá & Thông số" },
  { number: 4, label: "Thuộc tính" },
  { number: 5, label: "Hình ảnh & Mô tả" },
  { number: 6, label: "Liên hệ & Gửi" },
];

export const WizardProgressBar = ({ currentStep, totalSteps }: WizardProgressBarProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                  currentStep > step.number
                    ? "bg-primary border-primary text-primary-foreground"
                    : currentStep === step.number
                    ? "border-primary text-primary bg-background"
                    : "border-muted-foreground/30 text-muted-foreground bg-background"
                )}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.number}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs mt-2 text-center hidden sm:block",
                  currentStep >= step.number ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 transition-all",
                  currentStep > step.number ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Bước {currentStep} / {totalSteps}
        </p>
      </div>
    </div>
  );
};
