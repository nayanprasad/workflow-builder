import { useState } from "react";
import { WorkflowAction } from "@/utils/workflow.ts";
import { ACTION_TYPES, ACTIONS_DEFINITIONS } from "@/utils/actionTypes.ts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActionFormProps {
  onAddAction: (action: WorkflowAction) => void;
}

const ActionForm = ({ onAddAction }: ActionFormProps) => {
  const [selectedActionType, setSelectedActionType] = useState<string>(
    ACTION_TYPES.ALERT,
  );
  const [actionParams, setActionParams] = useState<
    Record<string, string | number>
  >({});

  const handleActionTypeChange = (value: string) => {
    setSelectedActionType(value);
    setActionParams({});
  };

  const handleParamChange = (name: string, value: string) => {
    setActionParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAction: WorkflowAction = {
      id: crypto.randomUUID(),
      type: selectedActionType,
      params: actionParams,
    };
    onAddAction(newAction);
    setActionParams({});
  };

  const selectedAction = ACTIONS_DEFINITIONS[selectedActionType];

  return (
    <Card className="shadow-md border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-700">
        <CardTitle className="text-xl">Add New Action</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="actionType" className="text-sm font-medium">
              Action Type
            </Label>
            <Select
              value={selectedActionType}
              onValueChange={handleActionTypeChange}
            >
              <SelectTrigger id="actionType" className="shadow-sm">
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ACTIONS_DEFINITIONS).map((action) => (
                  <SelectItem key={action.type} value={action.type}>
                    {action.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedAction.description}
            </p>
          </div>

          {selectedAction.paramFields.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-md border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-medium mb-3">Action Parameters</h3>
              <div className="space-y-4">
                {selectedAction.paramFields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name} className="text-sm">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-destructive">*</span>
                      )}
                    </Label>
                    {field.type === "color" ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          value={
                            actionParams[field.name]?.toString() || "#000000"
                          }
                          onChange={(e) =>
                            handleParamChange(field.name, e.target.value)
                          }
                          className="w-10 h-10 p-1 shadow-sm"
                        />
                        <Input
                          type="text"
                          id={field.name}
                          value={actionParams[field.name]?.toString() || ""}
                          onChange={(e) =>
                            handleParamChange(field.name, e.target.value)
                          }
                          placeholder={field.placeholder}
                          required={field.required}
                          className="shadow-sm"
                        />
                      </div>
                    ) : (
                      <Input
                        type={field.type}
                        id={field.name}
                        value={actionParams[field.name]?.toString() || ""}
                        onChange={(e) =>
                          handleParamChange(field.name, e.target.value)
                        }
                        placeholder={field.placeholder}
                        required={field.required}
                        className="shadow-sm"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <Button type="submit" className="w-full shadow-sm">
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
              className="mr-2"
            >
              <path d="M12 5v14M5 12h14"></path>
            </svg>
            Add Action
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ActionForm;
