import { useLocation } from "wouter";
import { Helmet } from 'react-helmet';
import RecordForm from "@/components/records/RecordForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Save } from "lucide-react";
import { Record } from "@shared/schema";

const AddRecord = () => {
  const [, navigate] = useLocation();
  
  const handleSuccess = (record: Record) => {
    navigate(`/records/${record.id}`);
  };
  
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Add Record | RecordsVault</title>
      </Helmet>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/records">
            <Button variant="ghost" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Add New Record</h1>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Record Information</CardTitle>
        </CardHeader>
        <CardContent>
          <RecordForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>
      
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-slate-800 mb-2">Tips for Adding Records</h3>
        <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>Provide a clear, descriptive title for easy searching</li>
          <li>Select the appropriate category for better organization</li>
          <li>Add tags to enhance searchability and filtering</li>
          <li>Include relevant details in the content field</li>
          <li>Mark important records as favorites for quick access</li>
        </ul>
      </div>
    </div>
  );
};

export default AddRecord;
