import { Button } from "@/components/ui/button";
import { HelpCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const WizardHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/broker/properties")}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Bạn có thắc mắc?</span>
          </Button>
          <Button variant="outline" onClick={() => navigate("/broker/properties")}>
            Lưu và thoát
          </Button>
        </div>
      </div>
    </header>
  );
};
