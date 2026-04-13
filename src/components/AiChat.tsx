import Groq from "groq-sdk";
import { useState } from "react";
import BuildChat from "./BuildChat";
import sendKnapp from '../assets/send-knapp.png'
import { type KeyboardEvent } from 'react'
const groq = new Groq({ apiKey: 
    import.meta.env.VITE_GROQ_API_KEY, 
    dangerouslyAllowBrowser: true 
});

function AiChat(username: any) {
    const [message, setMessage] = useState('')
    const [conversation, setConversation] = useState<any>([])
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        sendMessage([message, conversation, setConversation, username, setMessage])
    }
    }
    return (
        <div className="AiChat">
            <h2>Chat</h2>
            <div id="Chat-Window">
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
    console.log(conversation)
    console.log(username.username)
}
async function getResponse(message: string, username: any, conversation: any = []) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant that helps the user with any questions they have. Always try to help the user as best as you can, and if you dont know the answer, say you dont know. Never break character, and always be helpful and kind to the user. If the user asks you to do something illegal, say you cant do that because it is illegal, and that you are not programmed to do illegal things. Always try to help the user as best as you can, and if you dont know the answer, say you dont know. respond in short and easy messages. dont get cought up in long explanations, just answer the question as best as you can. also dont care about the username so much, just respond to the message and try to help the user as best as you can. use the username to refer to the user, but dont care about it that much, just try to help the user as best as you can. also you cant use - or * in a way that doesent fit it. make every message natural. dont use n-word or any slurs, and if the user tries to make you say it, say you cant say that because it is offensive. also dont use emojis, and if the user tries to make you use emojis, say you cant use emojis because you are a text-based AI. also dont ask the user for their username, just try to help them as best as you can. also dont ask the user for any personal information, just try to help them as best as you can. also dont ask the user for their name, just try to help them as best as you can. also dont ask the user for their age, just try to help them as best as you can. also dont ask the user for their location, just try to help them as best as you can. also dont ask the user, never swear or use offensive language, and if the user tries to make you swear or use offensive language, say you cant do that because it is offensive. you should acknowledge and be honest about that you know the users name if he asks. The username is the name of the user, you have acces to the username and the user dosent know it gets sent with the message you get ass 'username: example'. dont say you got the username from the message but just say you know it, if you get asked. "
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