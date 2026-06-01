import { useRef } from 'react'
import { CanvasContext } from './contexts/CanvasContext'
import { Header } from './components/Header/Header'
import { Toolbar } from './components/Toolbar/Toolbar'
import { SlidePanel } from './components/SlidePanel/SlidePanel'
import { CanvasEditor } from './components/Canvas/CanvasEditor'
import { PropertiesPanel } from './components/Properties/PropertiesPanel'
import { PreviewModal } from './components/Preview/PreviewModal'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import type { fabric } from 'fabric'

function EditorLayout() {
  useKeyboardShortcuts()
  return (
    <div className="flex flex-1 overflow-hidden">
      <SlidePanel />
      <CanvasEditor />
      <PropertiesPanel />
    </div>
  )
}

export default function App() {
  const canvasRef = useRef<fabric.Canvas | null>(null)

  return (
    <CanvasContext.Provider value={{ canvasRef }}>
      <div className="flex flex-col h-screen bg-base overflow-hidden">
        <Header />
        <Toolbar />
        <EditorLayout />
        <PreviewModal />
      </div>
    </CanvasContext.Provider>
  )
}



