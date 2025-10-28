import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PortalOrganization() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Organization</h1>
        <p className="text-muted-foreground">Manage your organization settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>View and update organization information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Organization details will be displayed here</p>
          <Button className="mt-4" variant="outline">
            Edit Organization
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your organization's brokers</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Team member list will be displayed here</p>
        </CardContent>
      </Card>
    </div>
  );
}
