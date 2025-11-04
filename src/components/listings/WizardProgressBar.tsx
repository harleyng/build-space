import { WIZARD_STRUCTURE } from "@/constants/wizard.constants";

interface WizardProgressBarProps {
  currentMajorStep: number;
  currentSubStep: number;
  onStepClick?: (majorStep: number) => void;
}

export const WizardProgressBar = ({ currentMajorStep, currentSubStep, onStepClick }: WizardProgressBarProps) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex gap-2">
        {WIZARD_STRUCTURE.map((step) => {
          const isCompleted = step.id < currentMajorStep;
          const isCurrent = step.id === currentMajorStep;
          const isClickable = isCompleted || isCurrent;

          return (
            <div
              key={step.id}
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ease-out ${
                isClickable ? "cursor-pointer hover:opacity-80" : ""
              }`}
              style={{
                backgroundColor: isCompleted || isCurrent ? "hsl(var(--primary))" : "hsl(var(--muted))",
                opacity: isCompleted || isCurrent ? 1 : 0.3,
              }}
              onClick={() => isClickable && onStepClick?.(step.id)}
            />
          );
        })}
      </div>

      <div className="flex">
        {WIZARD_STRUCTURE.map((step) => {
          const isCurrent = step.id === currentMajorStep;

          return (
            <div key={step.id} className="flex-1 text-center">
              <span
                className={`text-xs transition-colors ${
                  isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
