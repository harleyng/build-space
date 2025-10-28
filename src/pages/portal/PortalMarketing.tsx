import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function PortalMarketing() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Marketing</h1>
          <p className="text-muted-foreground">Create and manage marketing campaigns</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Campaigns</CardTitle>
          <CardDescription>Track your marketing campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Campaign list will be displayed here</p>
        </CardContent>
      </Card>
    </div>
  );
}
