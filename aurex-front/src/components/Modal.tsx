interface Props {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ title, children, onClose }: Props) {
  return (
    <div className="fixed z-[9999] top-0 left-0 flex justify-center items-center w-full h-full bg-[#0006] p-4">
      <div className="flex flex-col rounded-lg bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <header className="flex flex-col gap-4 p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">{title}</h4>
            <button
              type="button"
              className="btn-close py-2 px-4 hover:bg-gray-100 rounded-full"
              onClick={onClose}
            >
              x
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
