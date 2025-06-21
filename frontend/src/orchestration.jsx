// Page1Orchestration.jsx
import React, { useState, useEffect } from "react";
import { backend } from "declarations/backend";

export default function Page1Orchestration() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ inbound: "", outbound: "", query: "", amount: "", party1: "", party2: "", contract: false, dateOfExp: "" });

  useEffect(() => {
    backend.listOrchestration().then(setEntries);
  }, []);

  const handleAdd = async () => {
    await backend.addOrchestrationEntry(
      form.inbound, form.outbound, form.query, Number(form.amount), form.party1, form.party2, form.contract, Date.parse(form.dateOfExp)
    );
    backend.listOrchestration().then(setEntries);
  };

  return (
    <div>
      <h2>Arbitrator Orchestration Table</h2>
      <table border="1">
        <thead>
          <tr>
            <th>SINO</th><th>Inbound</th><th>Outbound</th><th>Query</th><th>Date</th><th>Exp</th>
            <th>Status</th><th>Amount</th><th>Contract/Escrow</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(e => (
            <tr key={e.sino} style={e.contract ? { background: "#ffe" } : {}}>
              <td>{e.sino}</td>
              <td>{e.inbound}</td>
              <td>{e.outbound}</td>
              <td>{e.query}</td>
              <td>{new Date(Number(e.date) / 1000000).toLocaleString()}</td>
              <td>{new Date(Number(e.dateOfExp) / 1000000).toLocaleString()}</td>
              <td>{Object.keys(e.status)[0]}</td>
              <td>{e.amount}</td>
              <td>{e.contract ? "YES" : "NO"}</td>
              <td>
                <button>Close</button>
                <button>Party1 Success</button>
                <button>Party2 Success</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Add Orchestration Entry</h3>
      <input placeholder="Inbound" onChange={e => setForm(f => ({ ...f, inbound: e.target.value }))} />
      <input placeholder="Outbound" onChange={e => setForm(f => ({ ...f, outbound: e.target.value }))} />
      <input placeholder="Query" onChange={e => setForm(f => ({ ...f, query: e.target.value }))} />
      <input placeholder="Amount" type="number" onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
      <input placeholder="Party1" onChange={e => setForm(f => ({ ...f, party1: e.target.value }))} />
      <input placeholder="Party2" onChange={e => setForm(f => ({ ...f, party2: e.target.value }))} />
      <label>
        Contract/Escrow <input type="checkbox" onChange={e => setForm(f => ({ ...f, contract: e.target.checked }))} />
      </label>
      <input placeholder="Date of Expiry" type="date" onChange={e => setForm(f => ({ ...f, dateOfExp: e.target.value }))} />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
