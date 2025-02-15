import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { database, ref, get } from '../firebaseConfig'; 

function Paymants() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all payment records from the Realtime DB "payment" node
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const snapshot = await get(ref(database, 'payment'));
        if (!snapshot.exists()) {
          // If no payment records found
          setPayments([]);
        } else {
          // snapshot.val() is an object keyed by a push ID or unique ID
          const data = snapshot.val();

          // Convert that object into an array
          // e.g., { abc123: { price: 100, ... }, xyz456: { price: 200, ... } } => [...]
          const paymentsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          setPayments(paymentsArray);
        }
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError('Failed to load payments.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Define columns for DataTable
  const columns = [
    {
      name: 'Farm Name',
      selector: (row) => row.farmName || 'N/A',
      sortable: true,
    },
    {
      name: 'Booking Date',
      selector: (row) => row.bookingDate || 'N/A',
      sortable: true,
    },
    {
      name: 'Booking Time',
      selector: (row) => row.bookingTime || 'N/A',
      sortable: true,
    },
    {
      name: 'Total Price',
      selector: (row) => row.price || 'N/A',
      sortable: true,
    },
    {
      name: 'Card Number',
      selector: (row) => row.cardNumber || 'N/A',
      sortable: true,
    },
    {
      name: 'Card Holder',
      selector: (row) => row.cardHolder || 'N/A',
      sortable: true,
    },
    {
      name: 'Expiry Date',
      selector: (row) => row.expiryDate || 'N/A',
      sortable: true,
    },
    {
      name: 'CVV',
      selector: (row) => row.cvv || 'N/A',
      sortable: true,
    },
  ];

  if (loading) {
    return <div className="p-4">Loading payments...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">All Payment Transactions</h1>
      <div className="bg-white p-4 rounded shadow">
        <DataTable
          columns={columns}
          data={payments}
          pagination  // Enables built-in pagination
          highlightOnHover
          pointerOnHover
        />
      </div>
    </div>
  );
}

export default Paymants;