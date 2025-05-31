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

  // Fetch events
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
        body: JSON.stringify(formData),
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

  // Edit Handlers
  const startEditing = event => {
    setEditingId(event._id);
    setEditData({
      type: event.type,
      name: event.name,
      phone: event.phone,
      date: event.date.slice(0, 10), // format date for input type="date"
      message: event.message,
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
        body: JSON.stringify(editData),
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
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={cancelEdit}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </li>
            ) : (
              <li
                key={event._id}
                className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {event.type} - {event.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {event.phone} | {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(event)}
                      className="btn btn-warning btn-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="btn btn-error btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">{event.message}</p>
              </li>
            )
          )}
        </ul>
      )}

      <h2 className="text-2xl font-semibold mb-4">Add Event</h2>
      <form onSubmit={handleAddEvent} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Type (e.g. Birthday, Eid)</span>
          </label>
          <input
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
            placeholder="Type"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
            placeholder="Name"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Phone</span>
          </label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
            placeholder="Phone Number"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Date</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Message</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="textarea textarea-bordered w-full"
            placeholder="Message for SMS"
            rows={3}
          />
        </div>

        <button type="submit" className={`btn btn-primary w-full`} disabled={loading}>
          {loading ? 'Adding...' : 'Add Event'}
        </button>
      </form>
    </div>
  );
}

export default App;
