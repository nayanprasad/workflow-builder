import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ActionForm from "../components/workflow/ActionForm";
import ActionList from "../components/workflow/ActionList";
import {
  loadWorkflow,
  saveWorkflow,
  WorkflowAction,
  WorkflowConfig,
} from "@/utils/workflow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ConfigPage = () => {
  const [buttonLabel, setButtonLabel] = useState("Click Me!");
  const [actions, setActions] = useState<WorkflowAction[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const workflow = loadWorkflow();
    setButtonLabel(workflow.buttonLabel);
    setActions(workflow.actions);
  }, []);

  const handleAddAction = (action: WorkflowAction) => {
    setActions((prev) => [...prev, action]);
    setSaved(false);
  };

  const handleRemoveAction = (id: string) => {
    setActions((prev) => prev.filter((action) => action.id !== id));
    setSaved(false);
  };

  const handleEditAction = (id: string, updatedAction: WorkflowAction) => {
    setActions((prev) =>
      prev.map((action) => (action.id === id ? updatedAction : action)),
    );
    setSaved(false);
  };

  const handleReorderActions = (newActions: WorkflowAction[]) => {
    setActions(newActions);
    setSaved(false);
  };

  const handleSave = () => {
    const workflow: WorkflowConfig = {
      buttonLabel,
      actions,
    };

    saveWorkflow(workflow);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container py-10 max-w-5xl mx-auto px-4">
        <header className="mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Button Workflow Builder
            </h1>
            <Button asChild variant="outline" className="shadow-sm">
              <Link to="/output" className="flex items-center gap-2">
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
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
                View Output
              </Link>
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card className="shadow-md border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-700">
                <CardTitle className="text-xl">Button Settings</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="buttonLabel"
                      className="text-sm font-medium"
                    >
                      Button Label
                    </Label>
                    <Input
                      id="buttonLabel"
                      type="text"
                      value={buttonLabel}
                      onChange={(e) => {
                        setButtonLabel(e.target.value);
                        setSaved(false);
                      }}
                      placeholder="Enter button label"
                      className="shadow-sm"
                    />
                  </div>
                  <div className="pt-2">
                    <div className="relative overflow-hidden rounded-md border border-slate-200 dark:border-slate-700 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800">
                      <Button
                        className="pointer-events-none min-w-[120px]"
                      >
                        {buttonLabel || "Click Me!"}
                      </Button>
                    </div>
                    <p className="text-xs text-center mt-2 text-slate-500 dark:text-slate-400">
                      Button Preview
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ActionForm onAddAction={handleAddAction} />
          </div>

          <div className="space-y-8">
            <ActionList
              actions={actions}
              onRemoveAction={handleRemoveAction}
              onReorderActions={handleReorderActions}
              onEditAction={handleEditAction}
            />

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                variant={saved ? "secondary" : "default"}
                className={`
                  shadow-sm transition-all duration-300
                  ${saved ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                `}
              >
                {saved ? (
                  <span className="flex items-center gap-2">
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
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    Saved!
                  </span>
                ) : (
                  "Save Workflow"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigPage;
