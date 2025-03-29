import { useState } from "react";
import { WorkflowAction } from "@/utils/workflow.ts";
import { ACTIONS_DEFINITIONS } from "@/utils/actionTypes.ts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ActionListProps {
  actions: WorkflowAction[];
  onRemoveAction: (id: string) => void;
  onReorderActions: (newActions: WorkflowAction[]) => void;
  onEditAction: (id: string, updatedAction: WorkflowAction) => void;
}

const ActionList = ({
  actions,
  onRemoveAction,
  onReorderActions,
  onEditAction,
}: ActionListProps) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [editingAction, setEditingAction] = useState<WorkflowAction | null>(
    null,
  );
  const [editedParams, setEditedParams] = useState<
    Record<string, string | number>
  >({});

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === id) return;

    // Reorder the actions
    const draggedIndex = actions.findIndex(
      (action) => action.id === draggedItem,
    );
    const targetIndex = actions.findIndex((action) => action.id === id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newActions = [...actions];
    const [removed] = newActions.splice(draggedIndex, 1);
    newActions.splice(targetIndex, 0, removed);

    onReorderActions(newActions);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleEditAction = (action: WorkflowAction) => {
    setEditingAction(action);
    setEditedParams({ ...action.params });
  };

  const handleParamChange = (name: string, value: string) => {
    setEditedParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save edited action
  const handleSaveEdit = () => {
    if (editingAction) {
      const updatedAction = {
        ...editingAction,
        params: editedParams,
      };
      onEditAction(editingAction.id, updatedAction);
      setEditingAction(null);
    }
  };

  // Close edit dialog
  const handleCancelEdit = () => {
    setEditingAction(null);
    setEditedParams({});
  };

  if (actions.length === 0) {
    return (
      <Card className="shadow-md border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-700">
          <CardTitle className="text-xl">Workflow Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Alert
            variant="default"
            className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
          >
            <AlertDescription className="text-center py-8 text-slate-500 dark:text-slate-400">
              No actions added yet. Add an action to get started.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-md border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-700">
          <CardTitle className="text-xl">Workflow Actions</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop to reorder actions
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {actions.map((action, index) => {
              const actionDef = ACTIONS_DEFINITIONS[action.type];
              if (!actionDef) return null;

              return (
                <div
                  key={action.id}
                  draggable
                  onDragStart={() => handleDragStart(action.id)}
                  onDragOver={(e) => handleDragOver(e, action.id)}
                  onDragEnd={handleDragEnd}
                  className={`
                    flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 
                    border border-slate-200 dark:border-slate-700 rounded-md shadow-sm
                    ${draggedItem === action.id ? "opacity-50 border-dashed" : "opacity-100"}
                    cursor-move transition-all duration-200 hover:shadow-md
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-medium text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-start text-slate-900 dark:text-slate-200">
                        {actionDef.label}
                      </h3>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {Object.entries(action.params).length > 0 ? (
                          Object.entries(action.params).map(([key, value]) => (
                            <span
                              key={key}
                              className="mr-3 inline-flex items-center"
                            >
                              <span className="text-slate-400 dark:text-slate-500 mr-1">
                                {key}:
                              </span>
                              <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-xs">
                                {value?.toString().substring(0, 30)}
                                {value?.toString().length > 30 ? "..." : ""}
                              </span>
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 italic">
                            No parameters
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      onClick={() => handleEditAction(action)}
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-blue-500 dark:text-slate-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full h-8 w-8"
                      title="Edit action"
                    >
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
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </Button>
                    <Button
                      onClick={() => onRemoveAction(action.id)}
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full h-8 w-8"
                      title="Remove action"
                    >
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
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={editingAction !== null}
        onOpenChange={(open: boolean) => !open && handleCancelEdit()}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Action</DialogTitle>
            <DialogDescription>
              Update the parameters for this action.
            </DialogDescription>
          </DialogHeader>

          {editingAction && (
            <div className="py-4 space-y-4">
              <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
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
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div>
                  <div className="font-medium">
                    {ACTIONS_DEFINITIONS[editingAction.type]?.label}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {ACTIONS_DEFINITIONS[editingAction.type]?.description}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {ACTIONS_DEFINITIONS[editingAction.type]?.paramFields.map(
                  (field) => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={`edit-${field.name}`} className="text-sm">
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
                              editedParams[field.name]?.toString() || "#000000"
                            }
                            onChange={(e) =>
                              handleParamChange(field.name, e.target.value)
                            }
                            className="w-10 h-10 p-1 shadow-sm"
                          />
                          <Input
                            type="text"
                            id={`edit-${field.name}`}
                            value={editedParams[field.name]?.toString() || ""}
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
                          id={`edit-${field.name}`}
                          value={editedParams[field.name]?.toString() || ""}
                          onChange={(e) =>
                            handleParamChange(field.name, e.target.value)
                          }
                          placeholder={field.placeholder}
                          required={field.required}
                          className="shadow-sm"
                        />
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActionList;
