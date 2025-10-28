import { Link, useNavigate } from "react-router-dom";
import { Building2, Menu, User, Heart, PlusCircle, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";

export const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBroker, setIsBroker] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkUserRoles(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        checkUserRoles(session.user.id);
      } else {
        setIsAdmin(false);
        setIsBroker(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRoles = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    
    if (data) {
      const roles = data.map(r => r.role as string);
      setIsAdmin(roles.includes("ADMIN"));
      setIsBroker(roles.includes("BROKER") || roles.includes("ORGANIZATION"));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại bạn!",
    });
    navigate("/");
  };

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
          {session ? (
            <>
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                <Heart className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isBroker && (
                    <DropdownMenuItem onClick={() => navigate("/portal/dashboard")}>
                      <Building2 className="mr-2 h-4 w-4" />
                      Broker Portal
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Portal
                    </DropdownMenuItem>
                  )}
                  {!isBroker && !isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/register-agent")}>
                      <User className="mr-2 h-4 w-4" />
                      Đăng ký môi giới
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                onClick={() => navigate("/submit-listing")}
                className="hidden sm:inline-flex bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Đăng tin
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => navigate("/auth")}
              className="hidden sm:inline-flex bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              <User className="mr-2 h-4 w-4" />
              Đăng nhập
            </Button>
          )}

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
                {session && (
                  <>
                    <Link 
                      to="/my-listings" 
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      Tin đăng của tôi
                    </Link>
                    <Button 
                      onClick={() => navigate("/submit-listing")}
                      className="mt-4 bg-primary hover:bg-primary-hover text-primary-foreground"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Đăng tin
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
