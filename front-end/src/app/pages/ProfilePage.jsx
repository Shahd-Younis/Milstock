import { PageHeader } from "../components/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Select } from "../components/Select";
import { User, Shield, Bell } from "lucide-react";
const ProfilePage = () => {
  return <div className="p-6 lg:p-8 space-y-6">
      <PageHeader
    title="Profile Settings"
    subtitle="Manage your account information and preferences"
  />

      <div className="max-w-4xl space-y-5">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-primary" />
              <CardTitle>Personal Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" defaultValue="John Mitchell" />
              <Input label="Email" type="email" defaultValue="j.mitchell@milstock.local" />
              <Input label="Rank" defaultValue="Captain" />
              <Input label="Kitchen" defaultValue="Central Kitchen" />
              <Input label="Phone" type="tel" defaultValue="+1 (555) 123-4567" />
              <Select
    label="Base Location"
    options={[
      { value: "base-a", label: "Central Kitchen" },
      { value: "base-b", label: "Bakery Kitchen" },
      { value: "base-c", label: "Produce Kitchen" }
    ]}
  />
            </div>
            <div className="mt-6 flex gap-3">
              <Button>Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <CardTitle>Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Input label="Current Password" type="password" />
              <Input label="New Password" type="password" />
              <Input label="Confirm New Password" type="password" />
            </div>
            <div className="mt-6">
              <Button>Update Password</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-primary" />
              <CardTitle>Notification Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                <div>
                  <p className="font-medium text-foreground">Low Stock Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when items are running low
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                <div>
                  <p className="font-medium text-foreground">Expiration Warnings</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified about items nearing expiration
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                <div>
                  <p className="font-medium text-foreground">Request Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Status updates for your supply requests
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-primary" />
                <div>
                  <p className="font-medium text-foreground">Weekly Reports</p>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly inventory summary emails
                  </p>
                </div>
              </label>
            </div>
            <div className="mt-6">
              <Button>Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export {
  ProfilePage
};
