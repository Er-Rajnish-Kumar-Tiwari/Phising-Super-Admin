import * as React from "react";
import { POST } from "@/lib/AxiosClient";
import { X, Upload } from "lucide-react";
import * as ROUTES from "../../src/service/routes"

interface SupportTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (ticketData: TicketFormData) => void;
    isUpdate?: boolean;
    supportData?: { _id: string; title?: string; description?: string };
}

interface TicketFormData {
    title: string;
    description: string;
    files?: File[]; // changed from file?: File
}

// Submit support ticket function
export const submitSupportTicket = async (data: TicketFormData, _id: string) => {
    try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('userId', _id); // Use 'userId' instead of '_id'
        
        if (data.files && data.files.length > 0) {
    data.files.forEach(file => {
        formData.append('attachments', file); // Key name should match what your backend expects
    });
}


        console.log('Submitting ticket with data:', {
            title: data.title,
            description: data.description,
            userId: _id,
            hasFile: !!data.file
        });

        const response = await POST({
            url: `${ROUTES.AUTH_URL}/support-tickets`,
            data: formData,
            headers: {
                // Let the browser set Content-Type for FormData
            }
        });

        console.log('Ticket submission response:', response);
        return response;
    } catch (error) {
        console.error('Error submitting support ticket:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        throw error;
    }
};

export const SupportTicketModal: React.FC<SupportTicketModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isUpdate = false,
    supportData
}) => {
    // Fixed: Removed _id from formData state - it doesn't belong there
    const [formData, setFormData] = React.useState<TicketFormData>({
    title: "",
    description: "",
    files: []
});
    const [isDragging, setIsDragging] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Reset form when modal opens/closes
    React.useEffect(() => {
        if (isOpen && !isUpdate) {
            setFormData({
                title: "",
                description: "",
                file: null
            });
        }
    }, [isOpen, isUpdate]);

    // Populate form data when updating
    React.useEffect(() => {
        if (isUpdate && supportData && isOpen) {
            setFormData(prev => ({
                ...prev,
                title: supportData.title || "",
                description: supportData.description || "",
                file: null // Reset file for updates
            }));
        }
    }, [isUpdate, supportData, isOpen]);

    // Reset form when modal is closed
    React.useEffect(() => {
        if (!isOpen) {
            setFormData({
                title: "",
                description: "",
                file: null
            });
        }
    }, [isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

   const handleFileSelect = (selectedFiles: FileList) => {
    const allowedTypes = [
        'image/jpeg', 
        'image/png', 
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'text/plain'
    ];

    const newFiles: File[] = Array.from(selectedFiles).filter(file => {
        if (file.size > 10 * 1024 * 1024) {
            alert(`"${file.name}" exceeds the 10MB size limit.`);
            return false;
        }

        if (!allowedTypes.includes(file.type)) {
            alert(`"${file.name}" is not an allowed file type.`);
            return false;
        }

        return true;
    });

    setFormData(prev => ({
        ...prev,
        files: [...(prev.files || []), ...newFiles]
    }));
};

const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
        handleFileSelect(e.target.files);
    }
};


    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files?.length) {
        handleFileSelect(files);
    }
};


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.description.trim()) {
            alert("Please fill in all required fields");
            return;
        }

        // Get _id from supportData (for updates) or localStorage (for new tickets)
        const userId = supportData?._id || localStorage.getItem("user");
        
        console.log('Getting userId:', {
            supportDataId: supportData?._id,
            localStorageUser: localStorage.getItem("user"),
            finalUserId: userId
        });

        if (!userId) {
            alert("User ID is required. Please log in again.");
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await submitSupportTicket(formData, userId);
            
            if (onSubmit) {
                onSubmit(formData);
            }
            
            console.log("Support ticket submitted successfully:", result);
            alert("Support ticket submitted successfully!");
            onClose();
        } catch (error) {
            console.error('Error submitting ticket:', error);
            
            // More detailed error handling
            let errorMessage = 'Failed to submit support ticket. Please try again.';
            
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null) {
                // Handle API error responses
                const apiError = error as any;
                if (apiError.response?.data?.message) {
                    errorMessage = apiError.response.data.message;
                } else if (apiError.message) {
                    errorMessage = apiError.message;
                }
            }
            
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    const removeFile = () => {
        setFormData(prev => ({
            ...prev,
            file: null
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    if (!isOpen) return null;

    const modalTitle = isUpdate ? "Update Support Ticket" : "Raise a Support Ticket";
    const submitButtonText = isUpdate ? "Update Ticket" : "Submit Ticket";

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Modal */}
                <div 
                    className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {modalTitle}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Title Field */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Brief description of your issue"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Description Field */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Please provide detailed information about your issue..."
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                required
                            />
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Attach File (Optional)
                            </label>
                            
                          {!formData.files || formData.files.length === 0 ? (
    <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
    >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 mb-1">Click to upload files</p>
        <p className="text-xs text-gray-500">Max 10MB each (JPG, PNG, PDF, DOC, TXT)</p>
    </div>
) : (
    <div className="space-y-2">
        {formData.files.map((file, index) => (
            <div
                key={index}
                className="border border-gray-300 rounded-lg p-3 flex items-center justify-between bg-gray-50"
            >
                <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-700">{file.name}</div>
                    <div className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(1)} MB)
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        ))}
    </div>
)}
                            
                            <input
    ref={fileInputRef}
    type="file"
    onChange={handleFileInputChange}
    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
    className="hidden"
    multiple
/>

                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        {isUpdate ? "Updating..." : "Submitting..."}
                                    </>
                                ) : (
                                    submitButtonText
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};