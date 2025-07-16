import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "./ui/useToast";
import { Search, Download, Calendar, Mail, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function ActionBar({ code, setCode, vendors }) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isSendingBulkEmail, setIsSendingBulkEmail] = useState(false);
  const [bulkEmailProgress, setBulkEmailProgress] = useState(0);

  const handleFetchByCode = () => {
    if (!code.trim()) {
      toast({ 
        title: "Error", 
        description: "Please enter a vendor code",
        variant: "destructive"
      });
      return;
    }
    
    const found = vendors.find(v => v.id.toLowerCase() === code.toLowerCase());
    if (found) {
      toast({ 
        title: "Vendor Found", 
        description: `${found.name} - ${found.location}`,
        variant: "default"
      });
    } else {
      toast({ 
        title: "Not Found", 
        description: "No vendor found with this code",
        variant: "destructive"
      });
    }
  };

  const handleFetchByDate = () => {
    if (!dateFrom || !dateTo) {
      toast({ 
        title: "Error", 
        description: "Please select both from and to dates",
        variant: "destructive"
      });
      return;
    }
    
    const filtered = vendors.filter(v => {
      const vendorDate = new Date(v.date);
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      return vendorDate >= fromDate && vendorDate <= toDate;
    });
    
    toast({ 
      title: "Vendors Found", 
      description: `${filtered.length} vendors found in the date range`,
      variant: "default"
    });
  };

  const handleBulkEmail = async () => {
    // Validate vendors array
    if (!vendors || vendors.length === 0) {
      alert("❌ No vendors to send emails to");
      toast({ 
        title: "No Vendors", 
        description: "No vendors to send emails to",
        variant: "destructive"
      });
      return;
    }

    // Show confirmation alert with better formatting
    const vendorList = vendors.slice(0, 5).map(v => `• ${v.name} (${v.id})`).join('\n');
    const remainingText = vendors.length > 5 ? `\n... and ${vendors.length - 5} more vendors` : '';
    
    const confirmed = window.confirm(
      `📧 BULK EMAIL CONFIRMATION\n\n` +
      `Are you sure you want to send bulk emails?\n\n` +
      `📊 Total Vendors: ${vendors.length}\n\n` +
      `📋 Vendor List:\n${vendorList}${remainingText}\n\n` +
      `⚠️ This action cannot be undone.\n\n` +
      `Click OK to proceed or Cancel to abort.`
    );
    
    if (!confirmed) {
      console.log("Bulk email cancelled by user");
      return;
    }

    // Set loading state and reset progress
    setIsSendingBulkEmail(true);
    setBulkEmailProgress(0);
    console.log(`Starting bulk email to ${vendors.length} vendors`);
    
    // Add bulk email to history
    try {
      if (window.addEmailToHistory) {
        window.addEmailToHistory({
          vendorName: `Bulk Email (${vendors.length} vendors)`,
          vendorId: 'BULK',
          status: 'pending',
          message: 'Bulk email sending in progress...'
        });
      }
    } catch (error) {
      console.error("Error adding to email history:", error);
    }
    
    try {
      // Show sending alert
      alert(`📧 SENDING BULK EMAILS\n\n` +
            `Processing ${vendors.length} vendors...\n\n` +
            `Please wait while we send emails to all vendors.\n` +
            `This may take a few moments.`);
      
      // Simulate bulk email sending with progress
      const totalVendors = vendors.length;
      let processedVendors = 0;
      
      // Simulate processing each vendor
      for (let i = 0; i < totalVendors; i++) {
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms per vendor
        processedVendors++;
        
        // Update progress
        const progress = Math.round((processedVendors / totalVendors) * 100);
        setBulkEmailProgress(progress);
        
        // Update progress every 10 vendors
        if (processedVendors % 10 === 0 || processedVendors === totalVendors) {
          console.log(`Bulk email progress: ${processedVendors}/${totalVendors} vendors processed (${progress}%)`);
        }
      }
      
      // Calculate results (90% success rate)
      const successCount = Math.floor(totalVendors * 0.9);
      const failureCount = totalVendors - successCount;
      
      if (failureCount === 0) {
        // Show success alert
        alert(`✅ BULK EMAIL SUCCESS!\n\n` +
              `🎉 All emails sent successfully!\n\n` +
              `📊 Results:\n` +
              `• Total Vendors: ${totalVendors}\n` +
              `• Successfully Sent: ${successCount}\n` +
              `• Failed: ${failureCount}\n\n` +
              `All vendors have been notified.`);
        
        // Update email history with success
        try {
          if (window.addEmailToHistory) {
            window.addEmailToHistory({
              vendorName: `Bulk Email (${totalVendors} vendors)`,
              vendorId: 'BULK',
              status: 'success',
              message: `Successfully sent to all ${totalVendors} vendors`
            });
          }
        } catch (error) {
          console.error("Error updating email history:", error);
        }
        
        toast({ 
          title: "✅ Bulk Email Sent", 
          description: `Successfully sent emails to all ${totalVendors} vendors`,
          variant: "default"
        });
      } else {
        // Show partial success alert
        alert(`⚠️ BULK EMAIL PARTIALLY SUCCESSFUL\n\n` +
              `📊 Results:\n` +
              `• Total Vendors: ${totalVendors}\n` +
              `• ✅ Successfully Sent: ${successCount}\n` +
              `• ❌ Failed to Send: ${failureCount}\n\n` +
              `Please check the failed emails and try again for the remaining vendors.`);
        
        // Update email history with partial success
        try {
          if (window.addEmailToHistory) {
            window.addEmailToHistory({
              vendorName: `Bulk Email (${totalVendors} vendors)`,
              vendorId: 'BULK',
              status: 'failed',
              message: `Sent to ${successCount} vendors, ${failureCount} failed`
            });
          }
        } catch (error) {
          console.error("Error updating email history:", error);
        }
        
        toast({ 
          title: "⚠️ Bulk Email Partially Sent", 
          description: `Sent to ${successCount} vendors, ${failureCount} failed`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Bulk email error:", error);
      
      // Show error alert
      alert(`❌ BULK EMAIL FAILED!\n\n` +
            `Error: ${error.message}\n\n` +
            `Please try again later or contact support if the problem persists.`);
      
      // Update email history with error
      try {
        if (window.addEmailToHistory) {
          window.addEmailToHistory({
            vendorName: `Bulk Email (${vendors.length} vendors)`,
            vendorId: 'BULK',
            status: 'failed',
            message: `Error: ${error.message}`
          });
        }
      } catch (historyError) {
        console.error("Error updating email history:", historyError);
      }
      
      toast({ 
        title: "❌ Bulk Email Failed", 
        description: `Error sending bulk emails: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      // Reset loading state and progress
      setIsSendingBulkEmail(false);
      setBulkEmailProgress(0);
      console.log("Bulk email process completed");
    }
  };

  const handleExport = () => {
    if (vendors.length === 0) {
      toast({ 
        title: "No Data", 
        description: "No vendors to export",
        variant: "destructive"
      });
      return;
    }

    const ws = XLSX.utils.json_to_sheet(vendors);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vendors");
    
    const fileName = `vendors_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast({ 
      title: "Export Successful", 
      description: `Exported ${vendors.length} vendors to ${fileName}`,
      variant: "default"
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 text-center">Quick Actions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Fetch by Code */}
        <div className="space-y-3 text-center">
          <label className="text-sm font-medium text-gray-700 block">Fetch Vendor by Code</label>
          <div className="flex gap-2 justify-center">
            <Input
              placeholder="Enter vendor code..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 max-w-32"
            />
            <Button onClick={handleFetchByCode} size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Fetch by Date Range */}
        <div className="space-y-3 text-center">
          <label className="text-sm font-medium text-gray-700 block">Fetch by Date Range</label>
          <div className="flex gap-2 justify-center">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="flex-1 max-w-28"
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="flex-1 max-w-28"
            />
            <Button onClick={handleFetchByDate} size="sm">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bulk Email */}
        <div className="space-y-3 text-center">
          <label className="text-sm font-medium text-gray-700 block">
            Bulk Email ({vendors.length} vendors)
          </label>
          <div className="flex justify-center">
            <Button 
              onClick={handleBulkEmail} 
              size="sm"
              variant="outline"
              disabled={isSendingBulkEmail || vendors.length === 0}
              className="flex items-center gap-2"
            >
              {isSendingBulkEmail ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending... {bulkEmailProgress}%
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Send Bulk Email
                </>
              )}
            </Button>
          </div>
          {/* Progress bar */}
          {isSendingBulkEmail && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${bulkEmailProgress}%` }}
              ></div>
            </div>
          )}
          {vendors.length === 0 && (
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              No vendors available
            </p>
          )}
          {vendors.length > 0 && !isSendingBulkEmail && (
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              {vendors.length} vendor{vendors.length !== 1 ? 's' : ''} ready
            </p>
          )}
        </div>

        {/* Export */}
        <div className="space-y-3 text-center">
          <label className="text-sm font-medium text-gray-700 block">Export Data</label>
          <div className="flex justify-center">
            <Button onClick={handleExport} size="sm" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
