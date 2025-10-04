import { Building2, Home, LandPlot, Warehouse, TreePine, Store } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    icon: Building2,
    name: "Căn hộ chung cư",
    count: "12,450",
    color: "text-primary",
  },
  {
    icon: Home,
    name: "Nhà riêng",
    count: "8,320",
    color: "text-accent",
  },
  {
    icon: LandPlot,
    name: "Đất nền",
    count: "5,680",
    color: "text-success",
  },
  {
    icon: Store,
    name: "Shophouse",
    count: "3,240",
    color: "text-warning",
  },
  {
    icon: TreePine,
    name: "Biệt thự",
    count: "2,150",
    color: "text-destructive",
  },
  {
    icon: Warehouse,
    name: "Kho, nhà xưởng",
    count: "1,890",
    color: "text-primary",
  },
];

export const CategoryGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Card
            key={category.name}
            className="group cursor-pointer border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <CardContent className="p-6 text-center">
              <div className="mb-3 flex justify-center">
                <div className="p-4 rounded-full bg-secondary group-hover:bg-primary/10 transition-colors">
                  <Icon className={`h-8 w-8 ${category.color} group-hover:scale-110 transition-transform`} />
                </div>
              </div>
              <h3 className="font-semibold text-sm mb-1 text-foreground">
                {category.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {category.count} tin
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
