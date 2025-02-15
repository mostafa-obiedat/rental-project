import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="bg-gray-800 text-white  w-64 flex-shrink-0">
      <div className="p-4 font-bold text-xl border-b border-gray-600">
        Admin Panel
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link 
              to="/admin/dashboard"
              className="block px-3 py-2 rounded hover:bg-gray-700 transition"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/users-admin"
              className="block px-3 py-2 rounded hover:bg-gray-700 transition"
            >
              Users
            </Link>
          </li>
         
          <li>
            <Link 
              to="/admin/payments"
              className="block px-3 py-2 rounded hover:bg-gray-700 transition"
            >
              Payments
            </Link>
          </li>
          
          <li>
            <Link 
              to="/admin/posts-approvals"
              className="block px-3 py-2 rounded hover:bg-gray-700 transition"
            >
              Posts Approvals
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
