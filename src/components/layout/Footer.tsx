export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-sm text-gray-600 sm:flex-row sm:text-left sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} TecLab. Todos los derechos reservados.</p>
        <p>Instituto Tecnológico Superior de San Luis Potosí, Capital · TecNM</p>
      </div>
    </footer>
  );
}