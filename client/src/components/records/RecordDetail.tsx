import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import { 
  FileText, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Star,
  Clock,
  User,
  Tag,
  FileType,
  CalendarDays,
  ShieldCheck,
  File
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DocumentPreview from "@/components/documents/DocumentPreview";

interface RecordDetailProps {
  recordId: number;
  onDelete?: () => void;
}

const RecordDetail = ({ recordId, onDelete }: RecordDetailProps) => {
  const { data: record, isLoading } = useQuery({
    queryKey: [`/api/records/${recordId}`],
  });
  
  const { toast } = useToast();

  const handleDeleteRecord = async () => {
    try {
      await apiRequest("DELETE", `/api/records/${recordId}`);
      
      toast({
        title: "Record deleted",
        description: "The record has been successfully deleted.",
      });
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["/api/records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the record. Please try again.",
        variant: "destructive",
      });
    }
  };

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
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "Receipt":
        return <FileText className="h-5 w-5 text-green-600" />;
      case "Contract":
        return <FileText className="h-5 w-5 text-purple-600" />;
      case "Report":
        return <FileText className="h-5 w-5 text-amber-600" />;
      case "Form":
        return <FileText className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-slate-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!record) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 mb-2">Record not found</h3>
          <p className="text-slate-500 mb-6">
            The record you are looking for does not exist or may have been deleted.
          </p>
          <Link href="/records">
            <Button>
              Back to Records
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <Link href="/records">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Record Details</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/records/${recordId}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </Link>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Record</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{record.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-500 hover:bg-red-600"
                  onClick={handleDeleteRecord}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getCategoryIcon(record.category)}
                  <CardTitle className="ml-2">
                    {record.title}
                    {record.isFavorite && (
                      <Star className="h-4 w-4 inline-block ml-2 text-amber-500 fill-amber-500" />
                    )}
                  </CardTitle>
                </div>
                <Badge variant="outline" className={getStatusColor(record.status)}>
                  {record.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {record.content && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Content</h3>
                    <div className="p-4 bg-slate-50 rounded-md text-slate-700 whitespace-pre-line">
                      {record.content}
                    </div>
                  </div>
                )}
                
                {record.tags && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {record.tags.split(',').map(tag => (
                        <span key={tag} className="inline-block bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <DocumentPreview 
            recordId={recordId} 
            fileType={record.fileType || ""}
          />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Record Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <File className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Category</h3>
                    <p className="text-slate-600">{record.category}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                    <FileType className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">File Type</h3>
                    <p className="text-slate-600">{record.fileType || "Not specified"}</p>
                  </div>
                </div>
                
                {record.fileSize && (
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">File Size</h3>
                      <p className="text-slate-600">{Math.round(record.fileSize / 1024)} KB</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Status</h3>
                    <p className="text-slate-600">{record.status}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Date Created</h3>
                    <p className="text-slate-600">{format(new Date(record.dateCreated), "PPP")}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mr-3">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Last Modified</h3>
                    <p className="text-slate-600">{format(new Date(record.dateModified), "PPP")}</p>
                  </div>
                </div>
                
                {record.tags && (
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                      <Tag className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Tags</h3>
                      <p className="text-slate-600">{record.tags}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Record Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Download Record
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <User className="mr-2 h-4 w-4" />
                  Share Record
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant={record.isFavorite ? "default" : "outline"}
                >
                  <Star className="mr-2 h-4 w-4" />
                  {record.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecordDetail;
