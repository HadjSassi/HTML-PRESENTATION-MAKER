import { Plus } from "lucide-react";
import { usePresentationStore } from "../../store/usePresentationStore";
import { SlideThumbnail } from "./SlideThumbnail";

export function SlidePanel() {
  const {
    presentation,
    currentSlideIndex,
    selectSlide,
    addSlide,
    duplicateSlide,
    deleteSlide,
    moveSlide,
  } = usePresentationStore();

  const { slides } = presentation;

  return (
    <aside className="w-48 shrink-0 bg-panel border-r border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
          Slides <span className="text-textMuted">({slides.length})</span>
        </span>
        <button
          onClick={addSlide}
          className="p-1 rounded hover:bg-hover text-textSecondary hover:text-accent
            transition-colors"
          title="Add Slide"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Slide list */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2 custom-scrollbar">
        {slides.map((slide, idx) => (
          <SlideThumbnail
            key={slide.id}
            index={idx}
            title={slide.title}
            thumbnail={slide.thumbnail}
            backgroundColor={slide.backgroundColor}
            isActive={idx === currentSlideIndex}
            isFirst={idx === 0}
            isLast={idx === slides.length - 1}
            onClick={() => selectSlide(idx)}
            onDuplicate={() => duplicateSlide(idx)}
            onDelete={() => deleteSlide(slide.id)}
            onMoveUp={() => moveSlide(idx, idx - 1)}
            onMoveDown={() => moveSlide(idx, idx + 1)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-border">
        <button
          onClick={addSlide}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded
            border border-dashed border-border hover:border-accent text-textMuted
            hover:text-accent transition-colors text-xs"
        >
          <Plus size={12} /> New Slide
        </button>
      </div>
    </aside>
  );
}
