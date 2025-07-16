import { Button } from "@/components/ui/button";
import { toast } from "../components/ui/useToast";
import { Edit, Mail, MoreHorizontal, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function VendorTable({ vendors, onEdit }) {
  const [sendingEmails, setSendingEmails] = useState(new Set());

  const handleResendEmail = async (vendor) => {
    // Show confirmation alert
    const confirmed = window.confirm(
      `Are you sure you want to resend email to ${vendor.name} (${vendor.id})?\n\nThis will send a notification email to the vendor.`
    );
    
    if (!confirmed) {
      return;
    }

    // Add vendor to sending emails set
    setSendingEmails(prev => new Set(prev).add(vendor.id));
    
    // Add to email history as pending
    if (window.addEmailToHistory) {
      window.addEmailToHistory({
        vendorName: vendor.name,
        vendorId: vendor.id,
        status: 'pending',
        message: 'Email sending in progress...'
      });
    }
    
    try {
      // Show sending alert
      alert(`📧 Sending email to ${vendor.name}...`);
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        // Show success alert
        alert(`✅ Email sent successfully to ${vendor.name} (${vendor.id})`);
        
        // Update email history with success
        if (window.addEmailToHistory) {
          window.addEmailToHistory({
            vendorName: vendor.name,
            vendorId: vendor.id,
            status: 'success',
            message: 'Email sent successfully'
          });
        }
        
        toast({ 
          title: "✅ Email Sent Successfully", 
          description: `Email notification sent to ${vendor.name} (${vendor.id})`,
          variant: "default"
        });
      } else {
        // Show failure alert
        alert(`❌ Failed to send email to ${vendor.name}. Please try again.`);
        
        // Update email history with failure
        if (window.addEmailToHistory) {
          window.addEmailToHistory({
            vendorName: vendor.name,
            vendorId: vendor.id,
            status: 'failed',
            message: 'Email delivery failed'
          });
        }
        
        toast({ 
          title: "❌ Email Failed", 
          description: `Failed to send email to ${vendor.name}. Please try again.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      // Show error alert
      alert(`❌ Error sending email to ${vendor.name}: ${error.message}`);
      
      // Update email history with error
      if (window.addEmailToHistory) {
        window.addEmailToHistory({
          vendorName: vendor.name,
          vendorId: vendor.id,
          status: 'failed',
          message: `Error: ${error.message}`
        });
      }
      
      toast({ 
        title: "❌ Email Error", 
        description: `Error sending email to ${vendor.name}: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      // Remove vendor from sending emails set
      setSendingEmails(prev => {
        const newSet = new Set(prev);
        newSet.delete(vendor.id);
        return newSet;
      });
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Region
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vendors.map((vendor) => {
              const isSending = sendingEmails.has(vendor.id);
              
              return (
                <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vendor.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vendor.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {vendor.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vendor.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vendor.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      vendor.type === "SAP" ? "bg-purple-100 text-purple-800" : "bg-orange-100 text-orange-800"
                    }`}>
                      {vendor.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vendor.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vendor.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(vendor)}
                        className="h-8 w-8 p-0"
                        disabled={isSending}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      {/* Mobile dropdown for actions */}
                      <div className="sm:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={isSending}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(vendor)} disabled={isSending}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResendEmail(vendor)} disabled={isSending}>
                              {isSending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Mail className="mr-2 h-4 w-4" />
                              )}
                              {isSending ? "Sending..." : "Resend Email"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {/* Desktop button for email */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResendEmail(vendor)}
                        className="hidden sm:flex h-8"
                        disabled={isSending}
                      >
                        {isSending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Mail className="mr-2 h-4 w-4" />
                        )}
                        {isSending ? "Sending..." : "Resend Email"}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {vendors.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-sm">No vendors found</div>
        </div>
      )}
    </div>
  );
}
