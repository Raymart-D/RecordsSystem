import { useState } from "react";
import { Helmet } from 'react-helmet';
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Settings as SettingsIcon, 
  Save, 
  RefreshCw, 
  Shield, 
  Database,
  Monitor,
  User,
  Printer
} from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const { data: scannerConfig, isLoading } = useQuery({
    queryKey: ["/api/scanner/config"],
  });
  
  const [settings, setSettings] = useState({
    scannerIpAddress: "",
    scannerResolution: 300,
    scannerColorMode: "Color",
    scannerDuplex: true,
    scannerAutoFeeder: true,
    darkMode: false,
    notifications: true,
    autoBackup: true,
    compactView: false
  });
  
  // When scanner data is loaded, update form values
  if (scannerConfig && !settings.scannerIpAddress) {
    setSettings({
      ...settings,
      scannerIpAddress: scannerConfig.ipAddress || "",
      scannerResolution: scannerConfig.resolution,
      scannerColorMode: scannerConfig.colorMode,
      scannerDuplex: scannerConfig.duplex,
      scannerAutoFeeder: scannerConfig.autoFeeder
    });
  }
  
  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // In a real application, this would save all settings
      // For now, let's just update the scanner config
      await apiRequest("PATCH", "/api/scanner/config", {
        ipAddress: settings.scannerIpAddress,
        resolution: settings.scannerResolution,
        colorMode: settings.scannerColorMode,
        duplex: settings.scannerDuplex,
        autoFeeder: settings.scannerAutoFeeder
      });
      
      toast({
        title: "Settings Saved",
        description: "Your settings have been successfully updated.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/scanner/config"] });
    } catch (error) {
      toast({
        title: "Error Saving Settings",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSettingChange = (key: string, value: any) => {
    setSettings({
      ...settings,
      [key]: value
    });
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-500 mt-1">Configure your system preferences</p>
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-5 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Settings | RecordsVault</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-1">Configure your system preferences</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <SettingsIcon className="h-5 w-5 mr-2" />
            System Settings
          </CardTitle>
          <CardDescription>
            Manage your application preferences and scanner configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="general" className="flex items-center">
                <Monitor className="h-4 w-4 mr-2" /> General
              </TabsTrigger>
              <TabsTrigger value="scanner" className="flex items-center">
                <Printer className="h-4 w-4 mr-2" /> Scanner
              </TabsTrigger>
              <TabsTrigger value="storage" className="flex items-center">
                <Database className="h-4 w-4 mr-2" /> Storage
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" /> Security
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Dark Mode</Label>
                    <p className="text-sm text-slate-500">Enable dark theme for the application</p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => handleSettingChange("darkMode", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Notifications</Label>
                    <p className="text-sm text-slate-500">Receive notifications for important events</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Compact View</Label>
                    <p className="text-sm text-slate-500">Use a more compact layout for lists and tables</p>
                  </div>
                  <Switch
                    checked={settings.compactView}
                    onCheckedChange={(checked) => handleSettingChange("compactView", checked)}
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <Label className="text-base mb-2 block">User Information</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue="Administrator" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue="admin@example.com" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="scanner" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="scannerIpAddress">Scanner IP Address</Label>
                  <Input 
                    id="scannerIpAddress" 
                    placeholder="192.168.1.100" 
                    value={settings.scannerIpAddress}
                    onChange={(e) => handleSettingChange("scannerIpAddress", e.target.value)}
                  />
                  <p className="text-xs text-slate-500">The IP address of your Brother ADS-2400N scanner</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scannerResolution">Default Resolution</Label>
                  <select 
                    id="scannerResolution" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                    value={settings.scannerResolution}
                    onChange={(e) => handleSettingChange("scannerResolution", parseInt(e.target.value))}
                  >
                    <option value={100}>100 DPI</option>
                    <option value={200}>200 DPI</option>
                    <option value={300}>300 DPI</option>
                    <option value={400}>400 DPI</option>
                    <option value={600}>600 DPI</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scannerColorMode">Default Color Mode</Label>
                  <select 
                    id="scannerColorMode" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                    value={settings.scannerColorMode}
                    onChange={(e) => handleSettingChange("scannerColorMode", e.target.value)}
                  >
                    <option value="Color">Color</option>
                    <option value="Grayscale">Grayscale</option>
                    <option value="BlackAndWhite">Black & White</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Double-sided Scanning</Label>
                    <p className="text-sm text-slate-500">Enable duplex scanning by default</p>
                  </div>
                  <Switch
                    checked={settings.scannerDuplex}
                    onCheckedChange={(checked) => handleSettingChange("scannerDuplex", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Automatic Document Feeder</Label>
                    <p className="text-sm text-slate-500">Use the automatic document feeder</p>
                  </div>
                  <Switch
                    checked={settings.scannerAutoFeeder}
                    onCheckedChange={(checked) => handleSettingChange("scannerAutoFeeder", checked)}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="storage" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Automatic Backup</Label>
                    <p className="text-sm text-slate-500">Automatically back up records daily</p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => handleSettingChange("autoBackup", checked)}
                  />
                </div>
                
                <div className="pt-2 space-y-2">
                  <Label htmlFor="backupLocation">Backup Location</Label>
                  <Input id="backupLocation" defaultValue="/backup" />
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-base">Storage Usage</Label>
                    <span className="text-sm font-medium">23% of 1GB</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">234.5 MB used of 1 GB total storage</p>
                </div>
                
                <div className="space-y-2 pt-4">
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Run Backup Now
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200">
                    <Database className="h-4 w-4 mr-2" />
                    Clear Temporary Files
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="admin" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Two-Factor Authentication</Label>
                      <p className="text-sm text-slate-500">Enable additional security layer</p>
                    </div>
                    <Switch
                      defaultChecked={false}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline">Reset to Defaults</Button>
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Account Information
          </CardTitle>
          <CardDescription>
            View and manage your account details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 md:gap-10">
              <div className="md:w-1/2 space-y-4">
                <div>
                  <Label className="text-sm text-slate-500">Full Name</Label>
                  <p className="font-medium">Administrator</p>
                </div>
                <div>
                  <Label className="text-sm text-slate-500">Email</Label>
                  <p className="font-medium">admin@example.com</p>
                </div>
                <div>
                  <Label className="text-sm text-slate-500">Role</Label>
                  <p className="font-medium">System Administrator</p>
                </div>
              </div>
              <div className="md:w-1/2 space-y-4">
                <div>
                  <Label className="text-sm text-slate-500">Account Created</Label>
                  <p className="font-medium">January 15, 2023</p>
                </div>
                <div>
                  <Label className="text-sm text-slate-500">Last Login</Label>
                  <p className="font-medium">Today, 9:32 AM</p>
                </div>
                <div>
                  <Label className="text-sm text-slate-500">Status</Label>
                  <p className="font-medium flex items-center">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button variant="outline" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200">
            Edit Account Information
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Settings;
