import { Helmet } from 'react-helmet';
import ScannerConnection from "@/components/scanner/ScannerConnection";
import ScannerControls from "@/components/scanner/ScannerControls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Settings, History, HelpCircle } from "lucide-react";

const Scanner = () => {
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Scanner | RecordsVault</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold text-slate-800">Scanner Integration</h1>
        <p className="text-slate-500 mt-1">Connect and control your Brother ADS-2400N scanner</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner Connection Panel */}
        <div>
          <ScannerConnection />
        </div>
        
        {/* Scanner Controls Panel */}
        <div>
          <ScannerControls />
        </div>
        
        {/* Scanner Info Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Scanner Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-slate-500">Model</span>
                  <span className="text-slate-800">Brother ADS-2400N</span>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-slate-500">Type</span>
                  <span className="text-slate-800">Desktop Scanner</span>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-slate-500">Maximum Resolution</span>
                  <span className="text-slate-800">600 x 600 dpi</span>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-slate-500">Interface</span>
                  <span className="text-slate-800">USB, Wired Network</span>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-slate-500">Features</span>
                  <span className="text-slate-800">Duplex, ADF, Multiple Page Sizes</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" />
                Scanner Help
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="usage">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                  <TabsTrigger value="tips">Tips</TabsTrigger>
                  <TabsTrigger value="troubleshooting">Issues</TabsTrigger>
                </TabsList>
                <TabsContent value="usage" className="mt-4 text-sm text-slate-600">
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>Connect scanner via network</li>
                    <li>Load documents in the document feeder</li>
                    <li>Adjust settings as needed</li>
                    <li>Click "Start Scanning" to begin</li>
                    <li>Review and save scanned documents</li>
                  </ol>
                </TabsContent>
                <TabsContent value="tips" className="mt-4 text-sm text-slate-600">
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Use 300 DPI for most documents</li>
                    <li>Place documents straight in the feeder</li>
                    <li>Remove staples and paper clips</li>
                    <li>Keep scanner clean for best results</li>
                  </ul>
                </TabsContent>
                <TabsContent value="troubleshooting" className="mt-4 text-sm text-slate-600">
                  <ul className="space-y-2 list-disc list-inside">
                    <li>If scanner not detected, check network connection</li>
                    <li>For paper jams, open cover and gently remove paper</li>
                    <li>Restart scanner if experiencing connectivity issues</li>
                    <li>Ensure correct IP address is configured</li>
                  </ul>
                </TabsContent>
              </Tabs>
              
              <div className="mt-4 pt-4 border-t border-slate-100">
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View Full Scanner Documentation
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2" />
            Recent Scan History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Date & Time</th>
                  <th scope="col" className="px-6 py-3">Document Name</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Category</th>
                  <th scope="col" className="px-6 py-3">Size</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4">Today, 10:30 AM</td>
                  <td className="px-6 py-4">Invoice #1234</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4">Invoice</td>
                  <td className="px-6 py-4">1.2 MB</td>
                </tr>
                <tr className="bg-white border-b">
                  <td className="px-6 py-4">Yesterday, 2:15 PM</td>
                  <td className="px-6 py-4">Contract Agreement</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4">Contract</td>
                  <td className="px-6 py-4">3.5 MB</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4">Oct 10, 9:45 AM</td>
                  <td className="px-6 py-4">Expense Receipt</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4">Receipt</td>
                  <td className="px-6 py-4">0.8 MB</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scanner;
