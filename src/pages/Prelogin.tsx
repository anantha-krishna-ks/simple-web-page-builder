import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Mail, Phone, MapPin, Lock, Shield } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getApiBaseUrl } from '@/utils/config';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/Footer";
import LoadingOverlay from "@/components/LoadingOverlay";
import { toast } from "@/hooks/use-toast";

const Prelogin = () => {
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem("userTypeName");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("https://api.dicebear.com/7.x/avataaars/svg?seed=teacher");
    const [isReloading, setIsReloading] = useState(false);
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
  // // Handle browser back button
  // useEffect(() => {
  //   const handleBackButton = (event: PopStateEvent) => {
  //     // Prevent default back navigation
  //     event.preventDefault();
      
  //     // Show loading state
  //     setIsReloading(true);
      
  //     // Force a page reload after a short delay
  //     const timer = setTimeout(() => {
  //       window.location.reload();
  //     }, 500);
      
  //     return () => clearTimeout(timer);
  //   };

  //   // Add a new entry to the history stack
  //   window.history.pushState(null, '', window.location.href);
    
  //   // Add event listener
  //   window.addEventListener('popstate', handleBackButton);
    
  //   // Clean up
  //   return () => {
  //     window.removeEventListener('popstate', handleBackButton);
  //   };
  // }, []);

  // Get login response data from session storage
  const [loginResponse, setLoginResponse] = useState(() => {
    const stored = sessionStorage.getItem("loginResponse");
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogout = () => {
    // Clear all session storage data
    // Clear localStorage as well
    localStorage.removeItem("userRole");
    
    // Navigate to login page
    navigate("/");
  };

  useEffect(() => {
    if (!userRole) {
      navigate("/");
    }
    
    // Debug: Log session storage contents
    const loginData = JSON.parse(sessionStorage.getItem("loginResponse") || "{}");
    const separateUserId = sessionStorage.getItem("userID");
    console.log("Session storage loginResponse:", loginData);
    console.log("Available userId fields:", {
      userId: loginData.userId,
      id: loginData.id,
      userID: loginData.userID,
      separateUserId: separateUserId
    });
    console.log("Username field:", loginData.username);
    console.log("Password field:", loginData.password);
    
    // Fetch user details to get passwordHash
    fetchUserDetails();
  }, [userRole, navigate]);
  
  const [formData, setFormData] = useState({
    Password:"",
    ConfirmPassword:"",
    firstName: (() => {
      const firstName = sessionStorage.getItem("firstName");
      return firstName || " ";
    })(),
    lastName: (() => {
      const lastName = sessionStorage.getItem("lastName");
      return lastName || " ";
    })(),
    email: userRole === "teacher" ? "sarah.johnson@school.edu" : "student@school.edu",
    phone: "+1 (555) 123-4567",
    address: "123 Education Street, Learning City, LC 12345",
    securityQuestion: "",
    securityAnswer: "",
    agreeTerms: false,
  });

  const [passwordError, setPasswordError] = useState<string>("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsStartTime, setTermsStartTime] = useState<number>(0);
  const [passwordHash, setPasswordHash] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showUpdateConfirmDialog, setShowUpdateConfirmDialog] = useState(false);
  const [showValidationErrorDialog, setShowValidationErrorDialog] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState("");
  const [fieldToFocus, setFieldToFocus] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<{
    securityQuestion?: string;
    securityAnswer?: string;
    agreeTerms?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // Validate fields and show error dialog with field focus
  const validateFields = () => {
    console.log("validateFields called");
    
    // Call validatePasswords to check password validation
    const isPasswordValid = validatePasswords();
    if (!isPasswordValid) {
      console.log("Password validation failed");
      setValidationErrorMessage("Password validation failed. Please check your passwords.");
      setFieldToFocus("newPassword");
      setShowValidationErrorDialog(true);
      return false;
    }
    
    const newPassword = (document.getElementById("newPassword") as HTMLInputElement)?.value;
    const confirmNewPassword = (document.getElementById("confirmNewPassword") as HTMLInputElement)?.value;
    const errors: typeof fieldErrors = {};
    
    if (loginResponse?.isAgreeTermsAndCondition === 0 && loginResponse?.allowPasswordChange === 0) {
      // Only security fields required
      if (!formData.securityQuestion) {
        errors.securityQuestion = "Security question is required";
        setValidationErrorMessage("Security question is required. Please select a security question.");
        setFieldToFocus("securityQuestion");
        setShowValidationErrorDialog(true);
        return false;
      }
      if (!formData.securityAnswer) {
        errors.securityAnswer = "Security answer is required";
        setValidationErrorMessage("Security answer is required. Please provide an answer to your security question.");
        setFieldToFocus("securityAnswer");
        setShowValidationErrorDialog(true);
        return false;
      }
      if (!formData.agreeTerms) {
        errors.agreeTerms = "You must agree to terms and conditions";
        setValidationErrorMessage("You must agree to the terms and conditions. Please check the checkbox.");
        setFieldToFocus("agreeTerms");
        setShowValidationErrorDialog(true);
        return false;
      }
    } else if (loginResponse?.isAgreeTermsAndCondition === 0 && loginResponse?.allowPasswordChange === 1) {
      // All fields required
      if (!formData.securityQuestion) {
        errors.securityQuestion = "Security question is required";
        setValidationErrorMessage("Security question is required. Please select a security question.");
        setFieldToFocus("securityQuestion");
        setShowValidationErrorDialog(true);
        return false;
      }
      if (!formData.securityAnswer) {
        errors.securityAnswer = "Security answer is required";
        setValidationErrorMessage("Security answer is required. Please provide an answer to your security question.");
        setFieldToFocus("securityAnswer");
        setShowValidationErrorDialog(true);
        return false;
      }
      if (!formData.agreeTerms) {
        errors.agreeTerms = "You must agree to terms and conditions";
        setValidationErrorMessage("You must agree to the terms and conditions. Please check the checkbox.");
        setFieldToFocus("agreeTerms");
        setShowValidationErrorDialog(true);
        return false;
      }
      if (!newPassword) {
        errors.newPassword = "New password is required";
        setValidationErrorMessage("New password is required. Please enter a new password.");
        setFieldToFocus("newPassword");
        setShowValidationErrorDialog(true);
        return false;
      }
      if (!confirmNewPassword) {
        errors.confirmPassword = "Confirm password is required";
        setValidationErrorMessage("Confirm password is required. Please confirm your new password.");
        setFieldToFocus("confirmNewPassword");
        setShowValidationErrorDialog(true);
        return false;
      } else if (newPassword !== confirmNewPassword) {
        errors.confirmPassword = "Passwords do not match";
        setValidationErrorMessage("Passwords do not match. Please make sure both passwords are the same.");
        setFieldToFocus("confirmNewPassword");
        setShowValidationErrorDialog(true);
        return false;
      }
    } else if (loginResponse?.isAgreeTermsAndCondition === 1) {
      // All fields required
      if (!formData.securityQuestion) {
        errors.securityQuestion = "Security question is required";
        setValidationErrorMessage("Security question is required. Please select a security question.");
        setFieldToFocus("securityQuestion");
        setShowValidationErrorDialog(true);
        return false;
      }
      if (!formData.securityAnswer) {
        errors.securityAnswer = "Security answer is required";
        setValidationErrorMessage("Security answer is required. Please provide an answer to your security question.");
        setFieldToFocus("securityAnswer");
        setShowValidationErrorDialog(true);
        return false;
      }
      if (!formData.agreeTerms) {
        errors.agreeTerms = "You must agree to terms and conditions";
        setValidationErrorMessage("You must agree to the terms and conditions. Please check the checkbox.");
        setFieldToFocus("agreeTerms");
        setShowValidationErrorDialog(true);
        return false;
      }
      if (!newPassword) {
        errors.newPassword = "New password is required";
        setValidationErrorMessage("New password is required. Please enter a new password.");
        setFieldToFocus("newPassword");
        setShowValidationErrorDialog(true);
        return false;
      }
      if (!confirmNewPassword) {
        errors.confirmPassword = "Confirm password is required";
        setValidationErrorMessage("Confirm password is required. Please confirm your new password.");
        setFieldToFocus("confirmNewPassword");
        setShowValidationErrorDialog(true);
        return false;
      } else if (newPassword !== confirmNewPassword) {
        errors.confirmPassword = "Passwords do not match";
        setValidationErrorMessage("Passwords do not match. Please make sure both passwords are the same.");
        setFieldToFocus("confirmNewPassword");
        setShowValidationErrorDialog(true);
        return false;
      }
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Check if all required fields are filled
  const areAllFieldsFilled = () => {
    const newPassword = (document.getElementById("newPassword") as HTMLInputElement)?.value;
    const confirmNewPassword = (document.getElementById("confirmNewPassword") as HTMLInputElement)?.value;
    
    console.log("areAllFieldsFilled check:", {
      isAgreeTermsAndCondition: loginResponse?.isAgreeTermsAndCondition,
      allowPasswordChange: loginResponse?.allowPasswordChange,
      securityQuestion: formData.securityQuestion,
      securityAnswer: formData.securityAnswer,
      agreeTerms: formData.agreeTerms,
      newPassword,
      confirmNewPassword,
      passwordsMatch: newPassword === confirmNewPassword
    });
    
    if (loginResponse?.isAgreeTermsAndCondition === 0 && loginResponse?.allowPasswordChange === 0) {
      // Only security fields when both are 0 (password fields are hidden)
      const result = (
        formData.securityQuestion &&
        formData.securityAnswer &&
        formData.agreeTerms
      );
      console.log("Both 0 - only security fields required - result:", result);
      return result;
    } else if (loginResponse?.isAgreeTermsAndCondition === 0 && loginResponse?.allowPasswordChange === 1) {
      // Both security and password fields when both are visible
      const result = (
        formData.securityQuestion &&
        formData.securityAnswer &&
        formData.agreeTerms &&
        newPassword &&
        confirmNewPassword &&
        newPassword === confirmNewPassword
      );
      console.log("0 and 1 - all fields required - result:", result);
      return result;
    } else if (loginResponse?.isAgreeTermsAndCondition === 1) {
      // All fields when isAgreeTermsAndCondition is 1
      const result = (
        formData.securityQuestion &&
        formData.securityAnswer &&
        formData.agreeTerms &&
        newPassword &&
        confirmNewPassword &&
        newPassword === confirmNewPassword
      );
      console.log("isAgreeTermsAndCondition is 1 - all fields required - result:", result);
      return result;
    }
    console.log("No condition matched - returning false");
    return false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };
    setFormData(newFormData);
    
    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // Special logging for checkbox
    if (name === "agreeTerms") {
      console.log("Checkbox changed:", { name, checked, newFormData });
    }
    
    console.log("Form updated:", { name, value, type, checked, newFormData });

    // Clear password error when user types in either password field
    if (name === "newPassword" || name === "confirmNewPassword") {
      setPasswordError("");
    }
  };

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      // Get userId from session storage (same logic as handleSave)
      const loginData = JSON.parse(sessionStorage.getItem("loginResponse") || "{}");
      const separateUserId = sessionStorage.getItem("userID");
      const userId = separateUserId || loginData.userId || loginData.id || loginData.userID;
      
      console.log("FetchUserDetails - Session storage data:", loginData);
      console.log("FetchUserDetails - Separate userID:", separateUserId);
      console.log("Fetching details for userId:", userId);
      
      if (!userId) {
        console.error('User ID not found in session storage');
        return;
      }
      
      const apiBaseUrl = await getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/login/details/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      
      const data = await response.json();
      setPasswordHash(data.passwordHash || "");
      
      // Store in session storage as backup
      sessionStorage.setItem('userDetails', JSON.stringify(data));
      console.log('User details fetched:', data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast({
        title: "Error",
        description: "Failed to load user details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePasswords = () => {
    console.log("validatePasswords function called!");
    const newPassword = (document.getElementById("newPassword") as HTMLInputElement)?.value;
    const confirmNewPassword = (document.getElementById("confirmNewPassword") as HTMLInputElement)?.value;
    
    // Debug: Print both passwords
    console.log("Current password from API:", loginResponse?.password);
    console.log("New password entered:", newPassword);
    console.log("Confirm password entered:", confirmNewPassword);
    
    if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
      setPasswordError("New password and confirm password do not match");
      return false;
    }
    
    // Check if new password is same as current password
    if (newPassword && loginResponse?.password && newPassword === loginResponse.password) {
      setPasswordError("New password cannot be the same as current password");
      return false;
    }
    
    setPasswordError("");
    return true;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 2MB.",
          variant: "destructive",
        });
        return;
      }
    
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        toast({
          title: "Image Updated",
          description: "Your profile picture has been updated.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    console.log("handleSave called");
    console.log("Current form data:", formData);
    console.log("Login response:", loginResponse);
    
    // Validate fields and show inline errors
    const isValid = validateFields();
    if (!isValid) {
      return;
    }
    
    // If allowPasswordChange is 0, no password validation needed
    if (loginResponse?.allowPasswordChange !== 0) {
      // For password change section
      const newPassword = (document.getElementById("newPassword") as HTMLInputElement)?.value;
      const confirmNewPassword = (document.getElementById("confirmNewPassword") as HTMLInputElement)?.value;
      
      if (!newPassword || !confirmNewPassword) {
        toast({
          title: "Missing Password",
          description: "Please fill in both password fields.",
          variant: "destructive",
        });
        return;
      }
      
      if (newPassword !== confirmNewPassword) {
        toast({
          title: "Password Mismatch",
          description: "New password and confirm password do not match.",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      // Get user ID from session storage (check multiple sources)
      const loginData = JSON.parse(sessionStorage.getItem("loginResponse") || "{}");
      const separateUserId = sessionStorage.getItem("userID");
      
      const userId = separateUserId || loginData.userId || loginData.id || loginData.userID;
      
      console.log("HandleSave - Session storage data:", loginData);
      console.log("HandleSave - Separate userID:", separateUserId);
      console.log("HandleSave - Extracted userId:", userId);
      
      if (!userId) {
        toast({
          title: "Error",
          description: "User ID not found. Please login again.",
          variant: "destructive",
        });
        return;
      }
      
      // Prepare data for API (matching expected format)
      const newPassword = loginResponse?.allowPasswordChange === 0 
        ? loginData.password || loginData.Password || "" 
        : (document.getElementById("newPassword") as HTMLInputElement)?.value || "";
      const confirmPassword = loginResponse?.allowPasswordChange === 0 
        ? newPassword 
        : (document.getElementById("confirmNewPassword") as HTMLInputElement)?.value || "";
      
      const apiData = {
        loginName: loginData.username || loginData.loginName || "",
        password: newPassword,
        secretQuestion: formData.securityQuestion,
        hintAnswer: formData.securityAnswer,
        userID: parseInt(userId),
        oldPassword: loginData.password || loginData.Password || "",
        isReadEULA: formData.agreeTerms
      };
      
      console.log("Sending data to API:", apiData);
      
      // Call API
      const apiBaseUrl = await getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/login/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log("API Response:", result);
        
        // Check API status
        if (result.status === "U001") {
          // Show confirmation dialog and navigate to login
          const updatedData = {
            ...loginResponse,
            securityQuestion: formData.securityQuestion,
            securityAnswer: formData.securityAnswer,
            Password: newPassword,
            ConfirmPassword: confirmPassword,
            agreeTerms: formData.agreeTerms,
            isAgreeTermsAndCondition: formData.agreeTerms ? 1 : 0,
            updatedAt: new Date().toISOString()
          };
          
          sessionStorage.setItem("loginResponse", JSON.stringify(updatedData));
          setLoginResponse(updatedData);
          
          // Show confirmation dialog
          setShowUpdateConfirmDialog(true);
          return;
        }
        
        // Handle other statuses or existing logic
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
        
        // Check login API again to get updated flags
        try {
          const apiBaseUrl = await getApiBaseUrl();
          const loginCheckResponse = await fetch(`${apiBaseUrl}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              username: loginData.username, 
              password: newPassword 
            }),
          });
          
          if (loginCheckResponse.ok) {
            const updatedLoginData = await loginCheckResponse.json();
            console.log("Updated login data:", updatedLoginData);
            
            // Update session storage with new login data
            const enhancedUpdatedData = {
              ...updatedLoginData,
              username: loginData.username,
              password: newPassword
            };
            sessionStorage.setItem("loginResponse", JSON.stringify(enhancedUpdatedData));
            setLoginResponse(enhancedUpdatedData);
            
            // Check navigation conditions
            const { isAgreeTermsAndCondition, allowPasswordChange } = updatedLoginData;
            console.log("Navigation check after update:", { isAgreeTermsAndCondition, allowPasswordChange });
            
            if (isAgreeTermsAndCondition === 1 && allowPasswordChange === 1) {
              // Both are 1 - navigate to chapters
              console.log("Both conditions are 1 after update, navigating to chapters");
              navigate("/chapters");
              return;
            } else if (isAgreeTermsAndCondition === 0 && allowPasswordChange === 0) {
              // Both are 0 - show confirmation dialog and go to login (security only + checkbox)
              console.log("Both conditions are 0, showing confirmation dialog");
              setShowUpdateConfirmDialog(true);
              return;
            } else if (isAgreeTermsAndCondition === 0 && allowPasswordChange === 1) {
              // isAgreeTermsAndCondition is 0 and allowPasswordChange is 1 - show confirmation dialog and go to login (both sections)
              console.log("isAgreeTermsAndCondition is 0 and allowPasswordChange is 1, showing confirmation dialog");
              setShowUpdateConfirmDialog(true);
              return;
            } else if (isAgreeTermsAndCondition === 0) {
              // isAgreeTermsAndCondition is 0 - show confirmation dialog and go to login
              console.log("isAgreeTermsAndCondition is 0, showing confirmation dialog");
              setShowUpdateConfirmDialog(true);
              return;
            }
            
            // Fallback: if none of the above conditions match, navigate to chapters
            console.log("No specific condition matched, navigating to chapters");
            navigate("/chapters");
          }
        } catch (loginCheckError) {
          console.error("Error checking updated login status:", loginCheckError);
        }
        
        // Update loginResponse with new values (fallback)
        const updatedData = {
          ...loginResponse,
          securityQuestion: formData.securityQuestion,
          securityAnswer: formData.securityAnswer,
          Password: newPassword,
          ConfirmPassword: confirmPassword,
          agreeTerms: formData.agreeTerms,
          isAgreeTermsAndCondition: formData.agreeTerms ? 1 : 0,
          updatedAt: new Date().toISOString()
        };
        
        sessionStorage.setItem("loginResponse", JSON.stringify(updatedData));
        setLoginResponse(updatedData);
        
        // Navigate based on isAgreeTermsAndCondition
        if (loginResponse?.isAgreeTermsAndCondition === 0) {
          console.log("isAgreeTermsAndCondition is 0, showing confirmation dialog");
          setShowUpdateConfirmDialog(true);
          return;
        }
        
        // Update form data with saved values
        setFormData(prev => ({
          ...prev,
          ...updatedData
        }));
        
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
        
        console.log("Saved data:", updatedData);
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        toast({
          title: "Update Failed",
          description: errorData.message || "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-y-auto">
          <LoadingOverlay isLoading={isReloading} message="Reloading..." />
      <Header pageType="prelogin" isAgreeTermsAndCondition={loginResponse?.isAgreeTermsAndCondition} onLogout={handleLogout} />
      <div className="flex-1">
        <div className="container max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          {/* <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-5 w-5 text-primary" />
          </div> */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {loginResponse?.isAgreeTermsAndCondition === 0 ? "EULA Acceptance" : "Change Password"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {loginResponse?.isAgreeTermsAndCondition === 0 
                ? "Please complete the security verification and accept terms" 
                : "Update your password and security settings"
              }
            </p>
          </div>
        </div>

{/* Security Settings - Show if isAgreeTermsAndCondition is 0 */}
        {loginResponse?.isAgreeTermsAndCondition === 0 && (
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Password Recovery Security</CardTitle>
              </div>
              <CardDescription>
                Set up a security question to help recover your account if you forget your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="securityQuestion">
                    Select Security Question <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.securityQuestion}
                    onValueChange={(value) => {
                      const newFormData = { ...formData, securityQuestion: value };
                      setFormData(newFormData);
                      console.log("Security question updated:", { value, newFormData });
                      // Clear error when user selects
                      if (fieldErrors.securityQuestion) {
                        setFieldErrors(prev => ({ ...prev, securityQuestion: undefined }));
                      }
                    }}
                  >
                    <SelectTrigger id="securityQuestion" className={fieldErrors.securityQuestion ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select security question" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="What was your first pet?">
                        What was your first pet?
                      </SelectItem>
                      <SelectItem value="What is your mother's maiden name?">
                        What is your mother's maiden name?
                      </SelectItem>
                      <SelectItem value="What was the name of your first school?">
                        What was the name of your first school?
                      </SelectItem>
                      <SelectItem value="What is your favorite food?">
                        What is your favorite food?
                      </SelectItem>
                      <SelectItem value="What city were you born in?">
                        What city were you born in?
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldErrors.securityQuestion && (
                    <p className="text-sm text-red-500 mt-1">{fieldErrors.securityQuestion}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="securityAnswer">
                    Security Answer <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="securityAnswer"
                    name="securityAnswer"
                    value={formData.securityAnswer}
                    onChange={handleInputChange}
                    placeholder="  "
                    className={fieldErrors.securityAnswer ? "border-red-500" : ""}
                  />
                  {fieldErrors.securityAnswer && (
                    <p className="text-sm text-red-500">{fieldErrors.securityAnswer}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                />
                <Label htmlFor="agreeTerms" className="text-sm text-muted-foreground">
                  I agree to the <a 
                    href="#" 
                    className="text-primary hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTermsModal(true);
                    }}
                  >
                    Terms and Conditions
                  </a>
                </Label>
              </div>
              {fieldErrors.agreeTerms && (
                <p className="text-sm text-red-500 mt-2">{fieldErrors.agreeTerms}</p>
              )}
            </CardContent>
          </Card>
        )}
       
        {/* Password Change - Show if allowPasswordChange is 1 */}
        {loginResponse?.allowPasswordChange === 1 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Update Password</CardTitle>
              <CardDescription>
                Please provide your current password and choose a new password. Make sure your new password is at least 8 characters long.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">
                  Current Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={loginResponse?.password || "••••••••••••"}
                  readOnly
                  placeholder={loading ? "Loading..." : "Current password (hidden for security)"}
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">
                  New Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  onChange={handleInputChange}
                  className={fieldErrors.newPassword ? "border-red-500" : ""}
                />
                {fieldErrors.newPassword && (
                  <p className="text-sm text-red-500">{fieldErrors.newPassword}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">
                  Confirm New Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  placeholder="Confirm new password"
                  onChange={handleInputChange}
                  className={fieldErrors.confirmPassword ? "border-red-500" : ""}
                />
                {fieldErrors.confirmPassword && (
                  <p className="text-sm text-red-500">{fieldErrors.confirmPassword}</p>
                )}
              </div>
              
              {/* Password validation error display */}
              {passwordError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{passwordError}</p>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground">
                Fields marked with '<span className="text-destructive">*</span>' are mandatory
              </p>
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* Display Saved Data */}
        {loginResponse?.updatedAt && (
          <Card>
            <CardHeader>
              <CardTitle>Saved Profile Data</CardTitle>
              <CardDescription>Your recently updated information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Security Question</Label>
                  <p className="text-sm text-muted-foreground">
                    {loginResponse.securityQuestion || "Not set"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Security Answer</Label>
                  <p className="text-sm text-muted-foreground">
                    {loginResponse.securityAnswer ? "••••••••" : "Not set"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Terms Accepted</Label>
                  <p className="text-sm text-muted-foreground">
                    {loginResponse.agreeTerms ? "Yes" : "No"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Last Updated</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(loginResponse.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
          >
            Update
          </Button>
        </div>
      </div>
      
      {/* Update Confirmation Dialog */}
      {showUpdateConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Updated</h3>
              <p className="text-sm text-gray-500 mb-6">
                Your settings have been updated successfully.
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  onClick={() => {
                    setShowUpdateConfirmDialog(false);
                    // Navigate based on allowPasswordChange flag
                    if (loginResponse?.allowPasswordChange === 1) {
                      console.log("Password was changed, navigating to login page");
                      navigate("/");
                    } else {
                      console.log("Only security settings updated, navigating to chapters");
                      navigate("/chapters");
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  OK
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Validation Error</h3>
              <p className="text-sm text-gray-500 mb-6">{validationErrorMessage}</p>
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
     
      
      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Terms and Conditions</h2>
              <Button 
                onClick={() => setShowTermsModal(false)}
                variant="outline"
                className="text-gray-600 hover:text-gray-800"
              >
                Close
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh] bg-white">
              <iframe
                src="https://oxfordadvantage.co.in/OxfordAdvantage/OtherFiles/Oxford/Teacher.html"
                className="w-full h-[600px] border-0 rounded-lg"
                style={{ minHeight: '600px' }}
                ref={(iframe) => {
                  if (iframe) {
                    let scrollDetectionActive = false;
                    let userHasScrolled = false;
                    let hasScrolledToBottom = false;
                    
                    const startScrollDetection = () => {
                      if (scrollDetectionActive) return;
                      scrollDetectionActive = true;
                      
                      // Monitor scroll events on the iframe container
                      const container = iframe.parentElement;
                      if (!container) return;
                      
                      let wheelCount = 0;
                      let totalScrollDistance = 0;
                      let lastScrollTime = Date.now();
                      
                      const handleWheel = (e: WheelEvent) => {
                        // Only count significant scroll events (deltaY > 0)
                        if (Math.abs(e.deltaY) > 10) {
                          wheelCount++;
                          totalScrollDistance += Math.abs(e.deltaY);
                          lastScrollTime = Date.now();
                          userHasScrolled = true;
                          
                          // Check if user has scrolled significantly through content
                          if (wheelCount > 15 || totalScrollDistance > 1500) {
                            // Assume user has scrolled through the content
                            setTimeout(() => {
                              if (userHasScrolled && Date.now() - lastScrollTime > 3000) {
                                // User stopped scrolling after significant interaction
                                setFormData(prev => ({ ...prev, agreeTerms: true }));
                                // Removed auto-close - modal stays open
                              }
                            }, 3000);
                          }
                        }
                      };
                      
                      // Additional scroll position monitoring
                      const checkScrollPosition = () => {
                        try {
                          // Try to access iframe scroll position
                          if (iframe.contentWindow) {
                            const scrollY = iframe.contentWindow.scrollY || 0;
                            const documentHeight = iframe.contentDocument?.documentElement.scrollHeight || 0;
                            const windowHeight = iframe.contentWindow.innerHeight || 0;
                            
                            if (documentHeight > 0) {
                              const scrollPercentage = ((scrollY + windowHeight) / documentHeight) * 100;
                              
                              // Check if scrolled to bottom (95% or more)
                              if (scrollPercentage >= 95 && !hasScrolledToBottom) {
                                hasScrolledToBottom = true;
                                setFormData(prev => ({ ...prev, agreeTerms: true }));
                                // Removed auto-close - modal stays open
                              }
                            }
                          }
                        } catch (error) {
                          // Fallback: Use container scroll position as approximation
                          const containerScrollTop = container.scrollTop;
                          const containerScrollHeight = container.scrollHeight;
                          const containerClientHeight = container.clientHeight;
                          
                          if (containerScrollHeight > 0) {
                            const containerScrollPercentage = ((containerScrollTop + containerClientHeight) / containerScrollHeight) * 100;
                            
                            // Check if container scrolled to bottom (90% or more)
                            if (containerScrollPercentage >= 90 && !hasScrolledToBottom) {
                              hasScrolledToBottom = true;
                              setFormData(prev => ({ ...prev, agreeTerms: true }));
                              // Removed auto-close - modal stays open
                            }
                          }
                        }
                      };
                      
                      // Monitor scroll position every 500ms
                      const scrollCheckInterval = setInterval(checkScrollPosition, 500);
                      
                      const handleTouchMove = (e: TouchEvent) => {
                        userHasScrolled = true;
                        lastScrollTime = Date.now();
                      };
                      
                      // Add event listeners
                      container.addEventListener('wheel', handleWheel);
                      container.addEventListener('touchmove', handleTouchMove);
                      
                      // Also listen for keyboard events (arrow keys, page down, etc.)
                      const handleKeyDown = (e: KeyboardEvent) => {
                        if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', 'End', 'Home'].includes(e.key)) {
                          userHasScrolled = true;
                          lastScrollTime = Date.now();
                          wheelCount++;
                        }
                      };
                      
                      document.addEventListener('keydown', handleKeyDown);
                      
                      // Auto-check after reasonable reading time (15 seconds) if user has interacted significantly
                      setTimeout(() => {
                        if (userHasScrolled && wheelCount > 20) {
                          setFormData(prev => ({ ...prev, agreeTerms: true }));
                          // Removed auto-close - modal stays open
                        }
                      }, 15000);
                      
                      // Clean up
                      return () => {
                        container.removeEventListener('wheel', handleWheel);
                        container.removeEventListener('touchmove', handleTouchMove);
                        document.removeEventListener('keydown', handleKeyDown);
                        clearInterval(scrollCheckInterval);
                      };
                    };
                    
                    // Start detection when iframe loads
                    iframe.addEventListener('load', startScrollDetection);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
      </div>
      <Footer />
    </div>
  );
};

export default Prelogin;
