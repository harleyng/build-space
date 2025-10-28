import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminBrokers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Broker Management</h1>
        <p className="text-muted-foreground">Verify and manage broker accounts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Verifications</CardTitle>
          <CardDescription>Brokers awaiting KYC approval</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            List of brokers pending verification will be displayed here
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Brokers</CardTitle>
          <CardDescription>View and manage all broker accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Broker list will be displayed here</p>
        </CardContent>
      </Card>
    </div>
  );
}
