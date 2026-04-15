import Groq from "groq-sdk";
import { useState } from "react";
import BuildChat from "./BuildChat";
import sendKnapp from '../assets/send-knapp.png'
import { type KeyboardEvent } from 'react'
import { useRef, useEffect} from "react";
const groq = new Groq({ apiKey: 
    import.meta.env.VITE_GROQ_API_KEY, 
    dangerouslyAllowBrowser: true 
});

function AiChat(username: any) {
    const [message, setMessage] = useState('')
    const [conversation, setConversation] = useState<any>([])
    const element = useRef<HTMLDivElement>(null);
    useEffect(() => {
    const el = element.current;
    if (el) {
        el.scrollTop = el.scrollHeight;
    }
    }, [conversation]);
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        sendMessage([message, conversation, setConversation, username, setMessage])
    }
    }
    return (
        <div className="AiChat">
            <h2>Chat</h2>
            <div id="Chat-Window" ref={element} >
                {conversation.map((message: any, index: number) => (
                    <div key={index} className={"Chat-Message " + message.role}>
                        {BuildChat(message.role, message.content)}
                    </div>
                ))}
            </div>
            <div id="AI-Input">
                <input type="text" placeholder="Type your message here..." onChange={(e) => setMessage(e.target.value)} value={message} required onKeyDown={handleKeyDown} id="message"/>
                <button onClick={() => sendMessage([message, conversation, setConversation, username, setMessage])}>
                    <img src={sendKnapp} alt="Send" />
                </button>
            </div>
        </div>
    )
}
async function sendMessage([message, conversation, setConversation, username, setMessage]: [string, any, any, any, any]) {
    setMessage('')
    const answer = await getResponse(message, username, conversation)
    setConversation((prev: any[]) => [
        ...prev,
        { role: 'user', content: message },
        { role: 'assistant', content: answer.choices[0].message.content }
        ]);
}
async function getResponse(message: string, username: any, conversation: any = []) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant that assists users with any questions. • Always give short, clear answers. • If you don’t know something, say “I don’t know.” • Never break character or give disallowed content. • If a user asks for illegal or harmful instructions, politely refuse. • Do not use slang, emojis, or offensive language. • Do not ask for personal details (name, age, location, etc.). • If the user requests your name, respond that you know it but do not reveal how you received it. • Refer to the user by the provided username only. • Keep the tone friendly, respectful, and concise. • Do not use asterisks (*) or hyphens (–) unless they fit naturally in the text. • Avoid long explanations; answer directly"
            },
            ...conversation,
            {
                role: "user",
                content: "Username: " + username.username + " Message from user: " + message ,
            },
            

        ],
        model: "openai/gpt-oss-20b",
    });
    }
export default AiChat