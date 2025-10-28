import { Link, useNavigate } from "react-router-dom";
import { Building2, Menu, User, Heart, PlusCircle, LogOut, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/listings" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Nhà đất bán
          </Link>
          <Link to="/listings" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Nhà đất cho thuê
          </Link>
          <Link to="/listings" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Dự án
          </Link>
          <Link to="/listings" className="text-sm font-medium text-foreground hover:text-primary transition-colors border-b-2 border-primary pb-5">
            Danh bạ
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link to="#" className="hidden lg:inline-flex text-sm font-medium text-foreground hover:text-primary transition-colors">
                Tải ứng dụng
              </Link>
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-xs">
                  2
                </Badge>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden sm:inline-flex gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                      U
                    </div>
                    <span className="text-sm font-medium">{session.user.email?.split('@')[0] || 'user'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isBroker && (
                    <DropdownMenuItem onClick={() => navigate("/portal/dashboard")}>
                      <Building2 className="mr-2 h-4 w-4" />
                      Broker Portal
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
            <>
              <Link to="#" className="hidden lg:inline-flex text-sm font-medium text-foreground hover:text-primary transition-colors">
                Tải ứng dụng
              </Link>
              <Button 
                onClick={() => navigate("/auth")}
                className="hidden sm:inline-flex bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                <User className="mr-2 h-4 w-4" />
                Đăng nhập
              </Button>
            </>
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
