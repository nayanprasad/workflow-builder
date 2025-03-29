import { useState } from 'react';
import { WorkflowAction } from '@/utils/workflow.ts';
import { ACTIONS_DEFINITIONS } from '@/utils/actionTypes.ts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ActionListProps {
  actions: WorkflowAction[];
  onRemoveAction: (id: string) => void;
  onReorderActions: (newActions: WorkflowAction[]) => void;
}

const ActionList = ({ actions, onRemoveAction, onReorderActions }: ActionListProps) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === id) return;

    // Reorder the actions
    const draggedIndex = actions.findIndex(action => action.id === draggedItem);
    const targetIndex = actions.findIndex(action => action.id === id);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newActions = [...actions];
    const [removed] = newActions.splice(draggedIndex, 1);
    newActions.splice(targetIndex, 0, removed);
    
    onReorderActions(newActions);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  if (actions.length === 0) {
    return (
      <Alert variant="default" className="bg-muted/50">
        <AlertDescription>
          No actions added yet. Add an action to get started.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Actions</CardTitle>
        <p className="text-sm text-muted-foreground">Drag and drop to reorder actions</p>
      </CardHeader>
      <CardContent className="space-y-2">
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
                flex items-center justify-between p-3 bg-card border rounded-md shadow-sm
                ${draggedItem === action.id ? 'opacity-50' : 'opacity-100'}
                cursor-move
              `}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-muted rounded-full text-muted-foreground">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium">{actionDef.label}</h3>
                  <div className="text-sm text-muted-foreground">
                    {Object.entries(action.params).map(([key, value]) => (
                      <span key={key} className="mr-2">
                        {key}: <span className="font-mono">{value?.toString()}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => onRemoveAction(action.id)}
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                title="Remove action"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ActionList;
