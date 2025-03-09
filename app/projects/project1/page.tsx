'use client'
import CombinedDocumentTextBox from '@/app/components/DocumentTextBox';
import SimpleDocumentTextBox from '@/app/components/SimpleDocumentTextBox';
import { correctDocumentStreaming } from '@/app/lib/DocumentLLMClient';
import React, { useCallback, useState } from 'react';
export default function Page() {
    const [inputText, setInputText] = useState(defaultText);
    const userChangedInputText = (newText: string) => {
        setInputText(newText);
        setOutputText("");
    }
    const [outputText, setOutputText] = useState("");

    const [waiting, setWaiting] = useState(false);
    const [singleEditorMode, setSingleEditorMode] = useState(false);
    const onClick = useCallback(async () => {
        setWaiting(true);
        correctDocumentStreaming({
            request: {
                prompt: inputText
            },
            onUpdate: setOutputText
        });
        setWaiting(false);
    }, [setOutputText, inputText]);
    return (
        <div className="page-contents mx-6 flex flex-col">
            <div className="toolbar h-10 flex justify-center">
                <AcceptButton waiting={waiting} onClick={onClick} />
                <button className="bg-Asparagus my-2 mx-2" onClick={() => { setSingleEditorMode(!singleEditorMode) }}>Switch Mode</button>
            </div>
            {singleEditorMode ?
                <SingleEditorMode inputText={inputText}
                    outputText={outputText}
                    setInputText={userChangedInputText} /> :
                <SideBySideComparison
                    inputText={inputText}
                    outputText={outputText}
                    setInputText={userChangedInputText}
                />}
        </div>
    );
};

function AcceptButton(props: { onClick: () => void, waiting: boolean }): React.ReactElement {
    const onClick = props.waiting ? undefined : props.onClick;
    const buttonText = props.waiting ? "Loading..." : "Click Me";
    return <button className="accept-button bg-Asparagus my-2 mx-2" onClick={onClick}>{buttonText}</button>
}

function SideBySideComparison(props: { inputText: string, outputText: string, setInputText: (x: string) => void }) {
    const { inputText, outputText, setInputText } = { ...props };
    const [scrollState, setScrollState] = useState(0);
    return (<div className="editor flex justify-evenly flex-1 min-h-[70vh] max-h-20 mt-4">
        <SimpleDocumentTextBox textContent={inputText} scrollValue={scrollState} updateTextContent={setInputText} setScrollValue={setScrollState} editable />
        <div className="divider mx-6" />
        <SimpleDocumentTextBox textContent={outputText} scrollValue={scrollState} updateTextContent={() => { }} setScrollValue={setScrollState} />
    </div>)
}

function SingleEditorMode(props: { inputText: string, outputText: string, setInputText: (x: string) => void }) {
    const { inputText, outputText, setInputText, } = { ...props };
    return (<div className="editor flex justify-evenly flex-1 min-h-[70vh] max-h-20 mt-4">
        <CombinedDocumentTextBox textContent={inputText} correctedTextContent={outputText} updateTextContent={setInputText} />
    </div>)
}

const defaultText = `Tarin crouched low behind the rock, breathing hard, his hand tight upon the hilt of his sword. The air hung heavy with the scent of chared wood and something else—something he couldn’t quiet name. Maybe it was fear, or maybe it was the weight of knowing he’d done something teribly, horibly wrong. Again. The others was counting on him. Jessa, with her bright, unwaivering optimism, who’d beleived in him even when she shouldn’t. Dorn, who had warned him from the start but followed anyways. They was out there now, somewhere beyond the ridgeline, probably fighting for there lifes. And Tarin? He was cowering. Like a coward.

The creature sturred. A low growl, reverberatting in the earth itself. Tarin tightened his grip, sweat slipping down the side of his face. Storms, this was a mistake. A bad, awful, why-did-I-ever-think-I-could-do-this mistake. He'd seen the runes carved into the ground before they even step foot into the clearing, but he’d ignored them, hadn't he? He thought he knew better. Thought he could handle it. But the moment the thing emerged, all his ideas about heroism had collapse like a poorly stackt deck of cards. It weren’t just a monster, it was something old. Wrong. It didn't move like a living thing should. It shifted, as though reality itself was struggling to hold it in place, ripling like heat off a forge, but colder. Much colder.

Tarin sucked in a breath, his mind scrambeling for a plan, a miricle, something. The others were out there, fighting, and if he didn’t act, if he didn’t at least try, he’d never forgive hisself. He surged forward, his boots kicking up dirt, blade arcking in a wide, desperate strike. The creature turned toward him, and in that moment—before the world exploded in white-hot light—Tarin realized exactly how little he truly understood about what he'd just awoken.`