import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ActionExecutor from "../components/workflow/ActionExecutor";
import { loadWorkflow } from "@/utils/workflow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OutputPage = () => {
  const [buttonLabel, setButtonLabel] = useState("Click Me!");
  const [isDisabled, setIsDisabled] = useState(false);
  const [displayTexts, setDisplayTexts] = useState<string[]>([]);
  const [displayImages, setDisplayImages] = useState<
    { url: string; alt?: string }[]
  >([]);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const workflow = loadWorkflow();

  // Load button configuration on mount
  useEffect(() => {
    setButtonLabel(workflow.buttonLabel || "Click Me!");
  }, [workflow.buttonLabel]);

  // Create action executor
  const { startExecution, isExecuting } = ActionExecutor({
    actions: workflow.actions,
    buttonRef,
    onDisableButton: () => setIsDisabled(true),
    onShowText: (text) => setDisplayTexts((prev) => [...prev, text]),
    onShowImage: (url, alt) =>
      setDisplayImages((prev) => [...prev, { url, alt }]),
  });

  const handleButtonClick = () => {
    setDisplayTexts([]);
    setDisplayImages([]);
    startExecution(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container py-10 max-w-5xl mx-auto px-4">
        <header className="mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Button Workflow Output
            </h1>
            <Button asChild variant="outline" className="shadow-sm">
              <Link to="/" className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5"></path>
                  <path d="M12 19l-7-7 7-7"></path>
                </svg>
                Back to Config
              </Link>
            </Button>
          </div>
        </header>

        <Card className="shadow-lg border-slate-200 dark:border-slate-700 overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <CardTitle className="text-xl text-center">
              Start Workflow
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-10">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full transform scale-150 -z-10"></div>
                  <Button
                    ref={buttonRef}
                    onClick={handleButtonClick}
                    disabled={isDisabled || isExecuting}
                    variant={isDisabled ? "outline" : "default"}
                    size="lg"
                    className={`
                      min-w-[180px] min-h-[50px] text-lg font-medium shadow-md transition-all duration-300
                      ${isExecuting ? "opacity-70 cursor-wait animate-pulse" : "opacity-100"}
                    `}
                  >
                    {buttonLabel}
                  </Button>
                </div>
                {isExecuting && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">
                    Executing workflow...
                  </p>
                )}
              </div>

              {/* Display area for text outputs */}
              {displayTexts.length > 0 && (
                <div className="w-full space-y-3 border-t border-slate-200 dark:border-slate-700 pt-6">
                  <h3 className="font-medium text-lg mb-3">Output:</h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {displayTexts.map((text, index) => (
                      <div
                        key={index}
                        className="p-4 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm"
                      >
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Display area for images */}
              {displayImages.length > 0 && (
                <div className="w-full border-t border-slate-200 dark:border-slate-700 pt-6">
                  <h3 className="font-medium text-lg mb-4">Images:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {displayImages.map((img, index) => (
                      <div key={index} className="flex justify-center">
                        <div className="overflow-hidden rounded-md border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 p-2">
                          <img
                            src={img.url}
                            alt={img.alt || "Workflow image"}
                            className="max-w-full h-auto rounded-sm"
                            style={{ maxHeight: "300px" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OutputPage;
