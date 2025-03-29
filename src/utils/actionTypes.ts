export const ACTION_TYPES = {
  ALERT: 'alert',
  SHOW_TEXT: 'showText',
  SHOW_IMAGE: 'showImage',
  REFRESH_PAGE: 'refreshPage',
  SET_LOCAL_STORAGE: 'setLocalStorage',
  GET_LOCAL_STORAGE: 'getLocalStorage',
  INCREASE_BUTTON_SIZE: 'increaseButtonSize',
  CLOSE_WINDOW: 'closeWindow',
  PROMPT_AND_SHOW: 'promptAndShow',
  CHANGE_BUTTON_COLOR: 'changeButtonColor',
  DISABLE_BUTTON: 'disableButton'
};

// Action definitions with their parameters
export interface ActionDefinition {
  type: string;
  label: string;
  description: string;
  paramFields: ParamField[];
}

export interface ParamField {
  name: string;
  label: string;
  type: 'text' | 'color' | 'number';
  placeholder?: string;
  required?: boolean;
}

// Define all available actions
export const ACTIONS_DEFINITIONS: Record<string, ActionDefinition> = {
  [ACTION_TYPES.ALERT]: {
    type: ACTION_TYPES.ALERT,
    label: 'Alert',
    description: 'Show an alert message',
    paramFields: [
      {
        name: 'message',
        label: 'Message',
        type: 'text',
        placeholder: 'Enter alert message',
        required: true
      }
    ]
  },
  [ACTION_TYPES.SHOW_TEXT]: {
    type: ACTION_TYPES.SHOW_TEXT,
    label: 'Show Text',
    description: 'Render text below the button',
    paramFields: [
      {
        name: 'text',
        label: 'Text',
        type: 'text',
        placeholder: 'Enter text to display',
        required: true
      }
    ]
  },
  [ACTION_TYPES.SHOW_IMAGE]: {
    type: ACTION_TYPES.SHOW_IMAGE,
    label: 'Show Image',
    description: 'Show an image',
    paramFields: [
      {
        name: 'url',
        label: 'Image URL',
        type: 'text',
        placeholder: 'Enter image URL',
        required: true
      },
      {
        name: 'altText',
        label: 'Alt Text',
        type: 'text',
        placeholder: 'Enter image alt text',
        required: false
      }
    ]
  },
  [ACTION_TYPES.REFRESH_PAGE]: {
    type: ACTION_TYPES.REFRESH_PAGE,
    label: 'Refresh Page',
    description: 'Reload the window',
    paramFields: []
  },
  [ACTION_TYPES.SET_LOCAL_STORAGE]: {
    type: ACTION_TYPES.SET_LOCAL_STORAGE,
    label: 'Set LocalStorage',
    description: 'Save a key-value pair in localStorage',
    paramFields: [
      {
        name: 'key',
        label: 'Key',
        type: 'text',
        placeholder: 'Enter key',
        required: true
      },
      {
        name: 'value',
        label: 'Value',
        type: 'text',
        placeholder: 'Enter value',
        required: true
      }
    ]
  },
  [ACTION_TYPES.GET_LOCAL_STORAGE]: {
    type: ACTION_TYPES.GET_LOCAL_STORAGE,
    label: 'Get LocalStorage',
    description: 'Fetch a key and show it as text',
    paramFields: [
      {
        name: 'key',
        label: 'Key',
        type: 'text',
        placeholder: 'Enter key to fetch',
        required: true
      }
    ]
  },
  [ACTION_TYPES.INCREASE_BUTTON_SIZE]: {
    type: ACTION_TYPES.INCREASE_BUTTON_SIZE,
    label: 'Increase Button Size',
    description: 'Make the button grow on click',
    paramFields: [
      {
        name: 'scale',
        label: 'Scale Factor',
        type: 'number',
        placeholder: 'Enter scale factor (e.g. 1.2)',
        required: false
      }
    ]
  },
  [ACTION_TYPES.CLOSE_WINDOW]: {
    type: ACTION_TYPES.CLOSE_WINDOW,
    label: 'Close Window',
    description: 'Try to close the window (may not work depending on browser permissions)',
    paramFields: []
  },
  [ACTION_TYPES.PROMPT_AND_SHOW]: {
    type: ACTION_TYPES.PROMPT_AND_SHOW,
    label: 'Prompt and Show',
    description: 'Ask user for input and show their response',
    paramFields: [
      {
        name: 'promptMessage',
        label: 'Prompt Message',
        type: 'text',
        placeholder: 'Enter prompt message',
        required: true
      }
    ]
  },
  [ACTION_TYPES.CHANGE_BUTTON_COLOR]: {
    type: ACTION_TYPES.CHANGE_BUTTON_COLOR,
    label: 'Change Button Color',
    description: 'Change the button\'s color',
    paramFields: [
      {
        name: 'color',
        label: 'Color',
        type: 'color',
        placeholder: '#000000',
        required: false
      }
    ]
  },
  [ACTION_TYPES.DISABLE_BUTTON]: {
    type: ACTION_TYPES.DISABLE_BUTTON,
    label: 'Disable Button',
    description: 'Disable the button after the action is triggered',
    paramFields: []
  }
};
