import { useState } from "react";
import { Helmet } from 'react-helmet';
import RecordsList from "@/components/records/RecordsList";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus, Upload, Download } from "lucide-react";

const Records = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Records | RecordsVault</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Records</h1>
          <p className="text-slate-500 mt-1">Manage and organize your documents</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/records/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </Link>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <RecordsList searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default Records;
