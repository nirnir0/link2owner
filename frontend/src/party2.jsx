// Page3Party2.jsx
import React, { useState, useEffect } from "react";
import { backend } from "declarations/backend";
import { useParams } from "react-router-dom";

export default function Page3Party2() {
  const { id } = useParams();
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState("");
  const [signature, setSignature] = useState("");
  const [amount, setAmount] = useState("");
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    backend.getOrchestration(Number(id)).then(setEntry);
  }, [id]);

  const sendMsg = async () => {
    const userMsg = { user: { content: msg } };
    setChat(c => [...c, userMsg]);
    const aiReply = await backend.chat([...chat, userMsg]);
    setChat(c => [...c, { system: { content: aiReply } }]);
    setMsg("");
  };

  const handleSubmit = async () => {
    await backend.addFileOrSignature(Number(id), file, signature);
    await backend.updateOrchestration(Number(id), { Open: null }, [], [], Number(amount));
    setShowForm(false);
  };

  return (
    <div>
      <h2>Party 2 Call (ID {id})</h2>
      <button onClick={() => setShowForm(true)}>End Conversation & Fill Form</button>
      <div>
        <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type message..." />
        <button onClick={sendMsg}>Send</button>
      </div>
      <div>
        {chat.map((m, i) => (
          <div key={i}>{m.user ? <b>User:</b> : <b>AI:</b>} {m.user ? m.user.content : m.system.content}</div>
        ))}
      </div>
      {showForm && (
        <div>
          <h3>End Form</h3>
          <input placeholder="File (mock)" value={file} onChange={e => setFile(e.target.value)} />
          <input placeholder="Signature (mock)" value={signature} onChange={e => setSignature(e.target.value)} />
          <input placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
      <div>
        <a href={`https://icpexplorer.org/canister/${entry?.party1}`}>Party1 ICP Explorer Link</a>
      </div>
    </div>
  );
}
