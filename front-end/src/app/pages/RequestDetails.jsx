import { useParams, useNavigate } from "react-router";
import { PageHeader } from "../components/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { CheckCircle, Clock, XCircle, Package, Truck, ArrowLeft } from "lucide-react";
const timelineSteps = [
  {
    status: "completed",
    title: "Request Submitted",
    description: "Request created and submitted for review",
    date: "2026-05-01",
    time: "09:30",
    user: "Cpt. John Mitchell"
  },
  {
    status: "completed",
    title: "Under Review",
    description: "Request being reviewed by warehouse manager",
    date: "2026-05-01",
    time: "14:15",
    user: "Warehouse Supervisor"
  },
  {
    status: "completed",
    title: "Approved",
    description: "Request approved - preparing for delivery",
    date: "2026-05-02",
    time: "10:00",
    user: "Admin User",
    notes: "Approved. Items available in Warehouse A."
  },
  {
    status: "current",
    title: "Preparing Shipment",
    description: "Items being prepared and packaged",
    date: "2026-05-03",
    time: "08:00",
    user: "Warehouse Staff"
  },
  {
    status: "pending",
    title: "In Transit",
    description: "Shipment en route to destination",
    date: "Pending",
    time: "",
    user: ""
  },
  {
    status: "pending",
    title: "Delivered",
    description: "Items delivered and received",
    date: "Pending",
    time: "",
    user: ""
  }
];
const requestedItems = [
  { id: "INV-001", name: "Rice", quantity: 500, kitchen: "boxes", available: 2500 },
  { id: "INV-003", name: "Water Bottles", quantity: 200, kitchen: "kitchens", available: 1e3 }
];
const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith("/admin");
  return <div className="p-6 lg:p-8 space-y-6">
      <div className="mb-2">
        <button
    onClick={() => navigate(isAdmin ? "/admin/requests" : "/user/requests")}
    className="flex items-center gap-2 text-[#5A6B50] hover:text-[#2E3A24] transition-colors text-sm"
  >
          <ArrowLeft className="w-4 h-4" />
          Back to Requests
        </button>
      </div>

      <PageHeader
    title={`Request ${id || "REQ-1230"}`}
    subtitle="Track and manage supply request details"
  />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Request Status</CardTitle>
                <Badge variant="info">In Progress</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {timelineSteps.map((step, index) => <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
    className={`p-3 rounded-full ${step.status === "completed" ? "bg-[#6A7B4D] text-white" : step.status === "current" ? "bg-[#4B5B3A] text-white" : "bg-[#E0E1B7] text-muted-foreground"}`}
  >
                        {step.status === "completed" ? <CheckCircle className="w-5 h-5" /> : step.status === "current" ? <Clock className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      {index !== timelineSteps.length - 1 && <div
    className={`w-0.5 h-16 mt-2 ${step.status === "completed" ? "bg-[#6A7B4D]" : "bg-border"}`}
  />}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-foreground">{step.title}</h4>
                        {step.date !== "Pending" && <div className="text-right">
                            <p className="text-sm text-foreground">{step.date}</p>
                            <p className="text-xs text-muted-foreground">{step.time}</p>
                          </div>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                      {step.user && <p className="text-xs text-muted-foreground">By: {step.user}</p>}
                      {step.notes && <div className="mt-3 p-3 bg-[#6A7B4D] bg-opacity-10 rounded-lg">
                          <p className="text-sm text-foreground">{step.notes}</p>
                        </div>}
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requested Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requestedItems.map((item) => <div
    key={item.id}
    className="p-4 bg-background rounded-xl border border-border"
  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.id}</p>
                      </div>
                      <Badge variant="success">Available</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                      <div>
                        <p className="text-muted-foreground">Requested</p>
                        <p className="font-medium text-foreground">
                          {item.quantity} {item.kitchen}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Available in Stock</p>
                        <p className="font-medium text-foreground">
                          {item.available} {item.kitchen}
                        </p>
                      </div>
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Request ID</p>
                  <p className="font-semibold text-foreground">{id || "REQ-1230"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Requesting Kitchen</p>
                  <p className="font-semibold text-foreground">Central Kitchen</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Requested By</p>
                  <p className="font-semibold text-foreground">Cpt. John Mitchell</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Priority</p>
                  <Badge variant="warning">High</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Delivery Location</p>
                  <p className="font-semibold text-foreground">Central Kitchen - Building 5</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Requested Delivery</p>
                  <p className="font-semibold text-foreground">2026-05-05</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Justification</p>
                  <p className="text-sm text-foreground">Kitchen Requirement</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">
                Pantry needed for upcoming weekly meal preparation cycle scheduled for next week.
                Priority delivery requested.
              </p>
            </CardContent>
          </Card>

          {isAdmin && <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full">
                    <CheckCircle className="w-4 h-4" />
                    Approve Request
                  </Button>
                  <Button variant="danger" className="w-full">
                    <XCircle className="w-4 h-4" />
                    Reject Request
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Package className="w-4 h-4" />
                    Partial Approval
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Truck className="w-4 h-4" />
                    Mark as Delivered
                  </Button>
                </div>
              </CardContent>
            </Card>}
        </div>
      </div>
    </div>;
};
export {
  RequestDetails
};
