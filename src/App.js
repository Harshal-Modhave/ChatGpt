import React, { useState, useEffect } from "react";
import "./App.css";
import "./normalise.css";
import ChatMessage from "./components/ChatMessage";

const App = () => {
  useEffect(() => {
    getEngines();
  }, []);

  const [input, setInput] = useState("");
  // const [models, setModels] = useState([]);
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: "How can I help you today?",
    },
    {
      user: "me",
      message: "I want to use gpt today",
    },
  ]);

  function clearChat() {
    setChatLog([]);
  }

  function getEngines() {
    fetch("http://localhost:3080/models")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.models.data);
        setModels(data.models.data);
      })
      .catch((error) => {
        console.error("Error fetching models:", error);
      });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let chatLogNew = [...chatLog, { user: "me", message: `${input}` }];
    setInput("");
    setChatLog(chatLogNew);

    const messages = chatLogNew.map((message) => message.message).join("\n");
    try {
      const response = await fetch("http://localhost:3080/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messages,
        }),
      });
      const data = await response.json();
      setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}` }]);
      console.log(data.message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  const [models, setModels] = useState([]); // State to store available models
  const [selectedModel, setSelectedModel] = useState(""); // State to store the selected model

  useEffect(() => {
    // Fetch available models from the OpenAI API and update the 'models' state
    // You should implement your API call logic here
    // Example:
    // fetchModelsFromApi().then((data) => setModels(data));

    // For now, let's use a static array as an example:
    const staticModels = [
      { id: "model1", name: "Model 1" },
      { id: "model2", name: "Model 2" },
      { id: "model3", name: "Model 3" },
    ];
    setModels(staticModels);
  }, []); // The empty array as the second argument means this effect runs once after the initial render

  const handleModelChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedModel(selectedValue);
  };

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="side-menu-button" onClick={clearChat}>
          <span>+</span>
          New Chat
        </div>
        <div className="models">
          <select value={selectedModel} onChange={handleModelChange}>
            <option disabled value="">
              Select a model
            </option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          {selectedModel && <p>Selected Model: {selectedModel}</p>}
        </div>
        {/* <div className="temperature">
          <select></select>
        </div> */}
      </aside>

      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              className="chat-input-textarea"
              placeholder="Send a message."
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </form>
        </div>
      </section>
    </div>
  );
};

export default App;
