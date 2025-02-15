import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Import your Firebase references
import { database, ref, get, remove } from '../firebaseConfig'; 
// ^^^ Adjust path as needed to match your project's structure

function Usersadmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users from your DB
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await get(ref(database, 'users'));
        if (!snapshot.exists()) {
          setUsers([]); // no users
        } else {
          const data = snapshot.val(); // object keyed by uid
          // Convert to array
          const userArray = Object.keys(data).map((uid) => ({
            uid,
            ...data[uid],
          }));
          setUsers(userArray);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle delete user
  const handleDelete = (uid) => {
    // Show SweetAlert confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the user record from the database.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',  // red
      cancelButtonColor: '#3085d6', // blue
      confirmButtonText: 'Yes, delete!',
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, remove the user from Firebase
        remove(ref(database, `users/${uid}`))
          .then(() => {
            // Update local state so the UI reflects the removal
            setUsers((prevUsers) => prevUsers.filter((user) => user.uid !== uid));
            Swal.fire('Deleted!', 'User has been removed.', 'success');
          })
          .catch((error) => {
            console.error('Error deleting user:', error);
            Swal.fire('Error', 'Failed to delete the user.', 'error');
          });
      }
    });
  };

  // Define DataTable columns
  const columns = [
    {
      name: 'First Name',
      selector: (row) => row.firstname || 'N/A',
      sortable: true,
    },
    {
      name: 'Last Name',
      selector: (row) => row.lastname || 'N/A',
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email || 'N/A',
      sortable: true,
    },
    {
      name: 'Phone Number',
      selector: (row) => row.phoneNumber || 'N/A',
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <button
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-all"
          onClick={() => handleDelete(row.uid)}
        >
          Delete
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  if (loading) {
    return <div className="p-4">Loading users...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">All Registered Users</h1>
      <div className="bg-white p-4 rounded shadow">
        <DataTable
          columns={columns}
          data={users}
          pagination
          highlightOnHover
          pointerOnHover
        />
      </div>
    </div>
  );
}

export default Usersadmin;
