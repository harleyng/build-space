import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PortalProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your personal profile and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Profile form will be displayed here</p>
          <Button className="mt-4" variant="outline">
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>KYC Status</CardTitle>
          <CardDescription>Your verification status</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">KYC status and documents will be displayed here</p>
        </CardContent>
      </Card>
    </div>
  );
}
