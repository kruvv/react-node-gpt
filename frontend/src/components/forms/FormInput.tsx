import React, {useCallback, useState} from 'react';

export type RolesType = 'user' | 'assistant'

export interface IMSGS {
    role: RolesType
    content: string
    thinking?: string
}

interface IFormInput {
    setIsTyping: React.Dispatch<React.SetStateAction<boolean>>
    setChats: React.Dispatch<React.SetStateAction<IMSGS[]>>
    chats: IMSGS[]
}

const FormInput: React.FC<IFormInput> = ({setIsTyping, setChats, chats}) => {

    const [message, setMessage] = useState('');

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const trimmed = message.trim();
            if (!trimmed) return;

            setIsTyping(true);

            const userMsg: IMSGS = { role: 'user', content: trimmed };
            const outgoingChats = [...chats, userMsg];

            // Optimistically update UI
            setChats(outgoingChats);
            setMessage('');

            try {
                const response = await fetch('http://localhost:8000/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chats: outgoingChats }),
                });

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                const data = await response.json();

                if (data?.output) {
                    setChats(prev => [...prev, data.output as IMSGS]);
                }
            } catch (error) {
                console.error(error);
                // Optionally surface an error message in the chat
                setChats(prev => [
                    ...prev,
                    { role: 'assistant', content: "Sorry, something went wrong. Please try again." },
                ]);
            } finally {
                setIsTyping(false);
            }
        },
        [message, chats, setChats, setIsTyping]
    );

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)
    },[]);

    return (
        <form
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                name="message"
                value={message}
                placeholder="Type a message here and hit Enter..."
                onChange={handleChange}
            />
        </form>
    );
};

export default FormInput;