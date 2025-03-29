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
    setButtonLabel(workflow.buttonLabel);
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

  // Handle button click
  const handleButtonClick = () => {
    // Clear previous outputs
    setDisplayTexts([]);
    setDisplayImages([]);

    startExecution(0);
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Button Workflow Output</h1>
        <Button asChild variant="outline">
          <Link to="/">Back to Config</Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-center">Dynamic Button</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-8">
          <div className="py-4">
            <Button
              ref={buttonRef}
              onClick={handleButtonClick}
              disabled={isDisabled || isExecuting}
              variant={isDisabled ? "outline" : "default"}
              className={`
                min-w-[150px] min-h-[50px] text-lg transition-all duration-300
                ${isExecuting ? "opacity-70 cursor-wait" : "opacity-100"}
              `}
            >
              {buttonLabel}
            </Button>
          </div>

          {/* Display area for text outputs */}
          {displayTexts.length > 0 && (
            <div className="w-full space-y-2 border-t pt-4">
              <h3 className="font-medium text-lg">Output:</h3>
              {displayTexts.map((text, index) => (
                <div key={index} className="p-3 bg-muted rounded-md">
                  {text}
                </div>
              ))}
            </div>
          )}

          {/* Display area for images */}
          {displayImages.length > 0 && (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
              <h3 className="font-medium text-lg col-span-full">Images:</h3>
              {displayImages.map((img, index) => (
                <div key={index} className="flex justify-center">
                  <img
                    src={img.url}
                    alt={img.alt || "Workflow image"}
                    className="max-w-full h-auto rounded-md shadow"
                    style={{ maxHeight: "300px" }}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OutputPage;
