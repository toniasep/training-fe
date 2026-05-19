export const Sidebar = () => (
  <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
    <div className="h-16 flex items-center px-6 border-b border-gray-800 font-bold text-xl tracking-wide">
      Backoffice
    </div>
    <nav className="flex-1 px-4 py-6 space-y-2">
      <a href="#" className="block px-4 py-2 rounded bg-gray-800 text-white font-medium">Dashboard</a>
      <a href="#" className="block px-4 py-2 rounded text-gray-400 hover:bg-gray-800 hover:text-white transition-colors font-medium">Users</a>
      <a href="#" className="block px-4 py-2 rounded text-gray-400 hover:bg-gray-800 hover:text-white transition-colors font-medium">Requests</a>
      <a href="#" className="block px-4 py-2 rounded text-gray-400 hover:bg-gray-800 hover:text-white transition-colors font-medium">Audit Logs</a>
    </nav>
  </aside>
);
