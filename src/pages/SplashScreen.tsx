import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/learner-login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden flex items-center justify-center">
      {/* Decorative circles in background */}
      <div className="absolute top-10 left-10 w-20 h-20 rounded-full border-4 border-blue-400/30"></div>
      <div className="absolute top-32 right-16 w-16 h-16 rounded-full border-4 border-blue-400/30"></div>
      <div className="absolute bottom-32 left-20 w-24 h-24 rounded-full border-4 border-blue-400/30"></div>
      
      {/* Clouds at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full text-white fill-current">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>

      {/* Astronaut decoration - left */}
      <div className="absolute bottom-20 left-8 text-4xl animate-bounce">
        🚀
      </div>

      {/* Rocket decoration - right */}
      <div className="absolute bottom-20 right-8 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>
        🎨
      </div>

      {/* Star decorations */}
      <div className="absolute top-24 left-16 text-2xl animate-pulse">⭐</div>
      <div className="absolute top-48 right-20 text-2xl animate-pulse" style={{ animationDelay: '0.3s' }}>⭐</div>
      <div className="absolute bottom-48 left-32 text-2xl animate-pulse" style={{ animationDelay: '0.6s' }}>⭐</div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Oxford</h1>
              <h2 className="text-3xl font-bold text-green-400">Advantage</h2>
            </div>
          </div>
          <p className="text-xs text-blue-200 uppercase tracking-wider">Integrated Learning Solutions</p>
        </div>

        {/* Illustration placeholder */}
        <div className="mb-8 flex justify-center">
          <div className="text-6xl animate-pulse">👨‍🎓</div>
        </div>

        {/* Main heading */}
        <h3 className="text-3xl font-bold text-white mb-2">
          Online classrooms with
        </h3>
        <h3 className="text-3xl font-bold text-yellow-400 mb-4">
          Interactive Lessons
        </h3>
        
        {/* Subtitle */}
        <p className="text-sm text-blue-100 leading-relaxed">
          Dedicated to Transforming Education<br />Through Technology.
        </p>

        {/* Powered by */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-xs text-blue-200 mb-1">Powered by:</p>
          <p className="text-2xl font-bold text-orange-500">LJSaras</p>
          <p className="text-xs text-blue-200">from Excelsoft</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
