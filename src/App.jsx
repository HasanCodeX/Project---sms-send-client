import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:5000/events';

export default function EventReminderApp() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    phone: '',
    date: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    type: '',
    name: '',
    phone: '',
    date: '',
    message: '',
  });

  // Fetch all events from backend
  const fetchEvents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle input changes for add form
  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Add new event with SweetAlert2 success/error
  const handleAddEvent = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: formData.type,
          clientName: formData.name,
          phone: formData.phone,
          eventDate: formData.date,
          customMessage: formData.message,
        }),
      });
      if (!res.ok) throw new Error('Failed to add event');
      setFormData({ type: '', name: '', phone: '', date: '', message: '' });
      fetchEvents();
      await Swal.fire({
        icon: 'success',
        title: 'Event Added',
        text: 'Your event was added successfully.',
        confirmButtonColor: '#000',
        background: '#1a1a1a',
        color: '#fff',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message || 'Something went wrong!',
        confirmButtonColor: '#000',
        background: '#1a1a1a',
        color: '#fff',
      });
    }
    setLoading(false);
  };

  // Delete event with confirmation and alerts
  const handleDelete = async id => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This event will be deleted permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#555',
      background: '#1a1a1a',
      color: '#fff',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete event');
        fetchEvents();
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Event has been deleted.',
          confirmButtonColor: '#000',
          background: '#1a1a1a',
          color: '#fff',
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: err.message || 'Failed to delete event.',
          confirmButtonColor: '#000',
          background: '#1a1a1a',
          color: '#fff',
        });
      }
    }
  };

  // Start editing mode and fill edit form
  const startEditing = event => {
    setEditingId(event._id);
    setEditData({
      type: event.eventType,
      name: event.clientName,
      phone: event.phone,
      date: event.eventDate.slice(0, 10),
      message: event.customMessage,
    });
  };

  // Handle input changes for edit form
  const handleEditChange = e => {
    setEditData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit edited event with SweetAlert2 alerts
  const submitEdit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: editData.type,
          clientName: editData.name,
          phone: editData.phone,
          eventDate: editData.date,
          customMessage: editData.message,
        }),
      });
      if (!res.ok) throw new Error('Failed to update event');
      setEditingId(null);
      fetchEvents();
      await Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Your event has been updated.',
        confirmButtonColor: '#000',
        background: '#1a1a1a',
        color: '#fff',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.message || 'Failed to update event.',
        confirmButtonColor: '#000',
        background: '#1a1a1a',
        color: '#fff',
      });
    }
    setLoading(false);
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div
      className="min-h-screen bg-black text-white flex flex-col items-center p-6"
      style={{ fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen" }}
    >
      <h1 className="text-5xl font-extrabold mb-8 tracking-tight">Event Reminder & SMS Sender</h1>

      {events.length === 0 ? (
        <p className="text-gray-400 text-center mb-12">No events found. Add some below!</p>
      ) : (
        <ul className="w-full max-w-3xl space-y-6 mb-12">
          {events.map(event =>
            editingId === event._id ? (
              <li
                key={event._id}
                className="bg-gray-900 rounded-2xl p-6 shadow-md"
              >
                <form onSubmit={submitEdit} className="space-y-5">
                  <input
                    name="type"
                    value={editData.type}
                    onChange={handleEditChange}
                    placeholder="Event Type (Birthday, Anniversary...)"
                    className="bg-gray-800 rounded-lg p-3 w-full placeholder-gray-400 text-white border border-gray-700 focus:border-white focus:outline-none"
                    required
                    autoFocus
                  />
                  <input
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    placeholder="Name"
                    className="bg-gray-800 rounded-lg p-3 w-full placeholder-gray-400 text-white border border-gray-700 focus:border-white focus:outline-none"
                    required
                  />
                  <input
                    name="phone"
                    value={editData.phone}
                    onChange={handleEditChange}
                    placeholder="Phone"
                    className="bg-gray-800 rounded-lg p-3 w-full placeholder-gray-400 text-white border border-gray-700 focus:border-white focus:outline-none"
                    required
                  />
                  <input
                    type="date"
                    name="date"
                    value={editData.date}
                    onChange={handleEditChange}
                    className="bg-gray-800 rounded-lg p-3 w-full text-white border border-gray-700 focus:border-white focus:outline-none"
                    required
                  />
                  <textarea
                    name="message"
                    value={editData.message}
                    onChange={handleEditChange}
                    rows={3}
                    placeholder="Custom Message"
                    className="bg-gray-800 rounded-lg p-3 w-full placeholder-gray-400 text-white border border-gray-700 focus:border-white focus:outline-none resize-none"
                    required
                  />

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-6 py-2 bg-gray-700 rounded-xl hover:bg-gray-600 transition"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </li>
            ) : (
              <li
                key={event._id}
                className="bg-gray-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h2 className="text-2xl font-bold">{event.eventType}</h2>
                    <p className="text-xl font-semibold">{event.clientName}</p>
                    <p className="text-sm text-gray-400">
                      {event.phone} | {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => startEditing(event)}
                      className="px-4 py-2 bg-gray-700 rounded-xl hover:bg-gray-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="px-4 py-2 bg-red-700 rounded-xl hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 whitespace-pre-line">{event.customMessage}</p>
              </li>
            )
          )}
        </ul>
      )}

      {/* Add New Event Form */}
      <form
        onSubmit={handleAddEvent}
        className="w-full max-w-3xl space-y-5 bg-gray-900 rounded-2xl p-6 shadow-md"
      >
        <h2 className="text-3xl font-bold mb-4">Add New Event</h2>
        <input
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="Event Type (Birthday, Anniversary...)"
          className="bg-gray-800 rounded-lg p-3 w-full placeholder-gray-400 text-white border border-gray-700 focus:border-white focus:outline-none"
          required
        />
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="bg-gray-800 rounded-lg p-3 w-full placeholder-gray-400 text-white border border-gray-700 focus:border-white focus:outline-none"
          required
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="bg-gray-800 rounded-lg p-3 w-full placeholder-gray-400 text-white border border-gray-700 focus:border-white focus:outline-none"
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="bg-gray-800 rounded-lg p-3 w-full text-white border border-gray-700 focus:border-white focus:outline-none"
          required
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={3}
          placeholder="Custom Message"
          className="bg-gray-800 rounded-lg p-3 w-full placeholder-gray-400 text-white border border-gray-700 focus:border-white focus:outline-none resize-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition"
        >
          {loading ? 'Adding...' : 'Add Event'}
        </button>
      </form>
    </div>
  );
}
