import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  canProceed: boolean;
  isLoading?: boolean;
  isUploading?: boolean;
}

export const WizardNavigation = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  canProceed,
  isLoading,
  isUploading,
}: WizardNavigationProps) => {
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <div className="flex justify-between items-center pt-6 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={isFirstStep || isLoading || isUploading}
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </Button>

      {isLastStep ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!canProceed || isLoading || isUploading}
          className="gap-2"
        >
          {(isLoading || isUploading) && <Loader2 className="w-4 h-4 animate-spin" />}
          {isUploading ? "Đang tải ảnh..." : "Gửi tin đăng"}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="gap-2"
        >
          Tiếp tục
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
