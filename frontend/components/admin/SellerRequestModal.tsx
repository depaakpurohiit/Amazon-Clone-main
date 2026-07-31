import { Button } from "@/components/ui/button";

interface SellerRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: {
    id: string;
    requesterName?: string;
    requesterEmail?: string;
    requesterNumber?: string;
    message: string;
    createdAt?: string;
    businessName?: string;
    bio?: string;
    logoUrl?: string;
  };
}

export default function SellerRequestModal({ isOpen, onClose, request }: SellerRequestModalProps) {
  if (!isOpen) return null;
  console.log("SellerRequestModal request:", request);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold text-slate-900">Business Profile</h3>
        
        {request.logoUrl && (
          <div className="mt-4 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={request.logoUrl} alt="Store Logo" className="h-24 w-24 object-cover rounded-full border border-slate-200" />
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Business Name</p>
            <p className="text-slate-900">{request.businessName || "Unknown"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Bio</p>
            <p className="text-slate-900">{request.bio || "No bio provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Contact Name</p>
            <p className="text-slate-900">{request.requesterName || "Unknown"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Email Address</p>
            <p className="text-slate-900">{request.requesterEmail || "Unknown"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Phone Number</p>
            <p className="text-slate-900">{request.requesterNumber || "Unknown"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Message to Admin</p>
            <p className="text-slate-900 bg-slate-50 p-3 rounded-xl mt-1 border border-slate-100">{request.message || "No message provided"}</p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={onClose}>Close Profile</Button>
        </div>
      </div>
    </div>
  );
}
