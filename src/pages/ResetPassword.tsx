import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Mail, Phone, MapPin } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/Footer";
import LoadingOverlay from "@/components/LoadingOverlay";
import { toast } from "@/hooks/use-toast";
import { getApiBaseUrl, getApiBaseUrlSync } from '@/utils/config';

interface FormDataState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  securityQuestion: string;
  securityAnswer: string;
  userImage: string;
  userID?: string;
}

const ProfileSettings = () => {
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem("userTypeName");
  const [isLoading, setIsLoading] = useState(false);
const [isReloading, setIsReloading] = useState(false);
const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

const handleToggleHeader = () => {
  setIsHeaderCollapsed(!isHeaderCollapsed);
};
useEffect(() => {
  const handleBackButton = (event: PopStateEvent) => {
    event.preventDefault();
    setIsReloading(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  window.history.pushState(null, '', window.location.href);
  window.addEventListener('popstate', handleBackButton);
  
  return () => {
    window.removeEventListener('popstate', handleBackButton);
  };
}, []);

  const [profileImage, setProfileImage] = useState<string>(
    sessionStorage.getItem("userImage") || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormDataState>({
    firstName: (() => {
      const firstName = sessionStorage.getItem("firstName");
      return firstName || "";
    })(),
    lastName: (() => {
      const lastName = sessionStorage.getItem("lastName");
      console.log("LastName from session storage:", lastName, "Type:", typeof lastName, "Length:", lastName?.length);
      return lastName || "";
    })(),
    email: (() => {
      const email = sessionStorage.getItem("email");
      console.log("ProfileSettings: Email from session storage:", email, "Type:", typeof email, "Length:", email?.length);
      return email || "";
    })(),
    phone: (() => {
      const phone = sessionStorage.getItem("mobileNUM");
      console.log("Phone from session storage:", phone, "Type:", typeof phone, "Length:", phone?.length);
      return phone || "";
    })(),
    address: (() => {
      const address = sessionStorage.getItem("address");
      console.log("Address from session storage:", address);
      return address || "";
    })(),
    securityQuestion: (() => {
      const secretQuestion = sessionStorage.getItem("secretQuestion");
      console.log("Security question from session storage:", secretQuestion);
      return secretQuestion || "";
    })(),
    securityAnswer: (() => {
      const hintAnswer = sessionStorage.getItem("hintAnswer");
      console.log("Security answer from session storage:", hintAnswer);
      return hintAnswer || "";
    })(),
    userImage: (() => {
      const userImage = sessionStorage.getItem("userImage");
      return userImage || "profile.png";
    })(),
  });
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [isImageLoading, setIsImageLoading] = useState(true);
const isDefaultImage = (imagePath: string | null | undefined): boolean => {
  if (!imagePath) return true;
  const defaultImages = ['profile.png', 'default.png', 'avatar.png'];
  return defaultImages.some(img => imagePath.toLowerCase().includes(img.toLowerCase()));
};
const getProfileImageUrl = (imagePath: string | null): string | null => {
  // Return null for empty string, single space, or null
  if (!imagePath || imagePath.trim() === '' || imagePath.trim() === ' ') {
    return null;
  }
  
  const trimmedPath = imagePath.trim();
  
  // Check for the exact base URL patterns without any additional path
  if (trimmedPath === 'https://oxford-uat.excelindia.com/OUPI_RootRepository' || 
      trimmedPath === 'https://oxford-uat.excelindia.com/OUPI_RootRepository/' ||
      trimmedPath === 'https://oxfordignite.co.in/OA_RootRepository' ||
      trimmedPath === 'https://oxfordignite.co.in/OA_RootRepository/') {
    return null;
  }
  
  // Check if the path ends with just the base repository (no actual image file)
  if (trimmedPath.endsWith('/OUPI_RootRepository') || 
      trimmedPath.endsWith('/OA_RootRepository') ||
      trimmedPath.endsWith('/OUPI_RootRepository/') ||
      trimmedPath.endsWith('/OA_RootRepository/')) {
    return null;
  }
  
  // Check for default images
  if (isDefaultImage(imagePath)) {
    return null;
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's just a filename, construct the full URL
  const baseUrl = getApiBaseUrlSync();
  
  // Check if the path already includes the base URL to avoid duplication
  if (imagePath.includes(baseUrl)) {
    return imagePath;
  }
  
  // Handle different path formats
  if (imagePath.startsWith('uploads/') || imagePath.startsWith('/uploads/')) {
    return `${baseUrl}/oxfordigniteservice${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  }
  
  return `${baseUrl}/oxfordigniteservice/uploads/${imagePath}`;
};
  console.log("Initial formData:", formData);

  // Get user ID from session storage and store in form data
  useEffect(() => {
    const userId = sessionStorage.getItem("userID");
    if (userId) {
      setFormData(prev => ({
        ...prev,
        userID: userId
      }));

    }
  }, []);

  const fetchUserDetails = async () => {
  try {
    const userId = sessionStorage.getItem("userID");
    const token = sessionStorage.getItem("authToken");
    
    if (!userId || !token) {
      console.error("User ID or token not found in session storage");
      return;
    }

    console.log('Fetching user details...');
    const apiBaseUrl = await getApiBaseUrl();
    const response = await fetch(
      `${apiBaseUrl}/users/get-user-details/${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch user details: ${response.status}`);
    }

    const userData = await response.json();
    console.log('User data from API:', userData);
    console.log('User image path:', userData.photo1);

    // Update form data with user details
    setFormData(prev => ({
      ...prev,
      firstName: userData.firstName || prev.firstName,
      lastName: userData.lastName || prev.lastName,
      email: userData.email || prev.email,
      phone: userData.phoneNumber || userData.mobileNUM || prev.phone,
      address: userData.address || userData.addressLine1 || prev.address,
      securityQuestion: userData.securityQuestion || userData.secreatQuestion || prev.securityQuestion,
      securityAnswer: userData.securityAnswer || userData.hintAnswer || prev.securityAnswer,
      userImage: userData.photo1 || prev.userImage
    }));

    // Update profile image state
    if (userData.photo1) {
      console.log('Setting profile image:', userData.photo1);
      console.log('Resolved URL:', getProfileImageUrl(userData.photo1));
      setProfileImage(userData.photo1);
    } else {
      console.log('No profile image found or default image detected');
    }

  } catch (error) {
    console.error('Error in fetchUserDetails:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load user details. Please try again.",
    });
  } finally {
    setIsImageLoading(false);
  }
};

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showValidationErrorDialog, setShowValidationErrorDialog] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState("");
  const [fieldToFocus, setFieldToFocus] = useState<string>("");

  // Helper: validate a single field
  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "firstName":
        // First name is now mandatory
        if (!value.trim()) error = "First name is required.";
        else if (value.trim().length < 2) error = "First name must be at least 2 characters.";
        else if (value.trim().length > 60) error = "First name cannot exceed 60 characters.";
        break;
      case "lastName":
        // Add validation for last name length
        if (value.trim() && value.trim().length > 60) error = "Last name cannot exceed 60 characters.";
        break;
      case "email":
        // Optional: only validate if filled
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email format.";
        break;
      case "phone":
        // Optional: only validate if filled
        if (value.trim()) {
          // Remove all non-digit characters except +
          const cleanPhone = value.replace(/[^\d+]/g, "");
          
          console.log("Phone validation debug:", { original: value, cleanPhone });
          
          // Case 1: Indian format - 10 digits starting with 6,7,8,9 (no country code)
          // Case 2: International format - +country_code + exactly 10 digits
          const isValidIndian = /^[9876]\d{9}$/.test(cleanPhone);
          const isValidInternational = /^\+\d{1,3}\d{10}$/.test(cleanPhone);
          
          console.log("Phone validation results:", { isValidIndian, isValidInternational });
          
          // Additional check: ensure total length is correct for international format
          const isInternationalLengthValid = cleanPhone.match(/^\+(\d{1,3})(\d{10})$/);
          console.log("International length check:", isInternationalLengthValid);
          
          if (!isValidIndian && !isValidInternational) {
            error = "Phone number must be valid (e.g., 9876543210 or +(91)1234567890)";
          }
        }
        break;
      case "address":
        // Optional: only validate if filled
        if (value.trim() && value.trim().length < 10) error = "Address must be at least 10 characters.";
        break;
      case "securityQuestion":
        if (!value.trim()) error = "Security question is required.";
        break;
      case "securityAnswer":
        if (!value.trim()) error = "Security answer is required.";
        break;
      default:
        break;
    }
    return error;
  };

  // Validate all fields and show error dialog with field focus
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Check mandatory fields in order and show first error found
    if (!formData.firstName.trim()) {
      setValidationErrorMessage("First name is required. Please enter your User Name.");
      setFieldToFocus("firstName");
      setShowValidationErrorDialog(true);
      return false;
    }
    
    if (formData.firstName.trim().length < 2) {
      setValidationErrorMessage("First name must be at least 2 characters.");
      setFieldToFocus("firstName");
      setShowValidationErrorDialog(true);
      return false;
    }
    
    if (formData.firstName.trim().length > 60) {
      setValidationErrorMessage("First name cannot exceed 60 characters.");
      setFieldToFocus("firstName");
      setShowValidationErrorDialog(true);
      return false;
    }
    
    if (formData.lastName.trim() && formData.lastName.trim().length > 60) {
      setValidationErrorMessage("Last name cannot exceed 60 characters. Please enter a shorter last name.");
      setFieldToFocus("lastName");
      setShowValidationErrorDialog(true);
      return false;
    }
    
    if (!formData.securityQuestion) {
      setValidationErrorMessage("Security question is required. Please select a security question.");
      setFieldToFocus("securityQuestion");
      setShowValidationErrorDialog(true);
      return false;
    }
    
    if (!formData.securityAnswer.trim()) {
      setValidationErrorMessage("Security answer is required. Please provide an answer to your security question.");
      setFieldToFocus("securityAnswer");
      setShowValidationErrorDialog(true);
      return false;
    }
    
    // Optional fields validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setValidationErrorMessage("Invalid email format. Please enter a valid email address.");
      setFieldToFocus("email");
      setShowValidationErrorDialog(true);
      return false;
    }
    
    if (formData.phone) {
      // Remove all non-digit characters except +
      const cleanPhone = formData.phone.replace(/[^\d+]/g, "");
      
      // Case 1: Indian format - 10 digits starting with 6,7,8,9 (no country code)
      // Case 2: International format - +country_code + exactly 10 digits
      const isValidIndian = /^[9876]\d{9}$/.test(cleanPhone);
      const isValidInternational = /^\+\d{1,3}\d{10}$/.test(cleanPhone);
      
      if (!isValidIndian && !isValidInternational) {
        setValidationErrorMessage("Phone number must be valid (e.g., 9876543210 or +(91)1234567890). Please enter a valid phone number.");
        setFieldToFocus("phone");
        setShowValidationErrorDialog(true);
        return false;
      }
    }
    
    if (formData.address && formData.address.trim().length < 10) {
      setValidationErrorMessage("Address must be at least 10 characters. Please enter a complete address.");
      setFieldToFocus("address");
      setShowValidationErrorDialog(true);
      return false;
    }
    
    // Validate all other fields for completeness
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update form and clear field error on change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate phone number in real-time
    if (name === 'phone') {
      const error = validateField('phone', value);
      if (error) {
        setErrors((prev) => ({ ...prev, phone: error }));
      } else if (errors.phone) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.phone;
          return newErrors;
        });
      }
    } else {
      // Clear error for this field immediately
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  // Update security question dropdown and clear error
  const handleSecurityQuestionChange = (value: string) => {
    setFormData({ ...formData, securityQuestion: value });
    // Clear error for this field immediately
    if (errors.securityQuestion) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.securityQuestion;
        return newErrors;
      });
    }
  };
   
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // File type validation
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    toast({
      title: "Invalid file format",
      description: "Please upload only JPG, PNG, or GIF images.",
      variant: "destructive",
    });
    return;
  }

  // File size validation (2MB max)
  if (file.size > 2 * 1024 * 1024) {
    toast({
      title: "File too large",
      description: "Please select an image smaller than 2MB.",
      variant: "destructive",
    });
    return;
  }

  // Create a preview URL for the image
  const imageUrl = URL.createObjectURL(file);
  
  // Update state with the new image
   setProfileImage(imageUrl);
  setFormData(prev => ({
    ...prev,
    userImage: imageUrl
  }));


  // Store the file reference for later upload
  setSelectedFile(file);
  setFileInputKey(prev => prev + 1);

};

const handleSave = async () => {
  try {
    setIsSaving(true);
    
    // Validate form first
    if (!validateForm()) {
      setIsSaving(false);
      return;
    }

    // Call get-user-details API to verify security question and answer
    const apiBaseUrl = await getApiBaseUrl();
    const response = await fetch(
      `${apiBaseUrl}/users/get-user-details/${formData.firstName.trim()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('User not found. Please check your username.');
    }

    const userData = await response.json();
    
    // Verify security question and answer
    if (userData.securityQuestion !== formData.securityQuestion.trim()) {
      toast({
        variant: "destructive",
        title: "Security Question Mismatch",
        description: "The security question does not match our records.",
      });
      setIsSaving(false);
      return;
    }

    if (userData.securityAnswer !== formData.securityAnswer.trim()) {
      toast({
        variant: "destructive",
        title: "Security Answer Mismatch", 
        description: "The security answer does not match our records.",
      });
      setIsSaving(false);
      return;
    }

    // Store user data for password reset
    sessionStorage.setItem('resetPasswordUserId', userData.userID);
    sessionStorage.setItem('resetPasswordUsername', formData.firstName.trim());
    
    // Navigate to new password page
    navigate('/new-password');

  } catch (error) {
    console.error("Error verifying user details:", error);
    toast({
      variant: "destructive",
      title: "Verification Failed",
      description: error instanceof Error ? error.message : "Failed to verify user details. Please try again.",
    });
  } finally {
    setIsSaving(false);
  }
};
const handleLogout = () => {
  sessionStorage.clear();
  localStorage.removeItem("userRole");
  navigate("/");
};

// 4. Fix the Avatar component in the JSX
<Avatar className="h-32 w-32 relative group">
  <AvatarImage
    src={profileImage || formData.userImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher"}
    alt={`${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'User'}
    onError={(e) => {
      console.error('Failed to load profile image:', profileImage || formData.userImage);
      e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher";
    }}
    className="object-cover w-full h-full"
  />
  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
    {formData.firstName?.[0]}{formData.lastName?.[0] || 'U'}
  </AvatarFallback>
</Avatar>
  return (
    <div className="min-h-screen flex flex-col">
          <LoadingOverlay isLoading={isReloading} message="Reloading..." />
      <Header 
        onLogout={handleLogout} 
        isHeaderCollapsed={isHeaderCollapsed}
        onToggleHeader={handleToggleHeader}
      />
      <div className="container max-w-4xl mx-auto p-2 space-y-2 flex-1">
      
        <Card> 
             <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <span className="w-10 h-10 bg-white text-blue-500 rounded-full flex items-center justify-center text-lg border-2 border-blue-500">&lt;</span> Reset Password
            </CardTitle>
          </CardHeader> 
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p>Enter Valid User Name</p>
                <Label htmlFor="firstName">User Name <span className="text-destructive">*</span></Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  maxLength={60}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName}</p>
                )}
              </div>
               </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Password Reset</CardTitle>
            <CardDescription>Reset Password using security question</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="securityQuestion">
                  Select Security Question <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.securityQuestion}
                  onValueChange={handleSecurityQuestionChange}
                >
                  <SelectTrigger id="securityQuestion">
                    <SelectValue placeholder="Select a question" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Your favorite color?">
                      Your favorite color?
                    </SelectItem>
                    <SelectItem value="What was your first pet?">
                      What was your first pet?
                    </SelectItem>
                    <SelectItem value="What is your library card number?">
                      What is your library card number?
                    </SelectItem>
                    <SelectItem value="What is your mother's maiden name?">
                      What is your mother's maiden name?
                    </SelectItem>
                    <SelectItem value="What was the name of your first pet?">
                      What was the name of your first pet?
                    </SelectItem>
                    <SelectItem value="What city were you born in?">
                      What city were you born in?
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.securityQuestion && (
                  <p className="text-sm text-destructive">{errors.securityQuestion}</p>
                )}
              </div>

             
            </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-2">
                <Label htmlFor="securityAnswer">
                  Select Answer <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="securityAnswer"
                  name="securityAnswer"
                  value={formData.securityAnswer}
                  onChange={handleInputChange}
                  placeholder="Enter your answer"
                />
                {errors.securityAnswer && (
                  <p className="text-sm text-destructive">{errors.securityAnswer}</p>
                )}
              </div>
                </div>
            <p className="text-sm text-muted-foreground">
              Fields marked with '<span className="text-destructive">*</span>' are mandatory
            </p>
          </CardContent>
        </Card>

        <Separator />

       <div className="flex justify-end gap-4 pb-8">
          <Button variant="outline" onClick={() => navigate('/login')}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Continue
          </Button>
         </div> 
      </div>
      
      {/* Validation Error Dialog */}
      {showValidationErrorDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{validationErrorMessage}</h3>
              {/* <p className="text-sm text-gray-500 mb-6">Please correct the errors and try again.</p> */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => {
                    setShowValidationErrorDialog(false);
                    // Focus on the specific field that has error
                    setTimeout(() => {
                      const fieldElement = document.getElementById(fieldToFocus);
                      if (fieldElement) {
                        fieldElement.focus();
                      }
                    }, 100);
                  }}
                >
                  OK
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProfileSettings;
