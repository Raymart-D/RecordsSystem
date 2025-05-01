import { useParams, useLocation } from "wouter";
import { Helmet } from 'react-helmet';
import RecordDetail from "@/components/records/RecordDetail";

const RecordDetailPage = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  
  const recordId = parseInt(id);
  
  if (isNaN(recordId)) {
    navigate("/records");
    return null;
  }
  
  const handleDelete = () => {
    navigate("/records");
  };
  
  return (
    <div>
      <Helmet>
        <title>Record Details | RecordsVault</title>
      </Helmet>

      <RecordDetail 
        recordId={recordId}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default RecordDetailPage;
