import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, FileText, Download, ZoomIn, ZoomOut, Rotate3d, AlertCircle } from "lucide-react";

interface DocumentPreviewProps {
  recordId: number;
  fileType?: string;
}

const DocumentPreview = ({ recordId, fileType }: DocumentPreviewProps) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);

  // In a real application, this would fetch the actual document from an API
  // For now, we'll just show a placeholder based on file type
  const renderPreview = () => {
    // Handle unsupported file types or missing files
    if (!fileType) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-50 rounded-md border-2 border-dashed border-slate-200">
          <AlertCircle className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-600">No Document Available</h3>
          <p className="text-sm text-slate-500 mt-1">
            This record does not have an associated document file.
          </p>
        </div>
      );
    }

    // Determine the icon based on file type
    const getFileIcon = () => {
      switch (fileType.toUpperCase()) {
        case "PDF":
          return <FileText className="h-16 w-16 text-red-500" />;
        case "DOCX":
        case "DOC":
          return <FileText className="h-16 w-16 text-blue-500" />;
        case "XLSX":
        case "XLS":
          return <FileText className="h-16 w-16 text-green-500" />;
        case "JPG":
        case "JPEG":
        case "PNG":
          return <File className="h-16 w-16 text-purple-500" />;
        default:
          return <File className="h-16 w-16 text-slate-500" />;
      }
    };

    // Generate a mock preview frame based on file type
    return (
      <div 
        className="flex flex-col items-center justify-center h-64 border rounded-md overflow-hidden bg-slate-50"
        style={{ 
          transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
          transition: 'transform 0.3s ease'
        }}
      >
        <div className="flex flex-col items-center justify-center p-8">
          {getFileIcon()}
          <span className="mt-4 text-slate-800 font-medium">
            {fileType.toUpperCase()} Document Preview
          </span>
          <span className="text-sm text-slate-500 mt-1">
            Document ID: {recordId}
          </span>
        </div>
      </div>
    );
  };

  const handleZoomIn = () => {
    if (zoomLevel < 200) {
      setZoomLevel(zoomLevel + 25);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 50) {
      setZoomLevel(zoomLevel - 25);
    }
  };

  const handleRotate = () => {
    setRotation((rotation + 90) % 360);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <File className="h-5 w-5 mr-2" />
          Document Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {renderPreview()}
          
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 200}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 50}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRotate}
              >
                <Rotate3d className="h-4 w-4" />
              </Button>
              <span className="inline-flex items-center px-2 py-1 text-xs bg-slate-100 rounded">
                {zoomLevel}%
              </span>
            </div>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
          
          <p className="text-xs text-slate-500 italic">
            Note: For full document functionality, please use the document viewer application installed on your system.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentPreview;
