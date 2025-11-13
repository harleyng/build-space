import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Building2,
  Menu,
  User,
  Heart,
  PlusCircle,
  LogOut,
  Bell,
  ChevronDown,
  Home,
  Building,
  Users,
  Megaphone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  const location = useLocation();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkUserRoles(session.user.id);
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        checkUserRoles(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  const checkUserRoles = async (userId: string) => {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    if (data) {
      const roles = data.map((r) => r.role as string);
      setIsAdmin(roles.includes("ADMIN"));
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
  const isActive = (path: string) => location.pathname === path;
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
            <div className="p-2 rounded-lg bg-primary">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/listings?type=ban"
              className={`text-sm font-medium text-foreground hover:text-primary transition-colors h-16 flex items-center ${isActive("/listings") && location.search.includes("ban") ? "border-b-2 border-primary" : ""}`}
            >
              Nhà đất bán
            </Link>
            <Link
              to="/listings?type=thue"
              className={`text-sm font-medium text-foreground hover:text-primary transition-colors h-16 flex items-center ${isActive("/listings") && location.search.includes("thue") ? "border-b-2 border-primary" : ""}`}
            >
              Nhà đất cho thuê
            </Link>
            <Link
              to="/listings?type=duan"
              className={`text-sm font-medium text-foreground hover:text-primary transition-colors h-16 flex items-center ${isActive("/listings") && location.search.includes("duan") ? "border-b-2 border-primary" : ""}`}
            >
              Dự án
            </Link>
            <Link
              to="/directory"
              className={`text-sm font-medium text-foreground hover:text-primary transition-colors h-16 flex items-center ${isActive("/directory") ? "border-b-2 border-primary" : ""}`}
            >
              Danh bạ
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <>
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
                    <span className="text-sm font-medium">{session.user.email?.split("@")[0] || "user"}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {!isAdmin ? (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/broker/dashboard")}>
                        <Home className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/broker/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        Hồ sơ cá nhân
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/broker/properties")}>
                        <Building className="mr-2 h-4 w-4" />
                        Quản lý tin đăng
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/broker/customers")}>
                        <Users className="mr-2 h-4 w-4" />
                        Quản lý khách hàng
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/broker/marketing")}>
                        <Megaphone className="mr-2 h-4 w-4" />
                        Marketing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/broker/organization")}>
                        <Building2 className="mr-2 h-4 w-4" />
                        Tổ chức
                      </DropdownMenuItem>
                    </>
                  ) : null}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={() => navigate("/broker/properties/new")}
                className="hidden sm:inline-flex bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Đăng tin
              </Button>
            </>
          ) : (
            <>
              <Link
                to="#"
                className="hidden lg:inline-flex text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
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
            <SheetContent className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-2 mt-8">
                {/* Marketplace Links */}
                <div className="pb-4 border-b">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">marketplace</h3>
                  <Link
                    to="/"
                    className="flex items-center gap-3 px-3 py-2.5 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                  >
                    <Home className="h-5 w-5" />
                    Trang chủ
                  </Link>
                  <Link
                    to="/listings?type=ban"
                    className="flex items-center gap-3 px-3 py-2.5 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                  >
                    <Building className="h-5 w-5" />
                    Nhà đất bán
                  </Link>
                  <Link
                    to="/listings?type=thue"
                    className="flex items-center gap-3 px-3 py-2.5 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                  >
                    <Building className="h-5 w-5" />
                    Nhà đất cho thuê
                  </Link>
                  <Link
                    to="/listings?type=duan"
                    className="flex items-center gap-3 px-3 py-2.5 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                  >
                    <Building2 className="h-5 w-5" />
                    Dự án
                  </Link>
                  <Link
                    to="/directory"
                    className="flex items-center gap-3 px-3 py-2.5 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                  >
                    <Users className="h-5 w-5" />
                    Danh bạ
                  </Link>
                </div>

                {session ? (
                  <>
                    {/* Broker Portal Links */}
                    {!isAdmin && (
                      <div className="py-4 border-b">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">​Broker Portal</h3>
                        <Link
                          to="/broker/properties/new"
                          className="flex items-center gap-3 px-3 py-2.5 text-base font-medium bg-primary text-primary-foreground hover:bg-primary-hover rounded-lg transition-colors mt-3"
                        >
                          <PlusCircle className="h-5 w-5" />
                          Đăng tin
                        </Link>
                        <Link
                          to="/broker/dashboard"
                          className="flex items-center gap-3 px-3 py-2.5 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                        >
                          <Home className="h-5 w-5" />
                          Dashboard
                        </Link>
                        <Link
                          to="/broker/profile"
                          className="flex items-center gap-3 px-3 py-2.5 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                        >
                          <User className="h-5 w-5" />
                          Hồ sơ cá nhân
                        </Link>
                        <Link
                          to="/broker/properties"
                          className="flex items-center gap-3 px-3 py-2.5 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                        >
                          <Building className="h-5 w-5" />
                          Quản lý tin đăng
                        </Link>
                        <Link
                          to="/broker/customers"
                          className="flex items-center gap-3 px-3 py-2.5 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                        >
                          <Users className="h-5 w-5" />
                          Quản lý khách hàng
                        </Link>
                        <Link
                          to="/broker/marketing"
                          className="flex items-center gap-3 px-3 py-2.5 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                        >
                          <Megaphone className="h-5 w-5" />
                          Marketing
                        </Link>
                        <Link
                          to="/broker/organization"
                          className="flex items-center gap-3 px-3 py-2.5 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                        >
                          <Building2 className="h-5 w-5" />
                          Tổ chức
                        </Link>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-4 space-y-2">
                      <Button onClick={handleLogout} variant="outline" className="w-full justify-start">
                        <LogOut className="mr-2 h-5 w-5" />
                        Đăng xuất
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Guest Actions */}
                    <div className="pt-4 space-y-2">
                      <Button
                        onClick={() => navigate("/auth")}
                        className="w-full bg-primary hover:bg-primary-hover text-primary-foreground justify-start"
                      >
                        <User className="mr-2 h-5 w-5" />
                        Đăng nhập
                      </Button>
                      <Link
                        to="#"
                        className="flex items-center justify-center gap-2 text-sm font-medium text-foreground hover:text-primary py-2"
                      >
                        Tải ứng dụng
                      </Link>
                    </div>
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
