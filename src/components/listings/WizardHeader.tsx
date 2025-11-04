import { Button } from "@/components/ui/button";
import { HelpCircle, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WizardProgressBar } from "./WizardProgressBar";

interface WizardHeaderProps {
  currentMajorStep: number;
  currentSubStep: number;
  onSaveAndExit?: () => void;
  isSaving?: boolean;
  onStepClick?: (majorStep: number) => void;
}

export const WizardHeader = ({ 
  currentMajorStep, 
  currentSubStep, 
  onSaveAndExit, 
  isSaving,
  onStepClick 
}: WizardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/broker/properties")}
              className="rounded-full shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 max-w-2xl">
              <WizardProgressBar 
                currentMajorStep={currentMajorStep} 
                currentSubStep={currentSubStep}
                onStepClick={onStepClick}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Floating help button */}
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-6 left-6 z-50 h-12 w-12 rounded-full shadow-lg"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>
    </>
  );
};
