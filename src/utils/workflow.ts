export interface WorkflowAction {
    id: string;
    type: string;
    params: Record<string, any>;
}

export interface WorkflowConfig {
    buttonLabel: string;
    actions: WorkflowAction[];
}

export const DEFAULT_WORKFLOW: WorkflowConfig = {
    buttonLabel: "Click Me",
    actions: []
};

export const WORKFLOW_STORAGE_KEY = "workflow_config";

export const saveWorkflow = (workflow: WorkflowConfig): void => {
    localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(workflow));
};

export const loadWorkflow = (): WorkflowConfig => {
    const stored = localStorage.getItem(WORKFLOW_STORAGE_KEY);
    if (!stored) return DEFAULT_WORKFLOW;

    try {
        return JSON.parse(stored) as WorkflowConfig;
    } catch (e) {
        console.error("Failed to parse workflow from localStorage", e);
        return DEFAULT_WORKFLOW;
    }
};

export const clearWorkflow = (): void => {
    localStorage.removeItem(WORKFLOW_STORAGE_KEY);
};

export const setLocalStorageItem = (key: string, value: string): void => {
    localStorage.setItem(key, value);
};

export const getLocalStorageItem = (key: string): string | null => {
    return localStorage.getItem(key);
};
