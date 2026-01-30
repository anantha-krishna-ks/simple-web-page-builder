import { useState } from "react";
import Header from "@/components/Header";
import SubjectCard from "@/components/SubjectCard";
import BookReader from "@/components/BookReader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import scienceImg from "@/assets/science-subject.png";
import mathImg from "@/assets/mathematics-subject.png";
import englishImg from "@/assets/english-subject.png";
import hindiImg from "@/assets/hindi-subject.png";

const classes = [
  { id: "class-6", name: "Class 6" },
  { id: "class-7", name: "Class 7" },
  { id: "class-8", name: "Class 8" },
  { id: "class-9", name: "Class 9" },
  { id: "class-10", name: "Class 10" },
];

const subjects = [
  { id: "science", title: "Science", image: scienceImg, color: "bg-blue-500" },
  { id: "mathematics", title: "Mathematics", image: mathImg, color: "bg-purple-500" },
  { id: "english", title: "English", image: englishImg, color: "bg-green-500" },
  { id: "hindi", title: "Hindi", image: hindiImg, color: "bg-orange-500" },
];

const Index = () => {
  const [selectedClass, setSelectedClass] = useState("class-6");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string>("1");

  if (selectedSubject) {
    const subject = subjects.find((s) => s.id === selectedSubject);
    return (
      <BookReader
        subject={subject?.title || ""}
        onClose={() => setSelectedSubject(null)}
        selectedChapter={selectedChapter}
        ebookPath=""
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Welcome Back, Ms. Johnson
              </h2>
              <p className="text-muted-foreground">
                Select a class and subject to begin your teaching session
              </p>
            </div>

            <div className="mb-8 max-w-sm">
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Class
              </label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Subjects for {classes.find((c) => c.id === selectedClass)?.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {subjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    title={subject.title}
                    image={subject.image}
                    color={subject.color}
                    onClick={() => setSelectedSubject(subject.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
