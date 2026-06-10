'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  RefreshCw, 
  Search,
  AlertTriangle,
  Users,
  Armchair,
  X
} from 'lucide-react';

interface Booking {
  id: string;
  reference: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  seats: string;
  seat_count: number;
  created_at: string;
}

interface ReservedSeat {
  id: string;
  seat_id: string;
  booking_reference: string;
  created_at: string;
}

export default function SeatReservationsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reservedSeats, setReservedSeats] = useState<ReservedSeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSeatId, setNewSeatId] = useState('');
  const [newReason, setNewReason] = useState('');
  const [adding, setAdding] = useState(false);
  const [clearing, setClearing] = useState(false);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check', { credentials: 'include' });
        if (res.status === 401) {
          router.push('/admin/login');
        }
      } catch (err) {
        // If check fails, assume not authenticated
        router.push('/admin/login');
      }
    };
    checkAuth();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch bookings
      const bookingsRes = await fetch('/api/admin/bookings');
      if (bookingsRes.status === 401) {
        router.push('/admin/login');
        return;
      }
      const bookingsData = await bookingsRes.json();
      setBookings(bookingsData.bookings || []);

      // Fetch reserved seats
      const seatsRes = await fetch('/api/book-seats');
      const seatsData = await seatsRes.json();
      
      // Combine with bookings to get references
      const seatsWithRefs = (seatsData.reservedSeats || []).map((seatId: string) => {
        const booking = bookingsData.bookings?.find((b: Booking) => 
          b.seats.includes(seatId)
        );
        return {
          id: seatId,
          seat_id: seatId,
          booking_reference: booking?.reference || 'MANUAL',
          created_at: booking?.created_at || new Date().toISOString(),
        };
      });
      
      setReservedSeats(seatsWithRefs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSeat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeatId.trim()) return;

    setAdding(true);
    try {
      const res = await fetch('/api/admin/reserved-seats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seatId: newSeatId.trim().toUpperCase(),
          reason: newReason.trim() || 'Manual reservation',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add seat');
      }

      setNewSeatId('');
      setNewReason('');
      setShowAddModal(false);
      fetchData();
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleReleaseSeat = async (seatId: string) => {
    if (!confirm(`Release seat ${seatId}?`)) return;

    try {
      const res = await fetch(`/api/admin/reserved-seats?seatId=${encodeURIComponent(seatId)}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to release seat');
      }

      fetchData();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('WARNING: This will release ALL reserved seats. Are you sure?')) return;
    if (!confirm('Really? This cannot be undone.')) return;

    setClearing(true);
    try {
      const res = await fetch('/api/admin/reserved-seats', {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to clear seats');
      }

      fetchData();
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setClearing(false);
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.seats.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin" 
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Admin
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Armchair className="w-8 h-8 text-orange-500" />
                Seat Reservations
              </h1>
              <p className="text-slate-400 mt-1">Manage event seat bookings and reservations</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 flex items-center gap-2"
              >
                <Plus size={18} />
                Add Reserved Seat
              </button>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 flex items-center gap-2"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Total Bookings</p>
            <p className="text-2xl font-bold text-blue-400">{bookings.length}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Reserved Seats</p>
            <p className="text-2xl font-bold text-orange-400">{reservedSeats.length}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Available Seats</p>
            <p className="text-2xl font-bold text-green-400">{Math.max(0, 70 - reservedSeats.length)}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Total Capacity</p>
            <p className="text-2xl font-bold text-slate-300">70</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookings by name, email, reference..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 rounded-lg border border-slate-700 focus:border-orange-500 outline-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="text-red-400" size={20} />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12 text-slate-400">
            <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
            <p>Loading reservations...</p>
          </div>
        )}

        {/* Bookings Table */}
        {!loading && (
          <div className="bg-slate-800 rounded-xl overflow-hidden mb-8">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users size={20} />
                Bookings
              </h2>
              <span className="text-sm text-slate-400">{filteredBookings.length} found</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Reference</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Phone</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Seats</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                        No bookings found
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-700/30">
                        <td className="px-4 py-3">
                          <span className="font-mono text-orange-400 font-medium">
                            {booking.reference}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {booking.first_name} {booking.last_name}
                        </td>
                        <td className="px-4 py-3 text-slate-400">{booking.email}</td>
                        <td className="px-4 py-3 text-slate-400">{booking.phone || '-'}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex flex-wrap gap-1">
                            {booking.seats.split(', ').map((seat) => (
                              <span 
                                key={seat} 
                                className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs"
                              >
                                {seat}
                              </span>
                            ))}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-sm">
                          {new Date(booking.created_at).toLocaleDateString('en-ZA')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reserved Seats Grid */}
        {!loading && (
          <div className="bg-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Armchair size={20} />
                Reserved Seats
              </h2>
              <div className="flex gap-3">
                {reservedSeats.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    disabled={clearing}
                    className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm flex items-center gap-2 transition-colors"
                  >
                    <Trash2 size={14} />
                    {clearing ? 'Clearing...' : 'Clear All'}
                  </button>
                )}
                <span className="text-sm text-slate-400">{reservedSeats.length} reserved</span>
              </div>
            </div>
            <div className="p-4">
              {reservedSeats.length === 0 ? (
                <p className="text-center text-slate-500 py-8">No reserved seats</p>
              ) : (
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                  {reservedSeats.map((seat) => (
                    <div
                      key={seat.seat_id}
                      className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-2 text-center relative group"
                    >
                      <span className="text-orange-400 font-medium text-sm">{seat.seat_id}</span>
                      <button
                        onClick={() => handleReleaseSeat(seat.seat_id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Release seat"
                      >
                        <X size={14} />
                      </button>
                      <p className="text-[10px] text-slate-500 mt-1 truncate">
                        {seat.booking_reference}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Reserved Seat Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add Reserved Seat</h2>
              <form onSubmit={handleAddSeat}>
                <div className="mb-4">
                  <label className="block text-sm text-slate-400 mb-1">Seat ID</label>
                  <input
                    type="text"
                    value={newSeatId}
                    onChange={(e) => setNewSeatId(e.target.value.toUpperCase())}
                    placeholder="e.g., B-3"
                    className="w-full px-3 py-2 bg-slate-700 rounded-lg uppercase"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">Format: Row-Number (e.g., A-1, B-5)</p>
                </div>
                <div className="mb-6">
                  <label className="block text-sm text-slate-400 mb-1">Reason (optional)</label>
                  <input
                    type="text"
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    placeholder="e.g., VIP guest, Staff seat"
                    className="w-full px-3 py-2 bg-slate-700 rounded-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={adding}
                    className="flex-1 px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50"
                  >
                    {adding ? 'Adding...' : 'Add Seat'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
