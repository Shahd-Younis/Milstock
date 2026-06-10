import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { PageHeader } from "../components/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { ArrowLeft, Calendar, CheckCircle, Clock, Package, Truck, User, XCircle } from "lucide-react";
import { api } from "../lib/api";
import { formatDate } from "../lib/format";
import { getDocumentId, normalizeArray, normalizeRecord, sameId } from "../lib/normalize";

const statusVariants = {
  pending: "pending",
  approved: "success",
  completed: "info",
  cancelled: "danger"
};

const statusLabels = {
  pending: "Pending",
  approved: "Approved",
  completed: "Completed",
  cancelled: "Cancelled"
};

const money = (value) => {
  const number = Number(value || 0);
  return number ? `${number.toLocaleString()} EGP` : "N/A";
};

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const backPath = isAdmin ? "/admin/requests" : "/user/requests";
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const loadRequest = useCallback(async () => {
    if (!id) {
      setOrder(null);
      setItems([]);
      setError("Request id is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const [orderData, orderItems] = await Promise.all([
        api.orders.get(id),
        api.orderItems.list()
      ]);
      const orderItemsArray = normalizeArray(orderItems);
      const relatedItems = orderItemsArray.filter((item) => sameId(item.order_id, id));
      setOrder(orderData || null);
      setItems(relatedItems);
    } catch (requestError) {
      setError(requestError.message || "Failed to load request details.");
      setOrder(null);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  const updateStatus = async (status) => {
    if (!id || !order) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await api.orders.updateStatus(id, status, `Status changed to ${status} from request details`);
      const updatedOrder = normalizeRecord(response);
      setOrder(updatedOrder || { ...order, status });
      setMessage(`Request status updated to ${statusLabels[status] || status}.`);
      await loadRequest();
    } catch (requestError) {
      setError(requestError.message || "Failed to update request status.");
    } finally {
      setSaving(false);
    }
  };

  const requestId = useMemo(() => {
    const rawId = order?._id || id || "";
    return rawId ? rawId.slice(-8).toUpperCase() : "N/A";
  }, [id, order?._id]);

  const notes = order?.notes || order?.note || order?.description || order?.justification || "";
  const requesterName = order?.user_id?.name || "Unknown requester";
  const requesterCode = order?.user_id?.military_number || order?.user_id?.email || "N/A";
  const supplierName = order?.supplier_id?.name || "No supplier";
  const currentStatus = order?.status || "pending";
  const adminUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("milstock_user") || "null");
    } catch {
      return null;
    }
  }, []);
  const canManageRequest = isAdmin && (!adminUser?.role || adminUser.role === "admin");
  const createdDate = formatDate(order?.date || order?.createdAt);
  const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  const timeline = [
    {
      title: "Request Created",
      description: `Created by ${requesterName}`,
      complete: Boolean(order),
      active: currentStatus === "pending",
      icon: Package
    },
    {
      title: "Approved",
      description: "Request approved for preparation",
      complete: ["approved", "completed"].includes(currentStatus),
      active: currentStatus === "approved",
      icon: CheckCircle
    },
    {
      title: currentStatus === "cancelled" ? "Cancelled" : "Delivered",
      description: currentStatus === "cancelled" ? "Request was rejected or cancelled" : "Request marked as delivered",
      complete: ["completed", "cancelled"].includes(currentStatus),
      active: ["completed", "cancelled"].includes(currentStatus),
      icon: currentStatus === "cancelled" ? XCircle : Truck
    }
  ];

  if (loading) {
    return <div className="p-6 lg:p-8 space-y-6">
      <button onClick={() => navigate(backPath)} className="flex items-center gap-2 text-[#5A6B50] hover:text-[#2E3A24] text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back to Requests
      </button>
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">Loading request details from MongoDB...</CardContent>
      </Card>
    </div>;
  }

  if (error && !order) {
    return <div className="p-6 lg:p-8 space-y-6">
      <button onClick={() => navigate(backPath)} className="flex items-center gap-2 text-[#5A6B50] hover:text-[#2E3A24] text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back to Requests
      </button>
      <Card>
        <CardContent className="py-10 text-center">
          <p className="font-semibold text-[#D4183D] mb-2">Unable to load this request.</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    </div>;
  }

  if (!order) {
    return <div className="p-6 lg:p-8 space-y-6">
      <button onClick={() => navigate(backPath)} className="flex items-center gap-2 text-[#5A6B50] hover:text-[#2E3A24] text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back to Requests
      </button>
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">Request not found.</CardContent>
      </Card>
    </div>;
  }

  return <div className="p-6 lg:p-8 space-y-6">
    <button onClick={() => navigate(backPath)} className="flex items-center gap-2 text-[#5A6B50] hover:text-[#2E3A24] transition-colors text-sm">
      <ArrowLeft className="w-4 h-4" />
      Back to Requests
    </button>

    <PageHeader
      title={`Request ${requestId}`}
      subtitle={`${supplierName} - ${createdDate}`}
    />

    {error && <div className="rounded-xl border border-[#D4183D]/20 bg-[#D4183D]/10 px-4 py-3 text-sm text-[#D4183D]">{error}</div>}
    {message && <div className="rounded-xl border border-[#5B8A4A]/20 bg-[#5B8A4A]/10 px-4 py-3 text-sm text-[#3d6b2e]">{message}</div>}

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Request Status</CardTitle>
            <Badge variant={statusVariants[currentStatus] || "neutral"}>{statusLabels[currentStatus] || currentStatus}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {timeline.map((step, index) => {
                const Icon = step.icon;
                const isDone = step.complete;
                return <div key={step.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`p-3 rounded-full ${isDone ? "bg-[#6A7B4D] text-white" : step.active ? "bg-[#4B5B3A] text-white" : "bg-[#E0E1B7] text-muted-foreground"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {index !== timeline.length - 1 && <div className={`w-0.5 h-14 mt-2 ${isDone ? "bg-[#6A7B4D]" : "bg-border"}`} />}
                  </div>
                  <div className="flex-1 pb-5">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h4 className="font-semibold text-foreground">{step.title}</h4>
                      <p className="text-sm text-muted-foreground whitespace-nowrap">{createdDate}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>;
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requested Items</CardTitle>
            <span className="text-sm text-muted-foreground">{items.length} items</span>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? <p className="text-sm text-muted-foreground">No order items were found for this request.</p> : <div className="space-y-4">
              {items.map((item) => {
                const product = item.product_id || item.product || {};
                const productId = getDocumentId(product);
                const productName = product?.name || item.product_name || item.name || "Unknown item";
                return <div key={item._id || `${productId || productName}-${item.quantity}`} className="p-4 bg-background rounded-xl border border-border">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-semibold text-foreground">{productName}</p>
                      <p className="text-sm text-muted-foreground">{String(productId || "").slice(-8).toUpperCase() || "N/A"}</p>
                    </div>
                    <Badge variant="info">{product?.category || item.category || "Food supply"}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Quantity</p>
                      <p className="font-medium text-foreground">{item.quantity || 0} {product?.unit || item.unit || ""}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Unit Price</p>
                      <p className="font-medium text-foreground">{money(item.unit_price)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-medium text-foreground">{money(item.total_price)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Available Stock</p>
                      <p className="font-medium text-foreground">{product?.quantity ?? item.available ?? "N/A"} {product?.unit || item.unit || ""}</p>
                    </div>
                  </div>
                </div>;
              })}
            </div>}
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
              {[
                { label: "Request ID", value: requestId, icon: Package },
                { label: "Requested By", value: requesterName, icon: User },
                { label: "Employee Code", value: requesterCode, icon: User },
                { label: "Supplier", value: supplierName, icon: Truck },
                { label: "Request Date", value: createdDate, icon: Calendar },
                { label: "Total Quantity", value: totalQuantity || "N/A", icon: Package },
                { label: "Total Price", value: money(order.total_price), icon: Package }
              ].map((field) => {
                const Icon = field.icon;
                return <div key={field.label} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-[#5A6B50] mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{field.label}</p>
                    <p className="font-semibold text-foreground">{field.value}</p>
                  </div>
                </div>;
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground leading-relaxed">
              {notes || "No additional notes were saved for this request."}
            </p>
          </CardContent>
        </Card>

        {canManageRequest && <Card>
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => updateStatus("approved")} disabled={saving || ["approved", "completed", "cancelled"].includes(currentStatus)}>
                <CheckCircle className="w-4 h-4" />
                Approve Request
              </Button>
              <Button variant="danger" className="w-full" onClick={() => updateStatus("cancelled")} disabled={saving || ["completed", "cancelled"].includes(currentStatus)}>
                <XCircle className="w-4 h-4" />
                Reject Request
              </Button>
              <Button variant="outline" className="w-full" onClick={() => updateStatus("completed")} disabled={saving || currentStatus === "completed" || currentStatus === "cancelled"}>
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
