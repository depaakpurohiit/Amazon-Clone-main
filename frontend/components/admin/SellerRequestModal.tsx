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
  };
}

export default function SellerRequestModal({ isOpen, onClose, request }: SellerRequestModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-slate-900">Business Profile</h3>
        
        <div className="mt-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Name</p>
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
