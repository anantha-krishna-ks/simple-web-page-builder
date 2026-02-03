import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher, FaUserGraduate, FaUserShield } from 'react-icons/fa';
import oxfordIgniteLogo from "@/assets/oxford-ignite-logo.png";

const NavigationControls = () => {
  const navigate = useNavigate();

  const handleTeacherClick = () => {
    navigate('/');
  };

  const handleStudentClick = () => {
    navigate('/');
  };

const handleAdminClick = () => {
  const adminUrl = import.meta.env.VITE_ADMIN_URL;
  window.location.href = adminUrl;
};

  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 bg-gray-100">
      <div className="w-full max-w-4xl">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="flex flex-col items-center space-y-6">
          {/* Oxford Ignite Logo */}
          <div className="flex justify-center mb-6">
           <div className="flex justify-center">
              <img
                src={oxfordIgniteLogo}
                alt="Oxford Ignite"
                className="h-20 w-auto"
              />
            </div>
          </div>
          
          {/* Buttons */}
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Teacher Card */}
              <div className="flex-1">
                <button 
                  className="w-full h-full p-8 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all shadow-lg flex flex-col items-center justify-center space-y-4 border-2 border-transparent hover:border-green-300 min-h-[220px]"
                  onClick={handleTeacherClick}
                >
                  <FaChalkboardTeacher className="text-4xl" />
                  <span className="text-xl font-bold">Teacher</span>
                  <p className="text-sm text-center opacity-90">Access teaching resources </p>
                </button>
              </div>
              
              {/* Student Card */}
              <div className="flex-1">
                <button 
                  className="w-full h-full p-8 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg flex flex-col items-center justify-center space-y-4 border-2 border-transparent hover:border-blue-300 min-h-[220px]"
                  onClick={handleStudentClick}
                >
                  <FaUserGraduate className="text-4xl" />
                  <span className="text-xl font-bold">Student</span>
                  <p className="text-sm text-center opacity-90">Access students materials</p>
                </button>
              </div>
              
              {/* Admin Card */}
              <div className="flex-1">
                <button 
                  className="w-full h-full p-8 bg-gray-50 text-gray-600 rounded-2xl hover:bg-gray-100 transition-all shadow-lg flex flex-col items-center justify-center space-y-4 border-2 border-gray-200 min-h-[220px]"
                  onClick={handleAdminClick}
                >
                  <FaUserShield className="text-4xl" />
                  <span className="text-xl font-bold">Admin</span>
                  <p className="text-sm text-center opacity-70">Administrative access</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        </div>
  );
};

export default NavigationControls;
