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
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Button Workflow Configuration</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/output">View Output Page</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Button Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="buttonLabel">Button Label</Label>
                <Input
                  id="buttonLabel"
                  type="text"
                  value={buttonLabel}
                  onChange={(e) => {
                    setButtonLabel(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="Enter button label"
                />
              </div>
            </CardContent>
          </Card>

          <ActionForm onAddAction={handleAddAction} />
        </div>

        <div className="space-y-6">
          <ActionList 
            actions={actions} 
            onRemoveAction={handleRemoveAction} 
            onReorderActions={handleReorderActions} 
          />

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              variant={saved ? "secondary" : "default"}
              className={saved ? "bg-green-500 hover:bg-green-600 text-white" : ""}
            >
              {saved ? "Saved!" : "Save Workflow"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigPage;
