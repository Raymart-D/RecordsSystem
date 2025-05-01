import { useQuery } from "@tanstack/react-query";
import { 
  FileText, 
  FileUp, 
  Star, 
  Clock 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardStats = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <Skeleton className="h-10 w-20 mt-2" />
              <Skeleton className="h-4 w-24 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const recentCount = data?.recentRecords?.length || 0;
  const favoriteCount = data?.recentRecords?.filter((r: any) => r.isFavorite)?.length || 0;
  
  // Get counts by record status
  const activeCount = data?.recentRecords?.filter((r: any) => r.status === "Active")?.length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-600 font-medium">Total Records</h3>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{data?.totalRecords || 0}</p>
          <div className="text-sm text-green-600 flex items-center mt-1">
            <FileUp className="h-3.5 w-3.5 mr-1" />
            <span>Growing collection</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-600 font-medium">Recent Records</h3>
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{recentCount}</p>
          <div className="text-sm text-green-600 flex items-center mt-1">
            <FileUp className="h-3.5 w-3.5 mr-1" />
            <span>Added this week</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-600 font-medium">Favorite Records</h3>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Star className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{favoriteCount}</p>
          <div className="text-sm text-slate-600 flex items-center mt-1">
            <span>Flagged as important</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-600 font-medium">Active Records</h3>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{activeCount}</p>
          <div className="text-sm text-slate-600 flex items-center mt-1">
            <span>Ready for access</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
