import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Scan, Settings, FileDown, RefreshCw, AlertCircle, Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

const ScannerControls = () => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isScanning, setIsScanning] = useState(false);
  const [scanSettings, setScanSettings] = useState({
    resolution: 300,
    colorMode: "Color",
    duplex: true,
  });

  const { 
    data: scannerConfig,
    isLoading,
    error
  } = useQuery({
    queryKey: ["/api/scanner/config"],
  });

  const handleScan = async () => {
    setIsScanning(true);
    
    try {
      // First update scanner config
      await apiRequest("PATCH", "/api/scanner/config", {
        resolution: scanSettings.resolution,
        colorMode: scanSettings.colorMode,
        duplex: scanSettings.duplex,
      });
      
      // Then initiate scan
      const response = await apiRequest("POST", "/api/scanner/scan", {});
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Document Scanned",
          description: "The document was successfully scanned and saved.",
        });
        
        // Invalidate queries and redirect to the new record
        queryClient.invalidateQueries({ queryKey: ["/api/records"] });
        queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
        
        if (result.record && result.record.id) {
          navigate(`/records/${result.record.id}`);
        }
      } else {
        toast({
          title: "Scan Failed",
          description: result.message || "Failed to scan the document. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Scan Error",
        description: "An error occurred while trying to scan the document.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const updateScanSetting = (key: string, value: any) => {
    setScanSettings({
      ...scanSettings,
      [key]: value,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-7 w-48" /></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  // If there's an error or the scanner is not connected
  if (error || !scannerConfig || !scannerConfig.isConnected) {
    return (
      <Card className={error ? "border-red-200 bg-red-50" : ""}>
        <CardHeader>
          <CardTitle className={`flex items-center ${error ? "text-red-700" : ""}`}>
            {error ? (
              <AlertCircle className="h-5 w-5 mr-2" />
            ) : (
              <Scan className="h-5 w-5 mr-2" />
            )}
            Scan Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">Scanner Not Connected</h3>
            <p className="text-slate-600 mb-4">
              Please connect to your Brother ADS-2400N scanner before scanning documents.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Go to Scanner Connection
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Scan className="h-5 w-5 mr-2" />
          Scan Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="resolution">Resolution (DPI): {scanSettings.resolution}</Label>
            <Slider
              id="resolution"
              min={100}
              max={600}
              step={100}
              value={[scanSettings.resolution]}
              onValueChange={(value) => updateScanSetting("resolution", value[0])}
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>100</span>
              <span>200</span>
              <span>300</span>
              <span>400</span>
              <span>500</span>
              <span>600</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="colorMode">Color Mode</Label>
            <Select
              value={scanSettings.colorMode}
              onValueChange={(value) => updateScanSetting("colorMode", value)}
            >
              <SelectTrigger id="colorMode">
                <SelectValue placeholder="Select color mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Color">Color</SelectItem>
                <SelectItem value="Grayscale">Grayscale</SelectItem>
                <SelectItem value="BlackAndWhite">Black & White</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="duplex" className="cursor-pointer">
              Double-sided Scanning
            </Label>
            <Switch
              id="duplex"
              checked={scanSettings.duplex}
              onCheckedChange={(checked) => updateScanSetting("duplex", checked)}
            />
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-md flex items-start">
            <div className="text-blue-600 mr-3 mt-1">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-800">Automatic Document Processing</h4>
              <p className="text-xs text-blue-600 mt-1">
                Documents will be automatically categorized based on content analysis.
                You can review and adjust categorization after scanning.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <div className="w-full space-y-3">
          <Button 
            className="w-full"
            onClick={handleScan}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Scan className="h-4 w-4 mr-2" />
                Start Scanning
              </>
            )}
          </Button>
          
          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Advanced Settings
            </Button>
            <Button variant="outline" className="flex-1">
              <FileDown className="h-4 w-4 mr-2" />
              Save Preset
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ScannerControls;
