import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const CourseDetailPage = () => {

    const quizData = [
    {
      id: 1,
      question: "What is the primary purpose of HTML?",
      options: [
        "To style web pages",
        "To define the structure of web content",
        "To handle server-side logic",
        "To create animations"
      ],
      correctAnswer: 1 // index of correct option
    },
    {
      id: 2,
      question: "Which CSS property is used to change the text color?",
      options: [
        "text-style",
        "font-color",
        "color",
        "text-color"
      ],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "What does JSX stand for in React?",
      options: [
        "JavaScript XML",
        "JavaScript Extension",
        "JavaScript Syntax",
        "JavaScript Xcode"
      ],
      correctAnswer: 0
    }
  ];
  const course = {
    title: "Introduction to Web Development",
    instructor: "Sarah Johnson",
    modules: 4,
    status: "Overdue",
    progress: 66,
    modulesList: [
      { 
        id: 101,
        title: "HTML Basics", 
        duration: "45 min", 
        completed: true,
        videoUrl: "https://example.com/videos/html-basics.mp4",
        content: "Learn about HTML structure, tags, and semantic elements."
      },
      { 
        id: 102,
        title: "CSS Styling", 
        duration: "50 min", 
        completed: true,
        videoUrl: "https://example.com/videos/css-styling.mp4",
        content: "Master CSS selectors, box model, and responsive design."
      },
      { 
        id: 103,
        title: "JavaScript Fundamentals", 
        duration: "60 min", 
        completed: false,
        videoUrl: "https://example.com/videos/js-fundamentals.mp4",
        content: "Understand variables, functions, and DOM manipulation."
      },
      { 
        id: 104,
        title: "Course Quiz", 
        duration: "30 min", 
        completed: false,
        videoUrl: null,
        content: "Test your knowledge with this comprehensive quiz."
      }
    ]
  };

  const [activeModule, setActiveModule] = useState(course.modulesList[2]);
  const [isShowQuize, setIsShowQuize] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: number | null }>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quizData[currentQuestionIndex];
  const totalQuestions = quizData.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  // Handle next question
  const handleNext = () => {
    // Save the answer
    const newAnswers = { ...answers, [currentQuestionIndex]: selectedOption };
    setAnswers(newAnswers);

    // Move to next question or show results
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(answers[currentQuestionIndex + 1] ?? null);
    } else {
      // Calculate score when quiz ends
      const correctCount = quizData.reduce((acc, question, index) => {
        return acc + (newAnswers[index] === question.correctAnswer ? 1 : 0);
      }, 0);
      setScore(Math.round((correctCount / totalQuestions) * 100));
      setShowResult(true);
    }
  };

  // Handle previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(answers[currentQuestionIndex - 1] ?? null);
    }
  };

  // Restart quiz
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers({});
    setShowResult(false);
    setScore(0);
  };

  return (
    <>
    {isShowQuize?(
         <div className="animate-fade-in pb-8 px-4 py-6 md:px-8">
      {/* Header Section */}
      {/* <div className="flex items-center justify-between mb-6">
        <a className="flex items-center text-gray-600 hover:text-lms-primary transition-colors" href="/">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="lucide lucide-arrow-left h-4 w-4 mr-2"
          >
            <path d="m12 19-7-7 7-7"></path>
            <path d="M19 12H5"></path>
          </svg>
          <span>Back to Dashboard</span>
        </a>
        <div className="flex items-center gap-3">
          <div className="flex items-center text-red-500">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="lucide lucide-clock h-4 w-4 mr-1"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="text-sm">Overdue</span>
          </div>
        </div>
      </div> */}

      {/* Course Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Introduction to Web Development</h1>
      
      {/* Course Info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center text-sm text-gray-500">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="lucide lucide-book-open h-4 w-4 mr-1"
          >
            <path d="M12 7v14"></path>
            <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
          </svg>
          <span>{totalQuestions} questions</span>
        </div>
        <div className="text-sm text-gray-500">Instructor: Sarah Johnson</div>
      </div>

      {/* Quiz Card */}
      <div className="w-full max-w-3xl mx-auto">
        {showResult ? (
          <div className="rounded-lg border bg-card text-card-foreground shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
            <div className="text-4xl font-bold mb-6">{score}%</div>
            <p className="mb-6">
              You answered {score / 100 * totalQuestions} out of {totalQuestions} questions correctly
            </p>
            <button 
              onClick={handleRestart}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Restart Quiz
            </button>
          </div>
        ) : (
          <div className="rounded-lg border bg-card text-card-foreground shadow-lg">
            {/* Quiz Header */}
            <div className="flex flex-col space-y-1.5 p-6 bg-lms-light">
              <h3 className="text-2xl font-semibold leading-none tracking-tight flex justify-between items-center">
                <span>Module Quiz</span>
                <span className="text-sm font-normal">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </h3>
              <div 
                role="progressbar" 
                className="relative w-full overflow-hidden rounded-full bg-secondary h-1.5 mt-2"
              >
                <div 
                  className="h-full w-full flex-1 bg-primary transition-all" 
                  style={{ transform: `translateX(-${100 - progress}%)` }}
                ></div>
              </div>
            </div>

            {/* Quiz Question */}
            <div className="p-6 pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
                
                {/* Answer Options */}
                <div role="radiogroup" className="grid gap-2">
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div 
                        key={index}
                        className={`flex items-center space-x-2 p-3 rounded-md border transition-colors cursor-pointer ${
                          selectedOption === index 
                            ? 'bg-brand/10 border-brand' 
                            : 'hover:bg-lms-light/50'
                        }`}
                        onClick={() => handleOptionSelect(index)}
                      >
                        <button 
                          type="button" 
                          role="radio" 
                          aria-checked={selectedOption === index}
                          className={`aspect-square h-4 w-4 rounded-full border ${
                            selectedOption === index 
                              ? 'border-brand bg-brand text-primary-foreground' 
                              : 'border-primary text-primary'
                          } ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                          id={`option-${index}`}
                        ></button>
                        <label 
                          className="text-sm font-medium leading-none flex-grow cursor-pointer" 
                          htmlFor={`option-${index}`}
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Navigation */}
            <div className="items-center p-6 pt-0 flex justify-between">
              <button 
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2" 
              >
                Previous
              </button>
              <button 
                onClick={handleNext}
                disabled={selectedOption === null}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                {currentQuestionIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    ):(
        <main className="relative flex min-h-svh flex-1 flex-col bg-background px-4 py-6 md:px-8">
      <div className="animate-fade-in pb-8">
        {/* Header section remains the same */}
        <div className="flex items-center justify-between mb-6">
          <a className="flex items-center text-gray-600 hover:text-lms-primary transition-colors" href="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left h-4 w-4 mr-2">
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
            <span>Back to Dashboard</span>
          </a>
          <div className="flex items-center gap-3">
            <div className="flex items-center text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock h-4 w-4 mr-1">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span className="text-sm">Overdue</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{course.title}</h1>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open h-4 w-4 mr-1">
              <path d="M12 7v14"></path>
              <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
            </svg>
            <span>{course.modules} modules</span>
          </div>
          <div className="text-sm text-gray-500">Instructor: {course.instructor}</div>
        </div>

        <div className="flex h-full w-full min-h-[600px] rounded-lg border">
          {/* Left Panel - Modules List */}
          <div className="w-1/4 overflow-hidden border-r">
            <div className="h-full flex flex-col">
              <div className="bg-gray-200 p-4 border-b">
                <h3 className="font-medium text-gray-800">Course Modules</h3>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div role="progressbar" className="relative w-full overflow-hidden rounded-full bg-blue-800 h-1.5">
                    <div className="h-full w-full flex-1 bg-primary transition-all" style={{ transform: `translateX(-${100 - course.progress}%)` }}></div>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden flex-1">
                <div className="h-full w-full overflow-y-auto">
                  <div className="p-2">
                    {course.modulesList.map((module) => (
                      <div 
                        key={module.id}
                        className={`p-3 mb-2 rounded-md cursor-pointer transition-colors ${
                          module.id === activeModule.id
                            ? 'bg-brand text-white' 
                              : 'bg-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                        onClick={() => setActiveModule(module)}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-sm">{module.title}</h4>
                          {module.completed && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big h-4 w-4 text-green-500">
                              <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                              <path d="m9 11 3 3L22 4"></path>
                            </svg>
                          )}
                        </div>
                        <p className="text-xs mt-1">{module.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Content with Tabs */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Video Player Section */}
              <div className="bg-black aspect-video w-full rounded-r-lg">
                {activeModule.videoUrl ? (
                  <div className="flex items-center justify-center h-full rounded-r-lg">
                    <video 
                      controls
                      className="h-full w-full object-contain rounded-r-lg"
                      poster={`https://img.youtube.com/vi/${activeModule.videoUrl.split('/')[0]}/0.jpg`}
                    >
                      <source src={activeModule.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    <div className="text-center">
                      <p className="mb-2">{activeModule.title}</p>
                      <p className="text-sm text-gray-400">Duration: {activeModule.duration}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tabs Section */}
              <div className="flex-1 p-6 overflow-auto">
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 max-w-xs mb-6">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content">
                    <h2 className="text-xl font-bold mb-4">{activeModule.title}</h2>
                    <div className="prose max-w-none">
                      {activeModule.content.split('\n').map((paragraph, i) => (
                        <p key={i} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="resources">
                    <h2 className="text-xl font-bold mb-4">Resources</h2>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Downloadable Materials</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text h-4 w-4 mr-2">
                              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="16" x2="8" y1="13" y2="13"></line>
                              <line x1="16" x2="8" y1="17" y2="17"></line>
                              <line x1="10" x2="8" y1="9" y2="9"></line>
                            </svg>
                            <span>Lecture Notes.pdf</span>
                          </li>
                          <li className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-code h-4 w-4 mr-2">
                              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <path d="M10 13l-2 2 2 2"></path>
                              <path d="M14 17l2-2-2-2"></path>
                            </svg>
                            <span>Example Code.zip</span>
                          </li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">External Links</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link h-4 w-4 mr-2">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                            <a href="#" className="text-blue-600 hover:underline">MDN Documentation</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-8 flex justify-end">
                  <button onClick={()=>setIsShowQuize(true)} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    Mark as Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    )}
    
    </>
  );
};

export default CourseDetailPage;