import { useCallback, useEffect, useRef, useState } from "react";
import {
  getLocalStorageItem,
  loadWorkflowState,
  resetWorkflowState,
  saveWorkflowState,
  setLocalStorageItem,
  WorkflowAction,
  WorkflowState,
} from "@/utils/workflow.ts";
import { ACTION_TYPES } from "@/utils/actionTypes.ts";

interface ActionExecutorProps {
  actions: WorkflowAction[];
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  onDisableButton?: () => void;
  onShowText?: (text: string) => void;
  onShowImage?: (url: string, alt?: string) => void;
}

const ActionExecutor = ({
  actions,
  buttonRef,
  onDisableButton,
  onShowText,
  onShowImage,
}: ActionExecutorProps) => {
  const [currentActionIndex, setCurrentActionIndex] = useState<number | null>(
    null,
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const initialLoadRef = useRef(false);

  const currentActionIndexRef = useRef<number | null>(null);

  // Initialize workflow state management (only called once)
  const initializeWorkflowState = useCallback(() => {
    if (initialLoadRef.current) return; // Skip if already initialized

    try {
      const state = loadWorkflowState();

      if (state) {
        // Generate completed steps array based on lastCompletedStep
        const completed = Array.from(
          { length: state.lastCompletedStep + 1 },
          (_, i) => i,
        );

        setCompletedSteps(completed);
        initialLoadRef.current = true;
        return state;
      }
    } catch (error) {
      console.error("Error initializing workflow state:", error);
    }

    initialLoadRef.current = true;
    // Default state if nothing found or error
    return {
      lastCompletedStep: -1,
      currentStep: 0,
      isCompleted: false,
    };
  }, [loadWorkflowState]);

  // Keep the ref in sync with the state
  useEffect(() => {
    currentActionIndexRef.current = currentActionIndex;
  }, [currentActionIndex]);

  // Load state on initial render - ONLY ONCE
  useEffect(() => {
    if (actions.length > 0 && !initialLoadRef.current) {
      initializeWorkflowState();
    }
  }, [actions.length, initializeWorkflowState]);

  const executeWorkflowAction = useCallback(
    async (action: WorkflowAction, index: number): Promise<boolean> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          let shouldContinue = true;

          switch (action.type) {
            case ACTION_TYPES.ALERT: {
              alert(action.params.message || "Alert!");
              break;
            }

            case ACTION_TYPES.SHOW_TEXT:
              if (onShowText) {
                onShowText(action.params.text || "");
              }
              break;

            case ACTION_TYPES.SHOW_IMAGE:
              if (onShowImage) {
                onShowImage(action.params.url, action.params.altText);
              }
              break;

            case ACTION_TYPES.REFRESH_PAGE: {
              const state: WorkflowState = {
                lastCompletedStep: index,
                currentStep: index + 1,
                isCompleted: false,
              };
              saveWorkflowState(state);

              shouldContinue = false;
              window.location.reload();
              break;
            }

            case ACTION_TYPES.SET_LOCAL_STORAGE:
              if (action.params.key) {
                setLocalStorageItem(
                  action.params.key,
                  action.params.value || "",
                );
              }
              break;

            case ACTION_TYPES.GET_LOCAL_STORAGE:
              if (action.params.key && onShowText) {
                const value = getLocalStorageItem(action.params.key);
                onShowText(`${action.params.key}: ${value || "Not found"}`);
              }
              break;

            case ACTION_TYPES.INCREASE_BUTTON_SIZE:
              if (buttonRef.current) {
                const scale = action.params.scale || 1.2;
                const currentScale = buttonRef.current.style.transform
                  ? parseFloat(
                      buttonRef.current.style.transform
                        .replace("scale(", "")
                        .replace(")", ""),
                    ) || 1
                  : 1;
                buttonRef.current.style.transform = `scale(${currentScale * scale})`;
                buttonRef.current.style.transition = "transform 0.3s ease";
              }
              break;

            case ACTION_TYPES.CLOSE_WINDOW: {
              const state: WorkflowState = {
                lastCompletedStep: index,
                currentStep: index + 1,
                isCompleted: false,
              };
              saveWorkflowState(state);

              shouldContinue = false;
              window.close();
              break;
            }

            case ACTION_TYPES.PROMPT_AND_SHOW: {
              if (onShowText) {
                const userInput = prompt(
                  action.params.promptMessage || "Please enter a value:",
                );
                onShowText(`You entered: ${userInput || "Nothing"}`);
              }
              break;
            }

            case ACTION_TYPES.CHANGE_BUTTON_COLOR:
              if (buttonRef.current) {
                if (action.params.color) {
                  buttonRef.current.style.backgroundColor = action.params.color;
                } else {
                  const randomColor =
                    "#" + Math.floor(Math.random() * 16777215).toString(16);
                  buttonRef.current.style.backgroundColor = randomColor;
                }
              }
              break;

            case ACTION_TYPES.DISABLE_BUTTON:
              if (onDisableButton) {
                onDisableButton();
              }
              break;

            default:
              console.warn(`Unknown action type: ${action.type}`);
          }

          if (shouldContinue) {
            if (!completedSteps.includes(index)) {
              const newCompletedSteps = [...completedSteps, index];
              setCompletedSteps(newCompletedSteps);

              const state: WorkflowState = {
                lastCompletedStep: index,
                currentStep: index + 1,
                isCompleted: index + 1 >= actions.length,
              };
              saveWorkflowState(state);
            }
          }

          resolve(shouldContinue);
        }, 500);
      });
    },
    [
      buttonRef,
      onDisableButton,
      onShowImage,
      onShowText,
      completedSteps,
      actions.length,
      saveWorkflowState,
    ],
  );

  const executeActions = useCallback(
    async (startIndex: number) => {
      // Don't execute if we're already doing so
      if (isExecuting) return;

      setIsExecuting(true);
      let currentIndex = startIndex;

      while (currentIndex < actions.length) {
        setCurrentActionIndex(currentIndex);
        const action = actions[currentIndex];

        // If this step has already been completed, skip it
        if (completedSteps.includes(currentIndex)) {
          currentIndex++;
          continue;
        }

        try {
          const shouldContinue = await executeWorkflowAction(
            action,
            currentIndex,
          );

          if (!shouldContinue) {
            // This action requested to stop the execution (like refresh or close)
            break;
          }

          currentIndex++;
        } catch (error) {
          console.error(`Error executing action ${action.type}:`, error);
          break;
        }
      }

      if (currentIndex >= actions.length) {
        // Workflow completed
        setIsExecuting(false);
        setCurrentActionIndex(null);

        // Mark workflow as completed
        const state: WorkflowState = {
          lastCompletedStep: actions.length - 1,
          currentStep: actions.length,
          isCompleted: true,
        };
        saveWorkflowState(state);
      }
    },
    [
      actions,
      executeWorkflowAction,
      completedSteps,
      isExecuting,
      saveWorkflowState,
    ],
  );

  useEffect(() => {
    if (actions.length > 0 && !isExecuting && initialLoadRef.current) {
      const state = loadWorkflowState();

      if (state && !state.isCompleted) {
        const startFrom = state.currentStep;

        if (startFrom >= 0 && startFrom < actions.length) {
          console.log("Resuming workflow from step:", startFrom);

          const timer = setTimeout(() => {
            executeActions(startFrom);
          }, 500);

          return () => clearTimeout(timer);
        }
      }
    }
  }, [actions.length, isExecuting]);

  const startExecution = useCallback(
    (startIndex = 0) => {
      setCompletedSteps([]);
      resetWorkflowState();
      executeActions(startIndex);
    },
    [executeActions, resetWorkflowState],
  );

  const resetWorkflow = useCallback(() => {
    setCompletedSteps([]);
    setCurrentActionIndex(null);
    setIsExecuting(false);
    resetWorkflowState();
    initialLoadRef.current = false;
  }, [resetWorkflowState]);

  return {
    startExecution,
    isExecuting,
    currentActionIndex,
    completedSteps,
    resetWorkflow,
  };
};

export default ActionExecutor;