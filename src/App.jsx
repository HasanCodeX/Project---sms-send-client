import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/events';

function App() {
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

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete event');
      fetchEvents();
    } catch (error) {
      alert(error.message);
    }
  };

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

  const handleEditChange = e => {
    setEditData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Events List</h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">No events found</p>
      ) : (
        <ul className="space-y-4 mb-8">
          {events.map(event =>
            editingId === event._id ? (
              <li key={event._id} className="border border-gray-300 rounded-lg p-4 shadow-sm">
                <form onSubmit={submitEdit} className="space-y-4">
                  <input
                    name="type"
                    value={editData.type}
                    onChange={handleEditChange}
                    className="input input-bordered w-full"
                    placeholder="Type"
                    required
                  />
                  <input
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    className="input input-bordered w-full"
                    placeholder="Name"
                    required
                  />
                  <input
                    name="phone"
                    value={editData.phone}
                    onChange={handleEditChange}
                    className="input input-bordered w-full"
                    placeholder="Phone"
                    required
                  />
                  <input
                    type="date"
                    name="date"
                    value={editData.date}
                    onChange={handleEditChange}
                    className="input input-bordered w-full"
                    required
                  />
                  <textarea
                    name="message"
                    value={editData.message}
                    onChange={handleEditChange}
                    className="textarea textarea-bordered w-full"
                    placeholder="Message"
                    rows={3}
                    required
                  />
                  <div className="flex gap-2 justify-end">
                    <button type="button" className="btn btn-outline" onClick={cancelEdit} disabled={loading}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </li>
            ) : (
              <li key={event._id} className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{event.eventType} - {event.clientName}</h2>
                    <p className="text-sm text-gray-600">
                      {event.phone} | {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditing(event)} className="btn btn-warning btn-sm">Edit</button>
                    <button onClick={() => handleDelete(event._id)} className="btn btn-error btn-sm">Delete</button>
                  </div>
                </div>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">{event.customMessage}</p>
              </li>
            )
          )}
        </ul>
      )}

      <h2 className="text-2xl font-semibold mb-4">Add Event</h2>
      <form onSubmit={handleAddEvent} className="space-y-4">
        <input name="type" value={formData.type} onChange={handleChange} placeholder="Type" className="input input-bordered w-full" required />
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="input input-bordered w-full" required />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="input input-bordered w-full" required />
        <input type="date" name="date" value={formData.date} onChange={handleChange} className="input input-bordered w-full" required />
        <textarea name="message" value={formData.message} onChange={handleChange} className="textarea textarea-bordered w-full" placeholder="Message" required />
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Adding...' : 'Add Event'}
        </button>
      </form>
    </div>
  );
}

export default App;
