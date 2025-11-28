import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normaliza una ruta de archivo para construir URLs correctas.
 * Convierte rutas absolutas a relativas desde "uploads" y normaliza las barras.
 * 
 * @param filePath - Ruta del archivo (puede ser absoluta o relativa)
 * @returns Ruta normalizada relativa desde "uploads"
 * 
 * @example
 * normalizeFilePath("D:/Mis Archivos/.../uploads/movement-orders/file.xlsx")
 * // Returns: "movement-orders/file.xlsx"
 * 
 * @example
 * normalizeFilePath("movement-orders/file.xlsx")
 * // Returns: "movement-orders/file.xlsx"
 */
export function normalizeFilePath(filePath: string): string {
  if (!filePath) return "";
  
  // Si la ruta contiene "uploads", extraer solo la parte después de "uploads"
  const uploadsIndex = filePath.indexOf("uploads");
  if (uploadsIndex !== -1) {
    const relativePath = filePath.substring(uploadsIndex + "uploads".length);
    // Eliminar barras iniciales y normalizar
    return relativePath.replace(/^[/\\]+/, "").replace(/\\/g, "/");
  }
  
  // Si ya es una ruta relativa, solo normalizar las barras
  return filePath.replace(/\\/g, "/").replace(/^[/]+/, "");
}
