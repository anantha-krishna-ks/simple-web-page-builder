import { getApiBaseUrl } from '@/utils/config';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import oxfordIgniteLogo from "@/assets/oxford-ignite-logo.png";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoadingOverlay from "@/components/LoadingOverlay";


const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  // Handle browser back button
  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
      // Prevent default back navigation
      event.preventDefault();
      
      // Show loading state
      setIsReloading(true);
      
      // Force a page reload after a short delay
      const timer = setTimeout(() => {
        window.location.reload();
      }, 500);
      
      return () => clearTimeout(timer);
    };

    // Add a new entry to the history stack
    window.history.pushState(null, '', window.location.href);
    
    // Add event listener
    window.addEventListener('popstate', handleBackButton);
    
    // Clean up
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  const validateUsername = (name: string) => {
    const trimmed = name.trim();
    
    // If empty, reject
    if (!trimmed) {
      return false;
    }
    
    // Accept any format that might be stored in database
    // This allows: emails, usernames with dots, underscores, numbers, etc.
    // Only reject obviously invalid formats (like just spaces)
    if (trimmed.length > 0 && !/^\s+$/.test(trimmed)) {
      return true;
    }
    
    return false;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUsername(username)) {
      toast.error("Invalid username. Please enter a valid username.");
      return;
    }

    setIsLoading(true);

    try {
      // 🔑 Step 1: Get JWT from /api/token
      const tokenApiBaseUrl = await getApiBaseUrl();
      const tokenResponse = await fetch(`${tokenApiBaseUrl}/api/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        
        body: JSON.stringify({ username, password })
      });

      if (!tokenResponse.ok) {
        toast.error("Failed to generate token");
        setIsLoading(false);
        return;
      }

      const tokenData = await tokenResponse.json();
      const jwtToken = tokenData.token;
      
      // Store JWT in sessionStorage immediately
      sessionStorage.setItem("authToken", jwtToken);
      console.log("JWT token stored in sessionStorage:", jwtToken);
      

      // 🔑 Step 2: Call /login with JWT in header
      const loginApiBaseUrl = await getApiBaseUrl();
      const loginResponse = await fetch(`${loginApiBaseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password })
      });

      if (!loginResponse.ok) {
        const data = await loginResponse.json();
        toast.error(data.detail || "Login failed");
        setIsLoading(false);
        return;
      }

      const data = await loginResponse.json();
      console.log("Login API Response:", data);

      // 🔑 Step 3: Store JWT + user info in sessionStorage
      if (jwtToken) {
        sessionStorage.setItem("authToken", jwtToken);
        console.log("JWT token stored:", jwtToken);
      }

      if (data.userTypeName) {
        sessionStorage.setItem("userTypeName", data.userTypeName);
      }
      if (data.firstName) {
        sessionStorage.setItem("firstName", data.firstName);
        console.log("firstName stored:", data.firstName);
      }
      if (data.lastName) {
        sessionStorage.setItem("lastName", data.lastName);
        console.log("lastName stored:", data.lastName);
      }
      if (data.userID) {
        sessionStorage.setItem("userID", data.userID.toString());
      }
      // Don't store email from main login API - will get correct email from details API
      // if (data.email) {
      //   sessionStorage.setItem("email", data.email);
      //   console.log("email stored:", data.email);
      // }

      // Fetch additional login details
      if (data.userID) {
        try {
          const apiBaseUrl = await getApiBaseUrl();
          const detailsResponse = await fetch(`${apiBaseUrl}/login/details/${data.userID}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });

          if (detailsResponse.ok) {
            const detailsData = await detailsResponse.json();
            console.log("Login details API Response:", detailsData);
            
            // Store additional details in session storage (only security details from details API)
            // Email from main login API might be wrong, prioritize details API email
            console.log("Login API email (potentially wrong):", data.email);
            console.log("Details API email field:", detailsData.email);
            console.log("All details API fields:", Object.keys(detailsData));
            
            // Check for various possible email field names in details API
            const possibleEmailFields = ['email', 'emailAddress', 'userEmail', 'loginEmail', 'mail', 'contactEmail'];
            let foundEmail = null;
            let emailField = null;
            
            for (const field of possibleEmailFields) {
              if (detailsData[field]) {
                foundEmail = detailsData[field];
                emailField = field;
                break;
              }
            }
            
            // Always use details API email if found, regardless of main login API email
            if (foundEmail) {
              sessionStorage.setItem("email", foundEmail);
              console.log(`Using email from details API field '${emailField}' (correct):`, foundEmail);
              console.log(`Ignoring main login API email (wrong):`, data.email);
            } else {
              // Only use main login API email if no email found in details API
              sessionStorage.setItem("email", data.email);
              console.log("No email found in details API, using main login API email:", data.email);
            }
            if (detailsData.firstName) {
              sessionStorage.setItem("firstName", detailsData.firstName);
              console.log("firstName from details API stored:", detailsData.firstName);
            }
            if (detailsData.lastName) {
              sessionStorage.setItem("lastName", detailsData.lastName);
              console.log("lastName from details API stored:", detailsData.lastName);
            }
            // Map API fields to session storage used by ProfileSettings
            // security question in API: secreatQuestion -> stored as secretQuestion
            if (detailsData.secreatQuestion) {
              sessionStorage.setItem("secretQuestion", detailsData.secreatQuestion);
              console.log("secretQuestion from details API stored:", detailsData.secreatQuestion);
            }
            // security answer field name may still be hintAnswer (keep as-is if present)
            if (detailsData.hintAnswer) {
              sessionStorage.setItem("hintAnswer", detailsData.hintAnswer);
              console.log("hintAnswer from details API stored:", detailsData.hintAnswer);
            }
            // phone number from details API -> stored as phone
            // backend may expose it as mobileNUM or phoneNumber, so check both
             if (detailsData.address || detailsData.addressLine1) {
              const addr = detailsData.address || detailsData.addressLine1;
              sessionStorage.setItem("address", addr);
              console.log("address from details API stored:", addr);
            }

            // phone number from details API -> stored as mobileNUM
            // backend may expose it as MobileNUM, mobileNUM, or phoneNumber, so check all
            if (detailsData.MobileNUM || detailsData.mobileNUM || detailsData.phoneNumber) {
              const phone = detailsData.MobileNUM || detailsData.mobileNUM || detailsData.phoneNumber;
              sessionStorage.setItem("mobileNUM", phone);
              console.log("Phone from details API stored:", phone);
            }
            // Store any other fields from details API
            sessionStorage.setItem("loginDetails", JSON.stringify(detailsData));
          } else {
            console.log("Failed to fetch login details");
          }
        } catch (error) {
          console.error("Error fetching login details:", error);
        }
      }

      // Store the complete login response for Prelogin page
      const enhancedData = {
        ...data,
        username: username,  // Add the username that was sent
        password: password   // Add the password that was sent
      };
      sessionStorage.setItem("loginResponse", JSON.stringify(enhancedData));
      console.log("Enhanced loginResponse stored:", enhancedData);

      // Check only isAgreeTermsAndCondition and allowPasswordChange conditions
      const { isAgreeTermsAndCondition, allowPasswordChange } = data;
      console.log("Navigation check:", { isAgreeTermsAndCondition, allowPasswordChange });

      if (isAgreeTermsAndCondition === 1 && allowPasswordChange === 1) {
        // Both are 1 - navigate to chapters
        console.log("Both conditions are 1, navigating to chapters");
        navigate("/chapters");
        return; 
      }
      else if (isAgreeTermsAndCondition === 1 && allowPasswordChange === 0) {
        // isAgreeTermsAndCondition is 1 and allowPasswordChange is 0 - navigate to chapters
        console.log("isAgreeTermsAndCondition is 1 and allowPasswordChange is 0, navigating to chapters");
        navigate("/chapters");
        return;
      }
      else if (isAgreeTermsAndCondition === 0 && allowPasswordChange === 0) {
        // Both are 0 - navigate to prelogin (security only + checkbox)
        console.log("Both conditions are 0, navigating to prelogin");
        navigate("/prelogin");
        return;
      } else if (isAgreeTermsAndCondition === 0 && allowPasswordChange === 1) {
        // isAgreeTermsAndCondition is 0 and allowPasswordChange is 1 - navigate to prelogin (both sections)
        console.log("isAgreeTermsAndCondition is 0 and allowPasswordChange is 1, navigating to prelogin");
        navigate("/prelogin");
        return;
      }
      
      // Fallback: navigate to chapters
      console.log("Fallback, navigating to chapters");
      navigate("/chapters");

      // Example: fetch chapters using stored token
      const defaultSummary = data.summary && data.summary.length > 0 ? data.summary[0] : null;
      if (defaultSummary && jwtToken) {
        sessionStorage.setItem("selectedClass", defaultSummary.planClassId.toString());
        sessionStorage.setItem("selectedSubject", defaultSummary.subjectID.toString());

        const apiBaseUrl = await getApiBaseUrl();
        const chaptersResponse = await fetch(
          `${apiBaseUrl}/chapters?userId=${data.userID}&planClassId=${defaultSummary.planClassId}`,
          {
            headers: {}
          }
        );

        if (chaptersResponse.ok) {
          const chaptersData = await chaptersResponse.json();
          sessionStorage.setItem("chapters", JSON.stringify(chaptersData));
        } else {
          toast.error("Failed to fetch chapters after login.");
        }
      }

      // Navigate based on user type
      if (data.userTypeName === "parent") {
        navigate("/parent-dashboard");
      } else {
        navigate("/chapters");
      }

      toast.success("Login successful");
    } catch (error) {
      toast.error("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading overlay style
  const loadingOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    pointerEvents: 'auto',
    backdropFilter: 'blur(4px)',
  };

  // Prevent scrolling on the body when component mounts
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
      {isLoading && (
        <div style={loadingOverlayStyle}>
          <div className="text-center p-6 bg-white rounded-lg shadow-xl max-w-sm mx-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">Please Wait...</h3>
          </div>
        </div>
      )}
      <Header pageType="login" />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <img
                src={oxfordIgniteLogo}
                alt="Oxford Ignite"
                className="h-20 w-auto"
              />
            </div>
          </div>

          <form onSubmit={handleLogin} className={`space-y-4 ${isLoading ? 'opacity-70' : ''}`}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

          

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
              <div className="flex justify-between">
              <a 
                href="#"
                className="inline-flex items-center justify-start whitespace-nowrap text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-0 py-2"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/reset-password');
                }}
              >
                Reset Password
              </a>
              <a 
                href="https://oxford-uat.excelindia.com/Oxford-ignite/School/Home.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-end whitespace-nowrap text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-0 py-2"
              >
                Admin login
              </a>
         </div>
            
          </form>
        </Card>
      </div>
      <Footer className="mt-auto" />
    </div>
  );
};

export default Login;
