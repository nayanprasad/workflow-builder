import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ActionExecutor from "../components/workflow/ActionExecutor";
import { loadWorkflow } from "@/utils/workflow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

const OutputPage = () => {
  const [buttonLabel, setButtonLabel] = useState("Click Me!");
  const [isDisabled, setIsDisabled] = useState(false);
  const [displayTexts, setDisplayTexts] = useState<string[]>([]);
  const [displayImages, setDisplayImages] = useState<
    { url: string; alt?: string }[]
  >([]);
  const [stepOutputs, setStepOutputs] = useState<{
    [key: number]: { text?: string; image?: { url: string; alt?: string } };
  }>({});
  const [activeStep, setActiveStep] = useState<string>("");
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const workflow = loadWorkflow();

  useEffect(() => {
    setButtonLabel(workflow.buttonLabel || "Click Me!");
  }, [workflow.buttonLabel]);

  const { startExecution, isExecuting, currentActionIndex } = ActionExecutor({
    actions: workflow.actions,
    buttonRef,
    onDisableButton: () => setIsDisabled(true),
    onShowText: (text) => {
      setDisplayTexts((prev) => [...prev, text]);
      if (currentActionIndex !== null) {
        setStepOutputs((prev) => ({
          ...prev,
          [currentActionIndex]: { ...prev[currentActionIndex], text },
        }));
      }
    },
    onShowImage: (url, alt) => {
      setDisplayImages((prev) => [...prev, { url, alt }]);
      if (currentActionIndex !== null) {
        setStepOutputs((prev) => ({
          ...prev,
          [currentActionIndex]: {
            ...prev[currentActionIndex],
            image: { url, alt },
          },
        }));
      }
    },
  });

  // Update active step when currentActionIndex changes
  useEffect(() => {
    if (currentActionIndex !== null) {
      setActiveStep(`step-${currentActionIndex}`);
    }
  }, [currentActionIndex]);

  const handleButtonClick = () => {
    setDisplayTexts([]);
    setDisplayImages([]);
    setStepOutputs({});
    setActiveStep("step-0");
    startExecution(0);
  };

  const getStepStatus = (index: number) => {
    if (currentActionIndex === null) return "pending";
    if (currentActionIndex === index) return "executing";
    if (currentActionIndex > index) return "completed";
    return "pending";
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
              </div>

              {/* Workflow Steps Accordion */}
              <div className="w-full">
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  value={activeStep}
                  onValueChange={setActiveStep}
                >
                  {workflow.actions.map((action, index) => {
                    const status = getStepStatus(index);
                    return (
                      <AccordionItem key={action.id} value={`step-${index}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            {status === "completed" && (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            )}
                            {status === "executing" && (
                              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                            )}
                            {status === "pending" && (
                              <Circle className="h-5 w-5 text-slate-400" />
                            )}
                            <span className="font-medium">
                              Step {index + 1}: {action.type}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            {stepOutputs[index]?.text && (
                              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                                {stepOutputs[index].text}
                              </div>
                            )}
                            {stepOutputs[index]?.image && (
                              <div className="flex justify-center">
                                <div className="overflow-hidden rounded-md border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 p-2">
                                  <img
                                    src={stepOutputs[index].image.url}
                                    alt={
                                      stepOutputs[index].image.alt ||
                                      "Step output"
                                    }
                                    className="max-w-full h-auto rounded-sm"
                                    style={{ maxHeight: "300px" }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OutputPage;
