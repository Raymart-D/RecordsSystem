import { Helmet } from 'react-helmet';
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecordsChart from "@/components/dashboard/RecordsChart";
import RecentRecords from "@/components/dashboard/RecentRecords";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Plus, 
  Upload, 
  Folder, 
  Search, 
  Clock,
  FileScan
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <Helmet>
        <title>Dashboard | RecordsVault</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome to your records management system</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/records/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </Link>
          <Link href="/scanner">
            <Button variant="outline">
              <FileScan className="h-4 w-4 mr-2" />
              Scan Document
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Charts Section */}
      <RecordsChart />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Records */}
        <div className="lg:col-span-2">
          <RecentRecords />
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Search className="h-4 w-4 mr-2" />
                Search Records
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Folder className="h-4 w-4 mr-2" />
                Browse Categories
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Import Records
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" />
                View Archived Records
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">FileScan Connection:</span>
                  <span className="text-sm font-medium">
                    <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                    Disconnected
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Storage Usage:</span>
                  <span className="text-sm font-medium">23% of 1GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Last Backup:</span>
                  <span className="text-sm font-medium">3 days ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Software Version:</span>
                  <span className="text-sm font-medium">v1.2.4</span>
                </div>
                <div className="pt-2">
                  <Link href="/settings">
                    <Button variant="link" className="px-0">
                      View System Settings
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
