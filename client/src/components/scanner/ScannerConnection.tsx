import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ScannerConfig } from "@shared/schema";
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Printer, 
  Check,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const ScannerConnection = () => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const { 
    data: scannerConfig,
    isLoading,
    error,
    refetch
  } = useQuery<ScannerConfig>({
    queryKey: ["/api/scanner/config"],
  });

  const connectScanner = async () => {
    setIsConnecting(true);
    try {
      const response = await apiRequest("POST", "/api/scanner/connect", {});
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Scanner Connected",
          description: "Successfully connected to the Brother ADS-2400N scanner.",
        });
        
        queryClient.invalidateQueries({ queryKey: ["/api/scanner/config"] });
      } else {
        toast({
          title: "Connection Failed",
          description: result.message || "Failed to connect to the scanner. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "An error occurred while trying to connect to the scanner.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectScanner = async () => {
    setIsDisconnecting(true);
    try {
      const response = await apiRequest("POST", "/api/scanner/disconnect", {});
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Scanner Disconnected",
          description: "Successfully disconnected from the scanner.",
        });
        
        queryClient.invalidateQueries({ queryKey: ["/api/scanner/config"] });
      } else {
        toast({
          title: "Disconnection Failed",
          description: result.message || "Failed to disconnect from the scanner. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Disconnection Error",
        description: "An error occurred while trying to disconnect from the scanner.",
        variant: "destructive",
      });
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-7 w-48" /></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    );
  }

  if (error || !scannerConfig) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Scanner Configuration Error
          </CardTitle>
        </CardHeader>
        <CardContent className="text-red-600">
          <p>Unable to load scanner configuration. Please try refreshing or contact technical support.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => refetch()} variant="outline" className="border-red-300">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Printer className="h-5 w-5 mr-2" />
            Scanner Connection
          </CardTitle>
          <Badge 
            variant="outline" 
            className={scannerConfig.isConnected 
              ? "bg-green-100 text-green-800 border-green-300"
              : "bg-amber-100 text-amber-800 border-amber-300"
            }
          >
            {scannerConfig.isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-slate-500">Scanner Model</span>
            <span className="text-slate-800">{scannerConfig.modelName}</span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-slate-500">IP Address</span>
            <span className="text-slate-800">{scannerConfig.ipAddress || "Not configured"}</span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-slate-500">Status</span>
            <div className="flex items-center">
              {scannerConfig.isConnected ? (
                <>
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-green-700">Connected and Ready</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span className="text-amber-700">Disconnected</span>
                </>
              )}
            </div>
          </div>
          
          {scannerConfig.lastConnected && (
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-slate-500">Last Connected</span>
              <span className="text-slate-800">
                {new Date(scannerConfig.lastConnected).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6 flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => refetch()}
          disabled={isConnecting || isDisconnecting}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isConnecting || isDisconnecting ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
        
        {scannerConfig.isConnected ? (
          <Button 
            variant="destructive" 
            onClick={disconnectScanner}
            disabled={isDisconnecting}
          >
            {isDisconnecting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Disconnecting...
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 mr-2" />
                Disconnect
              </>
            )}
          </Button>
        ) : (
          <Button 
            onClick={connectScanner}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 mr-2" />
                Connect
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ScannerConnection;
