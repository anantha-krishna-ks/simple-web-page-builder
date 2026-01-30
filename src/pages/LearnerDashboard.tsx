import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Menu, BookOpen, ClipboardList, BookMarked, Search, FileText, Layers, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import englishImg from '@/assets/english-subject.png';
import mathImg from '@/assets/mathematics-subject.png';
import scienceImg from '@/assets/science-subject.png';
import hindiImg from '@/assets/hindi-subject.png';

const subjects = [
  { id: "english", title: "English", image: englishImg, color: "from-green-400 to-green-600" },
  { id: "mathematics", title: "Mathematics", image: mathImg, color: "from-purple-400 to-purple-600" },
  { id: "science", title: "Science", image: scienceImg, color: "from-blue-400 to-blue-600" },
  { id: "hindi", title: "Hindi", image: hindiImg, color: "from-orange-400 to-orange-600" },
];

const learningResources = [
  { id: "1", name: "Introduction to Numbers", type: "video", icon: Video },
  { id: "2", name: "Basic Arithmetic Worksheet", type: "pdf", icon: FileText },
  { id: "3", name: "Math Games", type: "interactive", icon: Layers },
  { id: "4", name: "Science Experiments", type: "video", icon: Video },
  { id: "5", name: "English Grammar Guide", type: "pdf", icon: FileText },
  { id: "6", name: "Language Practice", type: "interactive", icon: Layers },
];

const assessments = [
  { id: "1", name: "Math Quiz - Addition", type: "Worksheet", dueDate: "Oct 12, 2025" },
  { id: "2", name: "Science Lab Activity", type: "Activity", dueDate: "Oct 13, 2025" },
  { id: "3", name: "English Comprehension", type: "Worksheet", dueDate: "Oct 11, 2025" },
];

const lessonPlans = [
  { id: "1", title: "Fun with Numbers", subject: "Mathematics" },
  { id: "2", title: "Science of Plants", subject: "Science" },
  { id: "3", title: "Reading Stories", subject: "English" },
];

const LearnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'home' | 'resources' | 'assessments' | 'lessons'>('home');
  const [selectedClass, setSelectedClass] = useState('grade1');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/book-reader?subject=${subjectId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/learner-login');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100/40 via-transparent to-purple-100/40 animate-gradient-xy"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-cyan-100/30 via-transparent to-blue-100/30 animate-gradient-slow"></div>
      
      {/* WhatsApp-style doodle pattern background */}
      <div className="absolute inset-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="doodle-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              {/* Book */}
              <path d="M20,30 L35,30 L35,45 L20,45 Z" fill="none" stroke="#4F46E5" strokeWidth="1.5" opacity="0.3"/>
              <line x1="20" y1="35" x2="35" y2="35" stroke="#4F46E5" strokeWidth="1.5" opacity="0.3"/>
              
              {/* Star */}
              <path d="M150,20 L153,28 L162,28 L155,33 L158,42 L150,36 L142,42 L145,33 L138,28 L147,28 Z" fill="none" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.3"/>
              
              {/* Pencil */}
              <path d="M70,80 L75,75 L78,78 L73,83 Z M75,75 L80,70" fill="none" stroke="#EC4899" strokeWidth="1.5" opacity="0.3"/>
              <rect x="73" y="83" width="3" height="8" fill="none" stroke="#EC4899" strokeWidth="1.5" opacity="0.3"/>
              
              {/* Light bulb */}
              <circle cx="170" cy="100" r="8" fill="none" stroke="#F59E0B" strokeWidth="1.5" opacity="0.3"/>
              <path d="M165,108 L175,108" stroke="#F59E0B" strokeWidth="1.5" opacity="0.3"/>
              
              {/* Trophy */}
              <path d="M40,150 L40,145 L35,145 L35,140 L45,140 L45,145 L50,145 L50,150 Z M38,150 L42,150 L42,155 L38,155 Z" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.3"/>
              
              {/* Graduation cap */}
              <path d="M100,160 L90,155 L100,150 L110,155 Z M100,155 L100,165" fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity="0.3"/>
              
              {/* Apple */}
              <circle cx="180" cy="170" r="8" fill="none" stroke="#EF4444" strokeWidth="1.5" opacity="0.3"/>
              <path d="M180,162 L180,158" stroke="#10B981" strokeWidth="1.5" opacity="0.3"/>
              
              {/* Music note */}
              <path d="M25,100 L25,115 M25,100 L32,98 L32,113" fill="none" stroke="#6366F1" strokeWidth="1.5" opacity="0.3"/>
              <circle cx="25" cy="115" r="3" fill="none" stroke="#6366F1" strokeWidth="1.5" opacity="0.3"/>
              
              {/* Calculator */}
              <rect x="140" y="140" width="20" height="25" rx="2" fill="none" stroke="#06B6D4" strokeWidth="1.5" opacity="0.3"/>
              <line x1="143" y1="145" x2="157" y2="145" stroke="#06B6D4" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#doodle-pattern)"/>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-l-md transform -rotate-12 shadow-md"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-500 rounded-md transform rotate-0 translate-x-1 shadow-md"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-green-500 rounded-r-md transform rotate-12 translate-x-2 shadow-md"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-800 leading-tight">Oxford</span>
              <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent leading-tight">Advantage</span>
            </div>
          </div>
          
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-32 bg-white border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grade1">Grade 1</SelectItem>
              <SelectItem value="grade2">Grade 2</SelectItem>
              <SelectItem value="grade3">Grade 3</SelectItem>
              <SelectItem value="grade4">Grade 4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pb-20 px-4 pt-6">
          {/* Home Tab - Subject Cards */}
          {activeTab === 'home' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-heading font-semibold mb-2 bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                  Your Subjects
                </h2>
                <p className="text-sm text-gray-600">Select a subject to start learning</p>
              </div>

              <div className="grid grid-cols-2 gap-5">
                {subjects.map((subject) => (
                  <Card 
                    key={subject.id}
                    className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden bg-white border border-gray-100 shadow-lg group rounded-2xl"
                    onClick={() => handleSubjectClick(subject.id)}
                  >
                    <CardContent className="p-0">
                      <div className="overflow-hidden rounded-t-2xl">
                        <img 
                          src={subject.image} 
                          alt={subject.title}
                          className="w-full h-44 object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-105"
                        />
                      </div>
                      <div className="px-4 py-5 bg-gradient-to-b from-white to-gray-50">
                        <h3 className="text-gray-800 text-base font-heading font-semibold text-center tracking-wide">
                          {subject.title}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Learning Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-heading font-semibold mb-2 bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                  Learning Resources
                </h2>
                <p className="text-sm text-gray-600">Access your study materials</p>
              </div>

              <div className="flex gap-3 mb-4">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-40 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {learningResources.map((resource) => {
                  const Icon = resource.icon;
                  return (
                    <Card key={resource.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Icon className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{resource.name}</h3>
                          <p className="text-xs text-gray-500 capitalize">{resource.type}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Assessments Tab */}
          {activeTab === 'assessments' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-heading font-semibold mb-2 bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                  Assessments
                </h2>
                <p className="text-sm text-gray-600">View your assignments and tests</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {assessments.map((assessment) => (
                  <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 mb-1">{assessment.name}</h3>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded">{assessment.type}</span>
                            <span>Due: {assessment.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Lesson Plans Tab */}
          {activeTab === 'lessons' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-heading font-semibold mb-2 bg-gradient-to-r from-blue-600 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                  Lesson Plans
                </h2>
                <p className="text-sm text-gray-600">View your lesson schedule</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {lessonPlans.map((lesson) => (
                  <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-medium text-gray-800 mb-1">{lesson.title}</h3>
                      <p className="text-sm text-gray-500">{lesson.subject}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20 safe-area-bottom">
          <div className="flex items-center justify-around px-2 py-2 max-w-screen-sm mx-auto">
            {/* Menu Button */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button className="flex flex-col items-center justify-center gap-1 py-2 px-4 min-w-[70px] active:opacity-60 transition-opacity">
                  <Menu className="w-6 h-6 text-gray-700" strokeWidth={2} />
                  <span className="text-[11px] font-medium text-gray-700">Menu</span>
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="flex flex-col gap-3 mt-8">
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">S</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Student</h3>
                      <p className="text-xs text-gray-500">Grade 1</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/profile-settings')}
                    className="justify-start"
                  >
                    Profile Settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Resources Button */}
            <button 
              onClick={() => setActiveTab('resources')}
              className="flex flex-col items-center justify-center gap-1 py-2 px-4 min-w-[70px] active:opacity-60 transition-opacity"
            >
              <BookOpen 
                className={cn(
                  "w-6 h-6 transition-colors",
                  activeTab === 'resources' ? "text-blue-600" : "text-gray-700"
                )} 
                strokeWidth={2}
              />
              <span className={cn(
                "text-[11px] font-medium transition-colors",
                activeTab === 'resources' ? "text-blue-600" : "text-gray-700"
              )}>
                Resources
              </span>
            </button>

            {/* Assessments Button */}
            <button 
              onClick={() => setActiveTab('assessments')}
              className="flex flex-col items-center justify-center gap-1 py-2 px-4 min-w-[70px] active:opacity-60 transition-opacity"
            >
              <ClipboardList 
                className={cn(
                  "w-6 h-6 transition-colors",
                  activeTab === 'assessments' ? "text-blue-600" : "text-gray-700"
                )} 
                strokeWidth={2}
              />
              <span className={cn(
                "text-[11px] font-medium transition-colors",
                activeTab === 'assessments' ? "text-blue-600" : "text-gray-700"
              )}>
                Tests
              </span>
            </button>

            {/* Lessons Button */}
            <button 
              onClick={() => setActiveTab('lessons')}
              className="flex flex-col items-center justify-center gap-1 py-2 px-4 min-w-[70px] active:opacity-60 transition-opacity"
            >
              <BookMarked 
                className={cn(
                  "w-6 h-6 transition-colors",
                  activeTab === 'lessons' ? "text-blue-600" : "text-gray-700"
                )} 
                strokeWidth={2}
              />
              <span className={cn(
                "text-[11px] font-medium transition-colors",
                activeTab === 'lessons' ? "text-blue-600" : "text-gray-700"
              )}>
                Lessons
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerDashboard;
