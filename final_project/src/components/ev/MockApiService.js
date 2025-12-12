const MOCK_API_BASE = 'https://6936218cfa8e704dafbfb8ac.mockapi.io';

export const MockApiService = {
  // Favorites CRUD
  async getFavorites() {
    try {
      const res = await fetch(`${MOCK_API_BASE}/favorites`);
      if (!res.ok) return [];
      return res.json();
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      return [];
    }
  },

  async createFavorite(data) {
    const res = await fetch(`${MOCK_API_BASE}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateFavorite(id, data) {
    const res = await fetch(`${MOCK_API_BASE}/favorites/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteFavorite(id) {
    await fetch(`${MOCK_API_BASE}/favorites/${id}`, { method: 'DELETE' });
  },

  // Reservations CRUD
  async getReservations() {
    try {
      const res = await fetch(`${MOCK_API_BASE}/reservations`);
      if (!res.ok) return [];
      return res.json();
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
      return [];
    }
  },

  async createReservation(data) {
    const res = await fetch(`${MOCK_API_BASE}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateReservation(id, data) {
    const res = await fetch(`${MOCK_API_BASE}/reservations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteReservation(id) {
    await fetch(`${MOCK_API_BASE}/reservations/${id}`, { method: 'DELETE' });
  }
};