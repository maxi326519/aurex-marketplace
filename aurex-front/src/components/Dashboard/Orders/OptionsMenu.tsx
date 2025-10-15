import { useRef, useEffect } from "react";
import { OrdersStatus } from "../../../interfaces/Orders";

import IconMessage from "../../Icons/IconMessage";
import IconReport from "../../Icons/IconReport";
import IconStar from "../../Icons/IconStar";

interface OptionsMenuProps {
  onChat: () => void;
  onReport: () => void;
  onReview?: () => void;
  orderStatus: OrdersStatus;
  isOpen: boolean;
  onClose: () => void;
}

export default function OptionsMenu({
  onChat,
  onReport,
  onReview,
  orderStatus,
  isOpen,
  onClose,
}: OptionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-5 top-full mt-2 w-48 bg-white rounded-lg rounded-se-none shadow-lg border border-gray-200 z-[100]"
    >
      <div className="py-2">
        <button
          type="button"
          onClick={() => {
            onChat();
            onClose();
          }}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <IconMessage size={16} />
          <span>Chatear</span>
        </button>
        {/* Solo mostrar reseña y reporte para estados PENDING y COMPLETED */}
        {(orderStatus === OrdersStatus.PENDING || orderStatus === OrdersStatus.COMPLETED) && (
          <>
            {onReview && (
              <button
                type="button"
                onClick={() => {
                  onReview();
                  onClose();
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <IconStar size={16} />
                <span>Agregar reseña</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onReport();
                onClose();
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <IconReport size={16} />
              <span>Reportar</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
