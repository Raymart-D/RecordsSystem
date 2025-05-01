import { useParams, useLocation } from "wouter";
import { Helmet } from 'react-helmet';
import { useQuery } from "@tanstack/react-query";
import RecordForm from "@/components/records/RecordForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Record } from "@shared/schema";

const EditRecord = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  
  const recordId = parseInt(id);
  
  if (isNaN(recordId)) {
    navigate("/records");
    return null;
  }
  
  const { data: record, isLoading } = useQuery({
    queryKey: [`/api/records/${recordId}`],
  });
  
  const handleSuccess = (record: Record) => {
    navigate(`/records/${record.id}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }
  
  if (!record) {
    navigate("/records");
    return null;
  }
  
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Edit Record | RecordsVault</title>
      </Helmet>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href={`/records/${recordId}`}>
            <Button variant="ghost" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Edit Record</h1>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>
            Edit "{record.title}"
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RecordForm 
            recordId={recordId}
            onSuccess={handleSuccess} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditRecord;
