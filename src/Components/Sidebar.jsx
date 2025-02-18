const Sidebar = () => {
  return (
    <div className="min-h-screen w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-gray-100 shadow-xl">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold tracking-wider">Admin Panel</h1>
      </div>
      
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {/* Dashboard Item */}
          <a 
            href="/admin/dashboard"
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-slate-700 rounded-lg transition-colors duration-200 group"
          >
            <span className="text-lg group-hover:text-white">Dashboard</span>
          </a>

          {/* Users Item */}
          <a 
            href="/admin/users-admin"
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-slate-700 rounded-lg transition-colors duration-200 group"
          >
            <span className="text-lg group-hover:text-white">Users</span>
          </a>

          {/* Payments Item */}
          <a 
            href="/admin/payments"
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-slate-700 rounded-lg transition-colors duration-200 group"
          >
            <span className="text-lg group-hover:text-white">Payments</span>
          </a>

          {/* Posts Approvals Item */}
          <a 
            href="/admin/posts-approvals"
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-slate-700 rounded-lg transition-colors duration-200 group"
          >
            <span className="text-lg group-hover:text-white">Posts Approvals</span>
          </a>
        </div>

        {/* Logout Button */}
        <div className="px-4 mt-8">
          <button 
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
            className="w-full px-4 py-3 text-left text-gray-300 hover:bg-red-500 hover:text-white rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;