import { PageHeader } from "../components/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { AlertTriangle, Bell } from "lucide-react";
const SettingsPage = () => {
  return <div className="p-6 lg:p-8 space-y-6">
      <PageHeader
    title="System Settings"
    subtitle="Configure system-wide preferences and thresholds"
  />

      <div className="max-w-4xl space-y-5">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#6A7B4D]/12 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-[#6A7B4D]" />
              </div>
              <CardTitle>Alert Thresholds</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
    label="Low Stock Threshold (%)"
    type="number"
    defaultValue="20"
    min="0"
    max="100"
  />
                <Input
    label="Critical Stock Threshold (%)"
    type="number"
    defaultValue="10"
    min="0"
    max="100"
  />
                <Input
    label="Expiration Warning (days)"
    type="number"
    defaultValue="30"
    min="1"
  />
                <Input
    label="Critical Expiration (days)"
    type="number"
    defaultValue="7"
    min="1"
  />
              </div>
              <Button>Save Threshold Settings</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#6A7B4D]/12 flex items-center justify-center">
                <Bell className="w-4 h-4 text-[#6A7B4D]" />
              </div>
              <CardTitle>Notification Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Send email alerts for critical events
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
              </label>
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">SMS Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Send SMS for urgent notifications
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
              </label>
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Daily Reports</p>
                  <p className="text-sm text-muted-foreground">
                    Receive daily inventory summary reports
                  </p>
                </div>
                <input type="checkbox" className="w-5 h-5 accent-primary" />
              </label>
            </div>
            <div className="mt-6">
              <Button>Save Notification Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export {
  SettingsPage
};
