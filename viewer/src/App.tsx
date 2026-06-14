import { useState, useEffect } from 'react'

export default function App() {
  const [slideName, setSlideName] = useState('Waiting for presentation...')
  const [text, setText] = useState('')
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'slideChanged') {
        setSlideName(message.slideName);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSubmit = () => {
    if (text.trim()) {
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      setText('')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">{slideName}</h1>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-40 p-2 border rounded-md"
          placeholder="Enter your text here..."
        />
        <button
          onClick={handleSubmit}
          className="w-full mt-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
      {showToast && (
        <div className="fixed bottom-4 right-4 px-6 py-3 text-white bg-green-500 rounded-lg shadow-lg">
          Well submitted!
        </div>
      )}
    </div>
  )
}