import { useEffect, useState } from "react";
import { vendors as dummyVendors } from "@/utils/dummyData";
import VendorTable from "@/components/VendorTable";
import Filters from "@/components/Filters";
import ActionBar from "@/components/ActionBar";
import Pagination from "@/components/Pagination";
import EditVendorModal from "@/components/EditVendorModal";
import EmailHistory from "@/components/EmailHistory";

export default function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    query: "",
    category: "",
    type: "",
    status: "",
    region: "",
    dateFrom: "",
    dateTo: ""
  });
  const [code, setCode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  useEffect(() => {
    setVendors(dummyVendors);
  }, []);

  useEffect(() => {
    let result = vendors;
    
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter((v) =>
        [v.name, v.id, v.category, v.location].some((val) =>
          val.toLowerCase().includes(q)
        )
      );
    }
    
    if (filters.category) result = result.filter((v) => v.category === filters.category);
    if (filters.type) result = result.filter((v) => v.type === filters.type);
    if (filters.status) result = result.filter((v) => v.status === filters.status);
    if (filters.region) result = result.filter((v) => v.region === filters.region);
    
    if (filters.dateFrom) {
      result = result.filter((v) => new Date(v.date) >= new Date(filters.dateFrom));
    }
    
    if (filters.dateTo) {
      result = result.filter((v) => new Date(v.date) <= new Date(filters.dateTo));
    }
    
    setFiltered(result);
    setCurrentPage(1);
  }, [vendors, filters]);

  const paginated = filtered.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const totalPages = Math.ceil(filtered.length / entriesPerPage);
  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, filtered.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
            <p className="text-gray-600 mt-1">Manage and view vendor information</p>
          </div>
          
          <div className="p-6">
            <ActionBar code={code} setCode={setCode} vendors={filtered} />
            <div className="mt-6">
              <EmailHistory />
            </div>
            <Filters filters={filters} setFilters={setFilters} />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Showing</span>
                <span className="font-medium">{startEntry}</span>
                <span>to</span>
                <span className="font-medium">{endEntry}</span>
                <span>of</span>
                <span className="font-medium">{filtered.length}</span>
                <span>entries</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select 
                  value={entriesPerPage.toString()} 
                  onChange={(e) => {
                    setEntriesPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-20 h-8 rounded border border-gray-300 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span className="text-sm text-gray-600">entries per page</span>
              </div>
            </div>
            
            <VendorTable vendors={paginated} onEdit={setSelectedVendor} />
            
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
      </div>
      
      {selectedVendor && (
        <EditVendorModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onSave={(updatedVendor) => {
            setVendors(vendors.map(v => v.id === updatedVendor.id ? updatedVendor : v));
            setSelectedVendor(null);
          }}
        />
      )}
    </div>
  );
}
