import { useParams, useNavigate } from 'react-router';
import { PageHeader } from '../components/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Package, MapPin, Calendar, TrendingDown, Edit, Trash2, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft } from 'lucide-react';

const usageHistory = [
  { month: 'Dec', consumed: 120 },
  { month: 'Jan', consumed: 150 },
  { month: 'Feb', consumed: 110 },
  { month: 'Mar', consumed: 180 },
  { month: 'Apr', consumed: 140 },
  { month: 'May', consumed: 160 },
];

const movementTimeline = [
  {
    date: '2026-05-01',
    action: 'Stock Added',
    quantity: '+500 boxes',
    user: 'Admin User',
    warehouse: 'Warehouse A',
  },
  {
    date: '2026-04-25',
    action: 'Stock Removed',
    quantity: '-200 boxes',
    user: 'Request REQ-1230',
    warehouse: 'Warehouse A',
  },
  {
    date: '2026-04-15',
    action: 'Transfer',
    quantity: '300 boxes',
    user: 'Warehouse Supervisor',
    warehouse: 'Warehouse A â†’ Warehouse B',
  },
  {
    date: '2026-04-01',
    action: 'Stock Added',
    quantity: '+1000 boxes',
    user: 'Admin User',
    warehouse: 'Warehouse A',
  },
];

const relatedRequests = [
  { id: 'REQ-1234', kitchen: 'Central Kitchen', quantity: 500, status: 'pending', date: '2026-05-02' },
  { id: 'REQ-1230', kitchen: 'Bravo Kitchen', quantity: 200, status: 'delivered', date: '2026-04-25' },
  { id: 'REQ-1225', kitchen: 'Produce Team', quantity: 150, status: 'delivered', date: '2026-04-15' },
];

export const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="mb-2">
        <button
          onClick={() => navigate('/admin/inventory')}
          className="flex items-center gap-2 text-[#5A6B50] hover:text-[#2E3A24] transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Inventory
        </button>
      </div>

      <PageHeader
        title="Rice"
        subtitle={`Item ID: ${id || 'INV-001'}`}
        action={{
          label: 'Edit Item',
          onClick: () => navigate(`/admin/inventory/${id}/edit`),
          icon: Edit,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary bg-opacity-10 rounded-xl">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Current Stock</p>
              <p className="text-3xl font-bold text-foreground">2,500</p>
              <p className="text-sm text-muted-foreground mt-1">boxes</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#6A7B4D] bg-opacity-10 rounded-xl">
              <MapPin className="w-8 h-8 text-[#6A7B4D]" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Warehouse</p>
              <p className="text-2xl font-bold text-foreground">Warehouse A</p>
              <p className="text-sm text-muted-foreground mt-1">Section B-12</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#6A7B4D] bg-opacity-10 rounded-xl">
              <Calendar className="w-8 h-8 text-[#6A7B4D]" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Expiration</p>
              <p className="text-2xl font-bold text-foreground">2027-12-31</p>
              <Badge variant="success" className="mt-2">548 days</Badge>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Item Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <p className="text-foreground font-medium">Food Pantry</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Kitchen Type</p>
                  <p className="text-foreground font-medium">Boxes</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Supplier</p>
                  <p className="text-foreground font-medium">MilSupply Corp</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge variant="success">In Stock</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Last Restocked</p>
                  <p className="text-foreground font-medium">2026-05-01</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Low Stock Threshold</p>
                  <p className="text-foreground font-medium">500 boxes</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-foreground">
                  Standard food pantry package for warehouse meal planning. Contains balanced
                  nutrition for field operations. Shelf-stable for extended periods.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage History (6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={usageHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4E4631" opacity={0.1} />
                  <XAxis dataKey="month" stroke="#4E4631" />
                  <YAxis stroke="#4E4631" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #4E4631',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="consumed"
                    stroke="#4B5B3A"
                    strokeWidth={3}
                    name="Consumed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stock Movement Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {movementTimeline.map((movement, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-border last:border-0">
                    <div className="flex flex-col items-center">
                      <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      {index !== movementTimeline.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-semibold text-foreground">{movement.action}</p>
                        <p className="text-sm text-muted-foreground">{movement.date}</p>
                      </div>
                      <p className="text-sm text-foreground mb-1">
                        Quantity: <span className="font-medium">{movement.quantity}</span>
                      </p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>By: {movement.user}</span>
                        <span>Location: {movement.warehouse}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" onClick={() => navigate(`/admin/inventory/${id}/edit`)}>
                  <Edit className="w-4 h-4" />
                  Edit Item
                </Button>
                <Button variant="outline" className="w-full">
                  <Package className="w-4 h-4" />
                  Adjust Stock
                </Button>
                <Button variant="outline" className="w-full">
                  <MapPin className="w-4 h-4" />
                  Transfer Location
                </Button>
                <Button variant="danger" className="w-full">
                  <Trash2 className="w-4 h-4" />
                  Delete Item
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {relatedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-3 bg-background rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/requests/${request.id}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-sm text-foreground">{request.id}</p>
                      <Badge
                        variant={
                          request.status === 'pending'
                            ? 'pending'
                            : request.status === 'delivered'
                            ? 'success'
                            : 'info'
                        }
                        className="text-xs"
                      >
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{request.kitchen}</p>
                    <p className="text-xs text-foreground mt-1">Qty: {request.quantity} boxes</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
