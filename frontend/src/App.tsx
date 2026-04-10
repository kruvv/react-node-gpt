
import './App.css'
import FormInput, {type IMSGS} from "./components/forms/FormInput.tsx";
import MessagesArea from "./components/messages/MessagesArea.tsx";
import {useState} from "react";




function App() {
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [chats, setChats] = useState<IMSGS[]>([]);

  return (
      <>
          <header>
              <h1>Chat AI</h1>
          </header>

          <main>
            <MessagesArea chats={chats} isTyping={isTyping} />
          </main>

          <footer>
              <FormInput setIsTyping={setIsTyping} chats={chats} setChats={setChats}/>
          </footer>
      </>
  )
}

export default App
