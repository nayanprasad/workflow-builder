import { useCallback, useEffect, useRef, useState } from "react";
import {
  getLocalStorageItem,
  setLocalStorageItem,
  WorkflowAction,
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

  // Use a ref to always have access to the latest action index
  const currentActionIndexRef = useRef<number | null>(null);

  // Keep the ref in sync with the state
  useEffect(() => {
    currentActionIndexRef.current = currentActionIndex;
  }, [currentActionIndex]);

  const executeWorkflowAction = useCallback(
    async (action: WorkflowAction): Promise<boolean> => {
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
              // Use the ref to get the current index, not the closure value
              const nextActionIndex =
                currentActionIndexRef.current !== null
                  ? currentActionIndexRef.current + 1
                  : "";
              setLocalStorageItem(
                "next_workflow_action_index",
                nextActionIndex.toString(),
              );
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
              const nextActionIndex =
                currentActionIndexRef.current !== null
                  ? currentActionIndexRef.current + 1
                  : "";
              setLocalStorageItem(
                "next_workflow_action_index",
                nextActionIndex.toString(),
              );
              shouldContinue = false;
              window.close();
              break;
            }

            case ACTION_TYPES.PROMPT_AND_SHOW: {
              // Prompt is synchronous - execution will pause until user responds
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

          resolve(shouldContinue);
        }, 500); // Small delay between actions for better visual feedback
      });
    },
    [buttonRef, onDisableButton, onShowImage, onShowText],
  );

  const executeActions = useCallback(
    async (startIndex: number) => {
      setIsExecuting(true);
      let currentIndex = startIndex;

      while (currentIndex < actions.length) {
        setCurrentActionIndex(currentIndex);
        const action = actions[currentIndex];

        try {
          const shouldContinue = await executeWorkflowAction(action);

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
        setIsExecuting(false);
        setCurrentActionIndex(null);
      }
    },
    [actions, executeWorkflowAction],
  );

  // This is for refresh or close
  useEffect(() => {
    const nextActionIndex = getLocalStorageItem("next_workflow_action_index");

    if (nextActionIndex && actions.length > 0) {
      try {
        const parsedIndex = parseInt(nextActionIndex, 10);
        if (parsedIndex >= 0 && parsedIndex < actions.length) {
          console.log("Resuming workflow from index:", parsedIndex);
          setLocalStorageItem("next_workflow_action_index", "");
          console.log("Continuing the workflow in ...")
          setTimeout(() => {
            executeActions(parsedIndex);
          }, 100);
        }
      } catch (error) {
        console.error("Error parsing saved workflow state:", error);
      }
    }
  }, [actions, executeActions]);

  const startExecution = useCallback(
    (startIndex = 0) => {
      executeActions(startIndex);
    },
    [executeActions],
  );

  return { startExecution, isExecuting, currentActionIndex };
};

export default ActionExecutor;
