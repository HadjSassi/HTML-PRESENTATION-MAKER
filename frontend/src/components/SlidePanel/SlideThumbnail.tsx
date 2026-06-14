interface ThumbnailProps {
  title: string;
  index: number;
  thumbnail?: string;
  backgroundColor: string;
  isActive: boolean;
  onClick: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function SlideThumbnail({
  title,
  index,
  thumbnail,
  backgroundColor,
  isActive,
  onClick,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: ThumbnailProps) {
  return (
    <div
      className={`group relative rounded-lg overflow-hidden cursor-pointer
        border-2 transition-all duration-150
        ${isActive ? "border-accent shadow-lg shadow-accent/20" : "border-border hover:border-borderActive"}`}
      onClick={onClick}
    >
      {/* Thumbnail preview */}
      <div className="relative" style={{ paddingBottom: "56.25%" }}>
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor }}
          >
            <span className="text-xs text-gray-400 opacity-50">Empty</span>
          </div>
        )}
      </div>

      {/* Slide number + title */}
      <div
        className={`flex items-center gap-1.5 px-2 py-1.5 text-xs
        ${isActive ? "bg-accent/20" : "bg-card"}`}
      >
        <span className="text-textMuted font-mono w-4 text-center shrink-0">
          {index + 1}
        </span>
        <span className="text-textSecondary truncate flex-1">{title}</span>
      </div>

      {/* Context actions — visible on hover */}
      <div className="absolute top-1 right-1 hidden group-hover:flex flex-col gap-0.5">
        {!isFirst && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            className="p-0.5 bg-panel/90 rounded text-textSecondary hover:text-textPrimary text-[10px]"
          >
            ↑
          </button>
        )}
        {!isLast && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            className="p-0.5 bg-panel/90 rounded text-textSecondary hover:text-textPrimary text-[10px]"
          >
            ↓
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="p-0.5 bg-panel/90 rounded text-textSecondary hover:text-accent text-[10px]"
          title="Duplicate"
        >
          ⧉
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-0.5 bg-panel/90 rounded text-textSecondary hover:text-danger text-[10px]"
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
