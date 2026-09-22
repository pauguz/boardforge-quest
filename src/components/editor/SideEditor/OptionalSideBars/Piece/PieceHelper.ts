/**
 * Valida que una URL sea accesible y contenga una imagen válida
 * @param url - La URL a validar
 * @param setError - Función para establecer mensajes de error
 * @returns boolean - true si la URL es válida
 */
export const validateImageUrl = async (
  url: string,
  setError: (error: string) => void
): Promise<boolean> => {
  try {
    // Validar que sea una URL válida
    new URL(url);
  } catch {
    setError("URL inválida");
    return false;
  }

  // Usar Image.onload directamente (más compatible, evita problemas de CORS)
  return new Promise<boolean>((resolve) => {
    const img = new Image();
    let handled = false;

    // Timeout de 5 segundos
    const timeoutId = setTimeout(() => {
      if (!handled) {
        handled = true;
        setError("Timeout: La imagen tardó demasiado en cargar");
        resolve(false);
      }
    }, 5000);

    img.onload = () => {
      if (!handled) {
        handled = true;
        clearTimeout(timeoutId);
        setError(""); // Limpiar errores previos
        resolve(true);
      }
    };

    img.onerror = () => {
      if (!handled) {
        handled = true;
        clearTimeout(timeoutId);
        setError("No se pudo cargar la imagen. Verifica que sea pública y accesible.");
        resolve(false);
      }
    };

    // Intentar con crossOrigin, pero también funciona sin él
    img.crossOrigin = "anonymous";
    img.src = url;
  });
};