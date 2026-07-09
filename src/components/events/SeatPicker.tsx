'use client';

import { useState, useEffect } from 'react';

interface SeatLayout {
  row: string;
  left: number;
  right: number;
}

const LAYOUT: SeatLayout[] = [
  { row: 'A', left: 4, right: 4 },  // 8  - front row
  { row: 'B', left: 5, right: 5 },  // 10
  { row: 'C', left: 5, right: 5 },  // 10
  { row: 'D', left: 5, right: 5 },  // 10
  { row: 'E', left: 5, right: 5 },  // 10
  { row: 'F', left: 6, right: 6 },  // 12
  { row: 'G', left: 5, right: 5 },  // 10
];

export function SeatPicker() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reserved, setReserved] = useState<Set<string>>(new Set());
  const [total, setTotal] = useState(70);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [bookingRef, setBookingRef] = useState('');

  useEffect(() => {
    loadReservedSeats();
  }, []);

  async function loadReservedSeats() {
    try {
      const res = await fetch('/api/book-seats');
      if (!res.ok) throw new Error('Failed to load reserved seats');
      const data = await res.json();
      if (data.reservedSeats && Array.isArray(data.reservedSeats)) {
        setReserved(new Set(data.reservedSeats));
        setTotal(70 - data.reservedSeats.length);
      }
    } catch (err) {
      console.error('Error loading reserved seats:', err);
    }
  }

  const toggleSeat = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const handleBook = () => {
    setShowModal(true);
    setShowConfirm(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowConfirm(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const submitBooking = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      showToast('⚠️ Please fill in your name and email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showToast('⚠️ Please enter a valid email address');
      return;
    }

    const ids = Array.from(selected).sort();

    try {
      const res = await fetch('/api/book-seats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          seats: ids,
          seatCount: selected.size,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Booking failed');
      }

      // Lock the seats locally
      const newReserved = new Set(reserved);
      selected.forEach((id) => newReserved.add(id));
      setReserved(newReserved);
      setSelected(new Set());
      setTotal(70 - newReserved.size);

      // Show confirmation
      setBookingRef(data.booking.reference);
      setShowConfirm(true);
    } catch (err: any) {
      showToast('❌ ' + err.message);
    }
  };

  const renderSeats = () => {
    let seatNum = 1;
    return LAYOUT.map(({ row, left, right }) => (
      <div key={row} className="flex items-center gap-0.5 sm:gap-1 mb-1.5 sm:mb-2 justify-center">
        <div className="text-[10px] sm:text-xs font-semibold text-gray-500 w-3 sm:w-4 text-center">{row}</div>
        
        {/* Left seats */}
        {Array.from({ length: left }).map((_, i) => {
          const id = `${row}-${seatNum++}`;
          const isReserved = reserved.has(id);
          const isSelected = selected.has(id);
          return (
            <button
              key={id}
              onClick={() => !isReserved && toggleSeat(id)}
              disabled={isReserved}
              className={`
                relative w-7 h-6 sm:w-9 sm:h-8 rounded-t-md rounded-b-sm border-2 transition-all
                ${isReserved ? 'bg-gray-900 border-gray-800 opacity-40 cursor-not-allowed' : ''}
                ${isSelected ? 'bg-[#FF9F00] border-[#e88a00]' : 'bg-gray-800 border-gray-700'}
                ${!isReserved && !isSelected ? 'hover:bg-gray-700 hover:border-[#FF9F00] hover:scale-110' : ''}
              `}
            >
              <span className={`absolute bottom-0 sm:bottom-0.5 left-0 right-0 text-center text-[8px] sm:text-[9px] font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>
                {id.split('-')[1]}
              </span>
              <div className={`absolute -top-0.5 sm:-top-1 left-1/2 -translate-x-1/2 w-4 sm:w-6 h-0.5 sm:h-1 rounded-t ${isSelected ? 'bg-[#e88a00]' : isReserved ? 'bg-gray-800' : 'bg-gray-700'}`} />
            </button>
          );
        })}

        {/* Aisle */}
        <div className="w-4 sm:w-6" />

        {/* Right seats */}
        {Array.from({ length: right }).map((_, i) => {
          const id = `${row}-${seatNum++}`;
          const isReserved = reserved.has(id);
          const isSelected = selected.has(id);
          return (
            <button
              key={id}
              onClick={() => !isReserved && toggleSeat(id)}
              disabled={isReserved}
              className={`
                relative w-7 h-6 sm:w-9 sm:h-8 rounded-t-md rounded-b-sm border-2 transition-all
                ${isReserved ? 'bg-gray-900 border-gray-800 opacity-40 cursor-not-allowed' : ''}
                ${isSelected ? 'bg-[#FF9F00] border-[#e88a00]' : 'bg-gray-800 border-gray-700'}
                ${!isReserved && !isSelected ? 'hover:bg-gray-700 hover:border-[#FF9F00] hover:scale-110' : ''}
              `}
            >
              <span className={`absolute bottom-0 sm:bottom-0.5 left-0 right-0 text-center text-[8px] sm:text-[9px] font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>
                {id.split('-')[1]}
              </span>
              <div className={`absolute -top-0.5 sm:-top-1 left-1/2 -translate-x-1/2 w-4 sm:w-6 h-0.5 sm:h-1 rounded-t ${isSelected ? 'bg-[#e88a00]' : isReserved ? 'bg-gray-800' : 'bg-gray-700'}`} />
            </button>
          );
        })}

        <div className="text-[10px] sm:text-xs font-semibold text-gray-500 w-3 sm:w-4 text-center">{row}</div>
      </div>
    ));
  };

  const selectedArray = Array.from(selected).sort();

  return (
    <div className="w-full mx-auto px-2 sm:px-4 py-3 sm:py-4">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-1 justify-center">
        <img 
          src="/assets/images/The%20Breed%20Industries%20Just%20Logo-01-01.png" 
          alt="Breed Industries" 
          className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
        />
        <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
          The Future Proof Business <span className="text-[#FF9F00]">event</span>
        </h1>
      </div>
      <p className="text-center text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Click a seat to select · Click again to deselect</p>

      {/* Stats */}
      <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap justify-center">
        <div className="bg-gray-900 border border-gray-800 rounded-lg px-3 sm:px-4 py-2 text-center min-w-[80px] sm:min-w-[90px]">
          <div className="text-xl sm:text-2xl font-bold text-[#FF9F00]">{selected.size}</div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 mt-0.5">Selected</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg px-3 sm:px-4 py-2 text-center min-w-[80px] sm:min-w-[90px]">
          <div className="text-xl sm:text-2xl font-bold text-green-500">{total}</div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 mt-0.5">Available</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg px-3 sm:px-4 py-2 text-center min-w-[80px] sm:min-w-[90px]">
          <div className="text-xl sm:text-2xl font-bold text-blue-400">{reserved.size}</div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 mt-0.5">Reserved</div>
        </div>
      </div>

      {/* Venue */}
      <div className="flex flex-col items-center gap-0 mb-4 sm:mb-6">
        {/* Stage */}
        <div className="w-3/5 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 border-b-0 rounded-t-lg py-1.5 sm:py-2 text-center">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[2px] sm:tracking-[3px] uppercase text-slate-400">Stage</span>
        </div>
        <div className="w-3/5 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#FF9F00] to-transparent opacity-70 rounded-b-sm mb-3 sm:mb-4" />

        {/* Seats */}
        <div className="w-full max-w-[640px]">
          {renderSeats()}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-3 sm:gap-5 mb-4 sm:mb-6 flex-wrap justify-center text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400">
          <div className="w-4 h-3 sm:w-5 sm:h-4 bg-gray-800 border-2 border-gray-700 rounded-t" />
          Available
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400">
          <div className="w-4 h-3 sm:w-5 sm:h-4 bg-[#FF9F00] border-2 border-[#e88a00] rounded-t" />
          Selected
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400">
          <div className="w-4 h-3 sm:w-5 sm:h-4 bg-gray-900 border-2 border-gray-800 opacity-40 rounded-t" />
          Reserved
        </div>
      </div>

      {/* Book Button */}
      <div className="text-center">
        <button
          onClick={handleBook}
          disabled={selected.size === 0}
          className="px-6 sm:px-10 py-2.5 sm:py-3 bg-[#FF9F00] text-gray-900 rounded-lg text-sm sm:text-base font-bold transition-all hover:bg-[#e88a00] hover:-translate-y-0.5 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed disabled:transform-none"
        >
          {selected.size === 0 ? 'Select seats to continue' : `Book ${selected.size} Seat${selected.size !== 1 ? 's' : ''} →`}
        </button>
        {selected.size > 0 && (
          <p className="text-xs sm:text-sm text-gray-500 mt-2">Selected: {selectedArray.join(', ')}</p>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-700 rounded-lg px-6 py-3 text-sm text-white shadow-lg z-50 animate-in slide-in-from-bottom-4">
          {toast}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-5 z-50" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md relative animate-in zoom-in-95 duration-200">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-white text-2xl leading-none"
            >
              ×
            </button>

            {!showConfirm ? (
              <>
                <h2 className="text-xl font-semibold text-[#FF9F00] mb-1">Complete Your Booking</h2>
                <p className="text-sm text-gray-500 mb-5">Enter your details to confirm your seats</p>

                <div className="bg-[#0B1118] border border-gray-800 rounded-lg p-4 mb-5">
                  <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Your selected seats</div>
                  <div className="text-[#FF9F00] font-semibold text-base">{selectedArray.join(', ')}</div>
                  <div className="text-gray-400 text-xs mt-1">{selected.size} seat{selected.size !== 1 ? 's' : ''} selected</div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">First name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Themba"
                      className="w-full bg-[#0B1118] border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:border-[#FF9F00] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Last name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Dlamini"
                      className="w-full bg-[#0B1118] border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:border-[#FF9F00] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="themba@example.com"
                    className="w-full bg-[#0B1118] border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:border-[#FF9F00] focus:outline-none"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Phone number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="060 123 4567"
                    className="w-full bg-[#0B1118] border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:border-[#FF9F00] focus:outline-none"
                  />
                </div>

                <button
                  onClick={submitBooking}
                  className="w-full py-3 bg-[#FF9F00] text-gray-900 rounded-lg text-base font-bold hover:bg-[#e88a00] transition-all"
                >
                  Confirm Reservation →
                </button>
                <p className="text-center text-xs text-gray-600 mt-3">
                  You'll receive a confirmation via email · No payment required now
                </p>
              </>
            ) : (
              <div className="text-center py-3">
                <div className="w-16 h-16 bg-[#FF9F00] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-white mb-2">You're booked!</h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto mb-3">
                  Your seats have been reserved. Check your email for confirmation details.
                </p>
                <div className="text-[#FF9F00] font-bold text-lg tracking-wider my-3">{bookingRef}</div>
                <p className="text-white font-medium">{formData.firstName} {formData.lastName}</p>
                <p className="text-xs text-gray-500 mt-1">Seats: {selectedArray.join(', ')}</p>
                <button
                  onClick={closeModal}
                  className="mt-5 px-8 py-2.5 bg-gray-800 text-white border border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
