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
    setActionParams({}); // Reset params when changing action type
  };

  const handleParamChange = (name: string, value: string) => {
    setActionParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a new action
    const newAction: WorkflowAction = {
      id: crypto.randomUUID(),
      type: selectedActionType,
      params: actionParams,
    };

    onAddAction(newAction);

    // Reset form
    setActionParams({});
  };

  // Get the selected action definition
  const selectedAction = ACTIONS_DEFINITIONS[selectedActionType];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Action</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="actionType">Action Type</Label>
            <Select
              value={selectedActionType}
              onValueChange={handleActionTypeChange}
            >
              <SelectTrigger id="actionType">
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
            <p className="text-sm text-muted-foreground">
              {selectedAction.description}
            </p>
          </div>

          {/* Render parameter fields based on the selected action */}
          {selectedAction.paramFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}{" "}
                {field.required && <span className="text-destructive">*</span>}
              </Label>
              {field.type === "color" ? (
                <div className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={actionParams[field.name]?.toString() || "#000000"}
                    onChange={(e) =>
                      handleParamChange(field.name, e.target.value)
                    }
                    className="w-10 h-10 p-1"
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
                />
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Add Action
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ActionForm;
