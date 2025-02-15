import React, { useState, useEffect } from 'react';
import { database, ref, onValue, update } from '../firebaseConfig'; 
// ^ Adjust path if needed. We'll import only what we need from firebaseConfig.
import { CheckCircle, XCircle } from 'lucide-react'; // optional icons

function Postsaproval() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all properties from Realtime DB
  useEffect(() => {
    const propertiesRef = ref(database, 'properties');
    const unsubscribe = onValue(
      propertiesRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setProperties([]);
        } else {
          // snapshot.val() is an object keyed by property ID
          const data = snapshot.val();
          // Convert object into an array
          const propertiesArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setProperties(propertiesArray);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties.');
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Approve a property (sets status to "approved")
  const handleApprove = async (propertyId) => {
    try {
      await update(ref(database, `properties/${propertyId}`), {
        status: 'approved',
      });
    } catch (err) {
      console.error('Error approving property:', err);
      alert('Failed to approve property. Please try again.');
    }
  };

  // Decline a property (sets status to "declined")
  const handleDecline = async (propertyId) => {
    try {
      await update(ref(database, `properties/${propertyId}`), {
        status: 'declined',
      });
    } catch (err) {
      console.error('Error declining property:', err);
      alert('Failed to decline property. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">Loading properties...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">{error}</div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center">Properties Approval</h1>
      {properties.length === 0 ? (
        <p className="text-center">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <div 
              key={property.id} 
              className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
            >
              {/* Property Name */}
              <h2 className="text-xl font-semibold mb-2">
                {property.name || 'Unnamed Property'}
              </h2>

              {/* Short description */}
              <p className="text-gray-600 mb-4 line-clamp-3">
                {property.short_description || 'No description available.'}
              </p>

              {/* Price / Rooms, etc. */}
              <p className="text-gray-800 font-semibold mb-2">
                Price: {property.price ? `$${property.price}` : 'N/A'}
              </p>
              <p className="text-gray-800 font-semibold mb-4">
                Rooms: {property.rooms ?? 'N/A'}
              </p>

              {/* Current status */}
              <p className="mb-4">
                Status:{' '}
                <span
                  className={`px-2 py-1 rounded ${
                    property.status === 'pending'
                      ? 'bg-yellow-200 text-yellow-800'
                      : property.status === 'approved'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {property.status || 'N/A'}
                </span>
              </p>

              {/* Approve / Decline buttons (only if pending) */}
              {property.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(property.id)}
                    className="flex items-center bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecline(property.id)}
                    className="flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Postsaproval;