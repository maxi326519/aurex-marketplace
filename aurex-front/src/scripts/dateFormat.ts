export default function dateFormat(fecha: Date) {
  const year: number = fecha.getFullYear();
  const month: number = fecha.getMonth() + 1;
  const day: number = fecha.getDate();

  // Construir la cadena de fecha en el nuevo formato
  const fechaFormateada = `${`0${month}`.slice(-2)}/${`0${day}`.slice(
    -2
  )}/${year}`;

  return fechaFormateada;
}
