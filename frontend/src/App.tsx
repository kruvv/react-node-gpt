
import './App.css'
import {useState} from "react";

function App() {
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: ''
  }

  const chat = async (e, message: string) => {
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);

    const msgs = chats;
    msgs.push({role: 'user', content: message});
    setChats(msgs);

    setMessage('');

    options.body = JSON.stringify({
        chats,
    });

    let response = null;
    try {
        response = await fetch('http://localhost:8000/', options);
    } catch (error) {
        console.log(error);
    }

    const data = await response?.json();

    msgs.push(data.output);
    setChats(msgs);
    setIsTyping(false);

    // fetch('http://localhost:8000/', options)
    //     .then((response) => response.json())
    //     .then((data) => {
    //       msgs.push(data.output);
    //       setChats(msgs);
    //       setIsTyping(false);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
  }

  return (
      <main>
        <h1>Chat AI</h1>

        <section>
          {chats && chats.length
              ? chats.map((chat, index) => (
                  <p
                      key={index}
                      className={
                        chat.role === 'user'
                            ? 'user_msg'
                            : ''
                      }
                  >
                              <span>
                                  <b>
                                      {chat.role.toUpperCase()}
                                  </b>
                              </span>
                    <span>:</span>
                    <span>{chat.content}</span>
                  </p>
              ))
              : ''}
        </section>

        <div className={isTyping ? '' : 'hide'}>
          <p>
            <i>{isTyping ? 'Think...' : ''}</i>
          </p>
        </div>

        <form
            action=""
            onSubmit={(e) => chat(e, message)}
        >
          <input
              type="text"
              name="message"
              value={message}
              placeholder="Type a message here and hit Enter..."
              onChange={(e) =>
                  setMessage(e.target.value)
              }
          />
        </form>
      </main>
  )
}

export default App
