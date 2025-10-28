import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminBrokers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Broker Management</h1>
        <p className="text-muted-foreground">Verify and manage broker accounts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Pending Verifications
            <Badge variant="secondary">Coming Soon</Badge>
          </CardTitle>
          <CardDescription>Brokers awaiting KYC approval</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Feature coming soon - Broker verification workflow
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            All Brokers
            <Badge variant="secondary">Coming Soon</Badge>
          </CardTitle>
          <CardDescription>View and manage all broker accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Feature coming soon - Complete broker management interface
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
