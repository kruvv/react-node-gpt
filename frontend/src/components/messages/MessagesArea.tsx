import React from 'react';
import type {IMSGS} from "../forms/FormInput.tsx";
import {USER, /*USER_LABEL, USER_MSG*/} from "../../constants.ts";
import Loader from "../loaders/Loader.tsx";
import  styles  from './MessagesArea.module.css'

interface IMessageArea {
    chats: IMSGS[]
    isTyping: boolean
}

const MessagesArea: React.FC<IMessageArea> = ({chats, isTyping}) => {

    return (
        <section>
            {chats && chats.length
                ? chats.map((chat, index) => (
                    <div
                        key={index}
                        className={
                            chat.role === USER
                                ? styles.user_msg
                                : ''
                        }
                    >
                        <p className={styles.think}>{chat.thinking}</p>
                        <p className={styles.content}>{chat.content}</p>
                    </div>
                ))
                : ''}
            {isTyping && <Loader />}
        </section>
    );
};

export default MessagesArea;