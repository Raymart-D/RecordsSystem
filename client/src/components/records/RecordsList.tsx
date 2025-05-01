import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  FileText, 
  Star, 
  Clock, 
  FileEdit, 
  ExternalLink,
  Table,
  Grid,
  Trash2,
  Eye,
  ChevronsUpDown,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { format } from "date-fns";
import { Record, RECORD_CATEGORIES, RECORD_STATUSES } from "@shared/schema";
import RecordSearchBar from "./RecordSearchBar";

type ViewMode = "grid" | "table";

interface RecordsListProps {
  searchQuery?: string;
}

const RecordsList = ({ searchQuery = "" }: RecordsListProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [sortField, setSortField] = useState<string>("dateCreated");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["/api/records"],
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDeleteRecord = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/records/${id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Record deleted",
        description: "The record has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the record. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredRecords = records
    .filter((record: Record) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          record.title.toLowerCase().includes(query) ||
          record.category.toLowerCase().includes(query) ||
          record.tags?.toLowerCase().includes(query) ||
          record.content?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((record: Record) => {
      // Category filter
      if (categoryFilter) {
        return record.category === categoryFilter;
      }
      return true;
    })
    .filter((record: Record) => {
      // Status filter
      if (statusFilter) {
        return record.status === statusFilter;
      }
      return true;
    })
    .sort((a: Record, b: Record) => {
      // Sort logic
      if (sortField === "title") {
        return sortDirection === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortField === "category") {
        return sortDirection === "asc"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      } else if (sortField === "status") {
        return sortDirection === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else if (sortField === "dateCreated") {
        return sortDirection === "asc"
          ? new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
          : new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
      } else if (sortField === "fileSize") {
        const aSize = a.fileSize || 0;
        const bSize = b.fileSize || 0;
        return sortDirection === "asc" ? aSize - bSize : bSize - aSize;
      }
      return 0;
    });

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

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="h-4 w-4" />;
    }
    return sortDirection === "asc" ? (
      <span>↑</span>
    ) : (
      <span>↓</span>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="border rounded-md">
          <Skeleton className="h-10 w-full" />
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <RecordSearchBar />
        
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuItem 
                className={!categoryFilter ? "bg-slate-100" : ""}
                onClick={() => setCategoryFilter(null)}
              >
                All Categories
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {RECORD_CATEGORIES.map((category) => (
                <DropdownMenuItem 
                  key={category}
                  className={categoryFilter === category ? "bg-slate-100" : ""}
                  onClick={() => setCategoryFilter(category)}
                >
                  {getCategoryIcon(category)}
                  <span className="ml-2">{category}</span>
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuItem 
                className={!statusFilter ? "bg-slate-100" : ""}
                onClick={() => setStatusFilter(null)}
              >
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {RECORD_STATUSES.map((status) => (
                <DropdownMenuItem 
                  key={status}
                  className={statusFilter === status ? "bg-slate-100" : ""}
                  onClick={() => setStatusFilter(status)}
                >
                  <span className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(status)}`}></span>
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="border rounded-md flex">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode("table")}
            >
              <Table className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
          
          <Link href="/records/add">
            <Button size="sm">Add Record</Button>
          </Link>
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">No records found</h3>
            <p className="text-slate-500 mb-6">
              {searchQuery 
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first record."}
            </p>
            <Link href="/records/add">
              <Button>
                Add New Record
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : viewMode === "table" ? (
        <div className="border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort("title")}
                    >
                      Title {getSortIcon("title")}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort("category")}
                    >
                      Category {getSortIcon("category")}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort("status")}
                    >
                      Status {getSortIcon("status")}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort("dateCreated")}
                    >
                      Date Created {getSortIcon("dateCreated")}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center"
                      onClick={() => handleSort("fileSize")}
                    >
                      Size {getSortIcon("fileSize")}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredRecords.map((record: Record) => (
                  <tr key={record.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {getCategoryIcon(record.category)}
                        <Link href={`/records/${record.id}`}>
                          <span className="ml-2 text-slate-800 hover:text-primary-600 transition-colors cursor-pointer">
                            {record.title}
                            {record.isFavorite && (
                              <Star className="h-3.5 w-3.5 inline-block ml-1 text-amber-500 fill-amber-500" />
                            )}
                          </span>
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant="outline" className="font-normal">
                        {record.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant="outline" className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                      {format(new Date(record.dateCreated), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                      {record.fileSize ? `${Math.round(record.fileSize / 1024)} KB` : "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-2">
                        <Link href={`/records/${record.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/records/${record.id}/edit`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <FileEdit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
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
                                onClick={() => handleDeleteRecord(record.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRecords.map((record: Record) => (
            <Card key={record.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-2">
                    <div className="mt-1">{getCategoryIcon(record.category)}</div>
                    <div>
                      <Link href={`/records/${record.id}`}>
                        <h3 className="font-medium text-slate-800 hover:text-primary-600 transition-colors cursor-pointer">
                          {record.title}
                          {record.isFavorite && (
                            <Star className="h-3.5 w-3.5 inline-block ml-1 text-amber-500 fill-amber-500" />
                          )}
                        </h3>
                      </Link>
                      <div className="flex items-center mt-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{format(new Date(record.dateCreated), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between mt-1 mb-3">
                    <Badge variant="outline" className="font-normal">
                      {record.category}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {record.fileType} {record.fileSize ? `• ${Math.round(record.fileSize / 1024)} KB` : ""}
                    </span>
                  </div>
                  
                  {record.tags && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {record.tags.split(',').map(tag => (
                        <span key={tag} className="inline-block bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between mt-4">
                  <Link href={`/records/${record.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      View
                    </Button>
                  </Link>
                  
                  <div className="flex space-x-2">
                    <Link href={`/records/${record.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <FileEdit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 hover:border-red-300">
                          <Trash2 className="h-3.5 w-3.5" />
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
                            onClick={() => handleDeleteRecord(record.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecordsList;
