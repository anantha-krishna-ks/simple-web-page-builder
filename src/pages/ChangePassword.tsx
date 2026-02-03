import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const ChangePassword = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [formData, setFormData] = useState({
    securityQuestion: "",
    securityAnswer: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const securityQuestions = [
    "What is your library card number?",
    "What is your mother's maiden name?",
    "What was the name of your first pet?",
    "What city were you born in?",
    "What is your favorite book?",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdatePassword = () => {
    // Validation
    if (!formData.securityQuestion || !formData.securityAnswer) {
      toast({
        title: "Missing Information",
        description: "Please select a security question and provide an answer.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast({
        title: "Missing Password",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    // Success
    toast({
      title: "Password Updated",
      description: "Your password has been successfully changed.",
    });
    
    // Clear form
    setFormData({
      securityQuestion: "",
      securityAnswer: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setAcceptTerms(false);
  };

  return (
    <Layout role={userRole as "student" | "teacher" | "parent"}>
      <div className="container max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Change Password</h1>
            <p className="text-sm text-muted-foreground">Update your password and security settings</p>
          </div>
        </div>

        {/* Forgot Password Security */}
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
                  onValueChange={(value) =>
                    setFormData({ ...formData, securityQuestion: value })
                  }
                >
                  <SelectTrigger id="securityQuestion">
                    <SelectValue placeholder="Select security question" />
                  </SelectTrigger>
                  <SelectContent>
                    {securityQuestions.map((question) => (
                      <SelectItem key={question} value={question}>
                        {question}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  placeholder="Enter your answer"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
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
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Enter current password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">
                  New Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    I accept the{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms and Conditions
                    </a>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    By continuing, you agree to Oxford Advantage's terms and policies
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Fields marked with '<span className="text-destructive">*</span>' are mandatory
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/profile-settings")}
          >
            Cancel
          </Button>
          <Button onClick={handleUpdatePassword}>
            Update Password
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ChangePassword;