import { Link } from "react-router-dom";
import { Building2, Menu, User, Heart, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
          <div className="p-2 rounded-lg bg-primary">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline">BĐS Marketplace</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <Link to="/listings" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Mua bán
          </Link>
          <Link to="/listings" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Cho thuê
          </Link>
          <Link to="/listings" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Dự án
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <User className="h-5 w-5" />
          </Button>
          <Button className="hidden sm:inline-flex bg-primary hover:bg-primary-hover text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" />
            Đăng tin
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                  Trang chủ
                </Link>
                <Link to="/listings" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                  Mua bán
                </Link>
                <Link to="/listings" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                  Cho thuê
                </Link>
                <Link to="/listings" className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                  Dự án
                </Link>
                <Button className="mt-4 bg-primary hover:bg-primary-hover text-primary-foreground">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Đăng tin
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
