interface WizardProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const WizardProgressBar = ({ currentStep, totalSteps }: WizardProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full">
      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-foreground transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
