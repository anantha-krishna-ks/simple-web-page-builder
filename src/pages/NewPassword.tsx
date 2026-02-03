import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getApiBaseUrl } from '@/utils/config';
import { toast } from '@/hooks/use-toast';

const NewPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validatePassword = (password: string) => {
    if (!password.trim()) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (password.length > 20) {
      return 'Password cannot exceed 20 characters';
    }
    // Allow uppercase, lowercase, digits, and special characters
    if (!/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]*$/.test(password)) {
      return 'Password can only contain uppercase, lowercase letters, digits, and special characters';
    }
    return '';
  };

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    const error = validatePassword(value);
    setErrors(prev => ({ ...prev, newPassword: error }));
    
    // Clear confirm password error if passwords match
    if (confirmPassword && value === confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value && value !== newPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleBackToReset = () => {
    navigate('/reset-password');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setErrors({ newPassword: passwordError });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);

    try {
      const userId = sessionStorage.getItem('resetPasswordUserId');
      const username = sessionStorage.getItem('resetPasswordUsername');
      const secretQuestion = sessionStorage.getItem('resetPasswordSecretQuestion');
      const hintAnswer = sessionStorage.getItem('resetPasswordHintAnswer');

      // Debug: Log all retrieved values
      console.log('NewPassword - Retrieved from sessionStorage:');
      console.log('userId:', userId);
      console.log('username:', username);
      console.log('secretQuestion:', secretQuestion);
      console.log('hintAnswer:', hintAnswer);

      if (!userId || !username) {
        throw new Error('Session expired. Please start the password reset process again.');
      }

      const apiBaseUrl = await getApiBaseUrl();
        
      // Prepare data for the API as JSON (matching Prelogin.tsx format)
      const apiData = {
        LoginName: '',
        Password: newPassword,
        SecretQuestion: secretQuestion || '',  // Fixed: SecretQuestion not SecreatQuestion
        Hintanswer: hintAnswer || '',
        UserID: userId || '',
        OldPassword: '',
        IsReadEULA: true
      };
      
      // Debug: Log the API data being sent
      console.log('NewPassword - API data being sent:', apiData);
      
      // Get auth token if available
      const token = sessionStorage.getItem('token');
      
      // Call change-password API with JSON data (matching Prelogin.tsx)
      const response = await fetch(
        `${apiBaseUrl}/login/change-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            'Accept': 'application/json',
          },
          body: JSON.stringify(apiData)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      const result = await response.json();

      // Clear session storage
      sessionStorage.removeItem('resetPasswordUserId');
      sessionStorage.removeItem('resetPasswordUsername');
      sessionStorage.removeItem('resetPasswordSecretQuestion');
      sessionStorage.removeItem('resetPasswordHintAnswer');

      // Show success UI
      setShowSuccess(true);

    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: error instanceof Error ? error.message : "Failed to reset password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/');
  };

  const handleBackToResetPassword = () => {
    navigate('/reset-password');
  };

  // Show success screen
  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 xs-mobile:overflow-x-hidden">
        <Header 
          role="student" 
          onLogout={() => {}} 
          pageType="prelogin"
          isAgreeTermsAndCondition={0}
          isHeaderCollapsed={false}
          onToggleHeader={() => {}}
        />
        
        <div className="flex-1 flex items-center justify-center px-4 py-8 xs-mobile:px-2 sm-mobile:px-3 xs-mobile:py-4 sm-mobile:py-6">
          <Card className="responsive-card w-full max-w-md">
            <CardContent className="pt-6 xs-mobile:pt-4 sm-mobile:pt-5">
              <div className="text-center space-y-4 xs-mobile:space-y-3 sm-mobile:space-y-3.5">
                <div className="flex justify-center">
                  <div className="w-16 h-16 xs-mobile:w-12 xs-mobile:h-12 sm-mobile:w-14 sm-mobile:h-14 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 xs-mobile:w-6 xs-mobile:h-6 sm-mobile:w-7 sm-mobile:h-7 text-green-600" />
                  </div>
                </div>
                
                <div className="space-y-2 xs-mobile:space-y-1">
                  <h2 className="text-2xl xs-mobile:text-lg sm-mobile:text-xl font-bold text-gray-900">Password Reset Successful</h2>
                  <p className="text-sm xs-mobile:text-xs text-gray-600">
                    Your password has been reset successfully. Please login with your new password.
                  </p>
                </div>
                
                <div className="pt-4 xs-mobile:pt-3 sm-mobile:pt-3.5">
                  <Button 
                    onClick={handleLoginRedirect}
                    className="responsive-button w-full xs-mobile:text-xs sm-mobile:text-sm xs-mobile:min-h-[2.5rem] sm-mobile:min-h-[2.75rem]"
                  >
                    Ok
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Footer className="mt-auto" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header 
        role="student" 
        onLogout={() => {}} 
        pageType="prelogin"
        isAgreeTermsAndCondition={0}
        isHeaderCollapsed={false}
        onToggleHeader={() => {}}
      />
      
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center relative">
            <CardTitle className="text-2xl xs-mobile:text-lg sm-mobile:text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToResetPassword}
                className="w-10 h-10 xs-mobile:w-10 xs-mobile:h-10 sm-mobile:w-11 sm-mobile:h-11 text-blue-500 rounded flex items-center justify-center p-0 hover:bg-blue-500 absolute left-4"
              >
                <ArrowLeft className="w-12 h-12 xs-mobile:w-6 xs-mobile:h-6 sm-mobile:w-7 sm-mobile:h-7" />
              </Button>
              <span className="xs-mobile:text-base">Set New Password</span>
            </CardTitle>
            <CardDescription className="text-sm xs-mobile:text-xs">
              Create your new password
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-500">{errors.newPassword}</p>
                )}
                <p className="text-xs text-gray-500">
                  Must be 6-20 characters with uppercase, lowercase, digits, and special characters
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !!errors.newPassword || !!errors.confirmPassword}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <Footer className="mt-auto" />
    </div>
  );
};

export default NewPassword;
