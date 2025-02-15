import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';

// Chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Tailwind classes
// If you have a 'tailwind.css', it's already applied globally.

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  // Load properties, payments, and users
  useEffect(() => {
    let unsubProps, unsubPays, unsubUsers;

    // 1. Properties
    const propsRef = ref(database, 'properties');
    unsubProps = onValue(propsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const propsArray = Object.keys(data).map((id) => ({
          id,
          ...data[id],
        }));
        setProperties(propsArray);
      } else {
        setProperties([]);
      }
    });

    // 2. Payments
    const paysRef = ref(database, 'payment');
    unsubPays = onValue(paysRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const paysArray = Object.keys(data).map((id) => ({
          id,
          ...data[id],
        }));
        setPayments(paysArray);
      } else {
        setPayments([]);
      }
    });

    // 3. Users
    const usersRef = ref(database, 'users');
    unsubUsers = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const usersArray = Object.keys(data).map((id) => ({
          id,
          ...data[id],
        }));
        setUsers(usersArray);
      } else {
        setUsers([]);
      }
      setLoading(false);
    });

    // Cleanup listeners on unmount
    return () => {
      if (unsubProps) unsubProps();
      if (unsubPays) unsubPays();
      if (unsubUsers) unsubUsers();
    };
  }, []);

  if (loading) {
    return <div className="p-4">Loading Dashboard...</div>;
  }

  // --- Calculate Stats ---
  // 1. Properties stats (how many pending/approved/declined)
  const pendingCount = properties.filter((p) => p.status === 'pending').length;
  const approvedCount = properties.filter((p) => p.status === 'approved').length;
  const declinedCount = properties.filter((p) => p.status === 'declined').length;

  // 2. Total price for all bookings (payments)
  const totalPrice = payments.reduce((acc, cur) => {
    const price = parseFloat(cur.price) || 0; // make sure it's a number
    return acc + price;
  }, 0);

  // 3. Number of users
  const userCount = users.length;

  // --- Prepare chart data (bar chart for property statuses) ---
  const dataForChart = {
    labels: ['Pending', 'Approved', 'Declined'],
    datasets: [
      {
        label: 'Properties by Status',
        data: [pendingCount, approvedCount, declinedCount],
        backgroundColor: ['#fbbf24', '#4ade80', '#f87171'], // tailwind colors
      },
    ],
  };

  const optionsForChart = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Properties Status Distribution',
      },
    },
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Properties - pending/approved/declined summary */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Properties</h2>
          <p className="text-sm mb-1">Pending: {pendingCount}</p>
          <p className="text-sm mb-1">Approved: {approvedCount}</p>
          <p className="text-sm">Declined: {declinedCount}</p>
        </div>
        
        {/* Total Price from payments */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Total Booking Price</h2>
          <p className="text-2xl font-bold text-green-600">
            ${totalPrice.toFixed(2)}
          </p>
        </div>

        {/* Number of users */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Number of Users</h2>
          <p className="text-2xl font-bold text-blue-600">{userCount}</p>
        </div>

        {/* Another example card or summary metric */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Total Properties</h2>
          <p className="text-2xl font-bold">{properties.length}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-4 rounded shadow">
        <Bar data={dataForChart} options={optionsForChart} />
      </div>
    </div>
  );
}

export default Dashboard;