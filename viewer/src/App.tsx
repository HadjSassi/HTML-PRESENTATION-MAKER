import { useEffect, useMemo, useRef, useState } from 'react'

type SlideState = {
  slideId: string
  slideIndex: number
  slideNumber: number
  slideName: string
  presentationTitle: string
}

type Note = SlideState & {
  id: string
  text: string
  createdAt: string
}

export default function App() {
  const [slide, setSlide] = useState<SlideState | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [text, setText] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [status, setStatus] = useState('Connecting to backend...')
  const wsRef = useRef<WebSocket | null>(null)

  const wsUrl = useMemo(
    () => window.location.origin.replace(/^http/, 'ws') + '/ws/realtime',
    [],
  )

  useEffect(() => {
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.type === 'state:init') {
        setSlide(message.activeSlide ?? null)
        setNotes(message.notes ?? [])
        setStatus('Connected')
      }

      if (message.type === 'slideChanged') {
        setSlide(message.slide)
      }

      if (message.type === 'noteAdded') {
        setNotes((current) => [...current, message.note])
      }
    }

    ws.onopen = () => setStatus('Connected')
    ws.onclose = () => setStatus('Disconnected')

    return () => {
      wsRef.current = null
      ws.close()
    }
  }, [wsUrl])

  const handleSubmit = () => {
    if (!text.trim() || !slide) {
      return
    }

    let sent = false
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'note:submit',
          text,
          slideId: slide.slideId,
          slideIndex: slide.slideIndex,
          slideNumber: slide.slideNumber,
          slideName: slide.slideName,
          presentationTitle: slide.presentationTitle,
        }),
      )
      sent = true
    }

    if (!sent) {
      setStatus('Disconnected')
      return
    }

    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
    setText('')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <p className="text-sm text-gray-500">{status}</p>
          <h1 className="text-2xl font-bold">
            {slide ? `Slide ${slide.slideNumber}` : 'Waiting for presentation...'}
          </h1>
          <p className="text-gray-600">
            {slide?.slideName ?? 'Connect the editor preview to start'}
          </p>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-40 p-2 border rounded-md"
          placeholder="Enter your note for this slide..."
        />

        <button
          onClick={handleSubmit}
          disabled={!slide}
          className="w-full mt-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          Submit
        </button>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Notes</h2>
          <ul className="space-y-2 max-h-48 overflow-auto text-sm text-gray-700">
            {notes.map((note) => (
              <li key={note.id} className="p-3 rounded-md bg-gray-50 border">
                <div className="font-medium">
                  Slide {note.slideNumber}: {note.slideName}
                </div>
                <div>{note.text}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-4 right-4 px-6 py-3 text-white bg-green-500 rounded-lg shadow-lg">
          Well submitted!
        </div>
      )}
    </div>
  )
}
