import React from 'react';
import type {IMSGS} from "./forms/FormInput.tsx";
import {USER, USER_LABEL, USER_MSG} from "../constants.ts";

interface IMessageArea {
    chats: IMSGS[]
}

const MessagesArea: React.FC<IMessageArea> = ({chats}) => {

    return (
        <section>
            {chats && chats.length
                ? chats.map((chat, index) => (
                    <p
                        key={index}
                        className={
                            chat.role === USER
                                ? USER_MSG
                                : ''
                        }
                    >
                              <span>
                                  <b className={ chat.role === USER ? USER_LABEL : '' }>
                                      {chat.role.toUpperCase()}
                                  </b>
                              </span>
                        <span>:</span>
                        <span>{chat.content}</span>
                    </p>
                ))
                : ''}
        </section>
    );
};

export default MessagesArea;