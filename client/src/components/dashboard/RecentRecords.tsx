import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  FileText, 
  Star, 
  Clock, 
  FileEdit, 
  ExternalLink 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Record } from "@shared/schema";

const RecentRecords = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border-b last:border-0 py-3">
              <div className="flex items-center justify-between mb-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const recentRecords = data?.recentRecords || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Archived":
        return "bg-blue-100 text-blue-800";
      case "Pending Review":
        return "bg-amber-100 text-amber-800";
      case "Confidential":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Invoice":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "Receipt":
        return <FileText className="h-4 w-4 text-green-600" />;
      case "Contract":
        return <FileText className="h-4 w-4 text-purple-600" />;
      case "Report":
        return <FileText className="h-4 w-4 text-amber-600" />;
      case "Form":
        return <FileText className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-slate-600" />;
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Recent Records</CardTitle>
        <Link href="/records">
          <Button variant="outline" size="sm">
            View All
            <ExternalLink className="ml-2 h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-6">
        {recentRecords.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-slate-600">No records yet</h3>
            <p className="text-sm text-slate-500 mb-4">
              Start adding records to your collection
            </p>
            <Link href="/records/add">
              <Button>
                Add Your First Record
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {recentRecords.map((record: Record) => (
              <div
                key={record.id}
                className="border-b border-slate-100 py-3 last:border-0"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="mr-2">
                      {getCategoryIcon(record.category)}
                    </div>
                    <Link href={`/records/${record.id}`}>
                      <h3 className="font-medium text-slate-800 hover:text-primary-600 transition-colors cursor-pointer">
                        {record.title}
                        {record.isFavorite && (
                          <Star className="h-3.5 w-3.5 inline-block ml-1 text-amber-500 fill-amber-500" />
                        )}
                      </h3>
                    </Link>
                  </div>
                  <Badge variant="outline" className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center text-xs text-slate-500">
                    <Badge variant="outline" className="font-normal">
                      {record.category}
                    </Badge>
                    <span className="mx-2">•</span>
                    <span>{record.fileType || "Unknown"}</span>
                    {record.fileSize && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{Math.round(record.fileSize / 1024)} KB</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>
                      {format(new Date(record.dateCreated), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-2">
                  <Link href={`/records/${record.id}`}>
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs mr-2">
                      View
                    </Button>
                  </Link>
                  <Link href={`/records/${record.id}/edit`}>
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                      <FileEdit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentRecords;
