import { useState } from "react";

interface Props {
  setFile: (file: File) => void;
  allowedTypes?: string[]; // Prop para tipos permitidos
}

const extensionToMime: Record<string, string> = {
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pdf: "application/pdf",
  jpg: "image/jpeg",
  png: "image/png",
};

export default function DragAndDrop({ setFile, allowedTypes }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");

  // Tipos permitidos por defecto
  const defaultAllowedExtensions = Object.keys(extensionToMime);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    setError("");

    // Convertir las extensiones permitidas a MIME types
    const allowedMimes = (allowedTypes || defaultAllowedExtensions).map(
      (ext) => extensionToMime[ext] || ""
    );

    if (!allowedMimes.includes(file.type)) {
      setError("El archivo no tiene un formato permitido.");
      return;
    }

    setFile(file);
  };

  const getAllowedExtensions = () => {
    return allowedTypes?.join(", ") || defaultAllowedExtensions.join(", ");
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
              ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-2">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <div className="flex flex-col gap-1">
            <p className="font-medium">
              {isDragging
                ? "Suelta el archivo aquí"
                : "Arrastra tu archivo aquí"}
            </p>
            <p className="text-gray-500 text-sm">o</p>
            <label className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
              Selecciona un archivo
              <input
                type="file"
                className="hidden"
                onChange={handleFileInput}
                accept={allowedTypes
                  ?.map((ext) => extensionToMime[ext])
                  .join(",") || defaultAllowedExtensions
                  .map((ext) => extensionToMime[ext])
                  .join(",")}
              />
            </label>
          </div>

          <p className="text-gray-500 text-sm mt-2">
            Formatos soportados: {getAllowedExtensions()}
          </p>
        </div>
      </div>

      <span className="text-red-500">{error}</span>
    </div>
  );
}
