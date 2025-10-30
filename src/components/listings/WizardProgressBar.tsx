interface WizardProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const WizardProgressBar = ({ currentStep, totalSteps }: WizardProgressBarProps) => {
  return (
    <div className="flex gap-2 w-full">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        
        return (
          <div
            key={stepNumber}
            className="flex-1 h-1 rounded-full transition-all duration-300 ease-out"
            style={{
              backgroundColor: isCompleted || isCurrent ? "currentColor" : "rgba(var(--muted-foreground-rgb, 156 163 175) / 0.3)",
              opacity: isCompleted || isCurrent ? 1 : 0.3,
            }}
          />
        );
      })}
    </div>
  );
};
