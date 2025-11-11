import { useState } from "react";
import { API_BASE } from "./config.js";
import Card from "./components/Card.jsx";
import Loader from "./components/Loader.jsx";

export default function App() {
  const [tab, setTab] = useState("command");
  const tabs = ["command", "reminders", "crypto", "summarize"];
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-400">
        VoiceFlowAI Dashboard 🚀
      </h1>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              tab === t ? "bg-blue-600 scale-105" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        {tab === "command" && <Command />}
        {tab === "reminders" && <Reminders />}
        {tab === "crypto" && <Crypto />}
        {tab === "summarize" && <Summarize />}
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Command() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="AI Command">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. Remind me to call mom at 6pm"
        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
      />
      <button
        onClick={handleSend}
        className="mt-3 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
      >
        Send
      </button>
      {loading && <Loader />}
      {result && (
        <pre className="mt-4 bg-gray-800 p-3 rounded text-sm overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </Card>
  );
}

function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadReminders() {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/reminders`);
    const data = await res.json();
    setReminders(data.reminders || []);
    setLoading(false);
  }

  return (
    <Card title="Reminders">
      <button
        onClick={loadReminders}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
      >
        Load Reminders
      </button>
      {loading && <Loader />}
      <ul className="mt-4 space-y-2">
        {reminders.map((r, i) => (
          <li key={i} className="bg-gray-800 p-2 rounded">
            <b>{r.text}</b> — {r.when}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Crypto() {
  const [symbol, setSymbol] = useState("bitcoin");
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getPrice() {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/crypto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol }),
    });
    const data = await res.json();
    setPrice(data.usd);
    setLoading(false);
  }

  return (
    <Card title="Crypto Price">
      <input
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
      />
      <button
        onClick={getPrice}
        className="mt-3 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
      >
        Get Price
      </button>
      {loading && <Loader />}
      {price && (
        <p className="mt-3 text-lg text-center">
          💰 {symbol.toUpperCase()} — ${price}
        </p>
      )}
    </Card>
  );
}

function Summarize() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function summarize() {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/summarize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    setSummary(data.summary);
    setLoading(false);
  }

  return (
    <Card title="Summarize URL">
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.bbc.com/news"
        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
      />
      <button
        onClick={summarize}
        className="mt-3 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
      >
        Summarize
      </button>
      {loading && <Loader />}
      {summary && (
        <pre className="mt-4 bg-gray-800 p-3 rounded text-sm overflow-x-auto">
          {summary}
        </pre>
      )}
    </Card>
  );
}
