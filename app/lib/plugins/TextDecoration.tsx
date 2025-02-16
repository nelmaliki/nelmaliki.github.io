import React from 'react';
import ReactDOM from 'react-dom/client';

/**
 * The actual component that is rendered for each correction
 * @param props 
 * @returns 
 */
export function TextDecoration(props: { message: string }): React.ReactElement {
    return <span>{props.message}</span>;
}

//to satisfy ProseMirror's interface, I have to give it a function that returns the dom element. 
export function renderTextDecoration(issue: string) {
    const icon = document.createElement('span');
    const root = ReactDOM.createRoot(icon);
    root.render(<TextDecoration message={issue} />);
    return icon;
}