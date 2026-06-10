export const metadata = {
  title: 'Seat Picker — Breed Industries',
  description: 'Select your seats for the event.',
};

export default function SeatPickerPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `
          linear-gradient(to bottom, rgba(11,17,24,0.7), rgba(11,17,24,0.95)),
          url('/assets/images/seating-bg.jpg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '700px',
          height: 'auto',
          background: 'rgba(11, 17, 24, 0.85)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 159, 0, 0.2)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
        }}
      >
        <iframe
          src="/seat-picker.html"
          style={{ width: '100%', height: '95vh', border: 'none', display: 'block', overflow: 'hidden' }}
          title="Seat Picker"
          scrolling="no"
        />
      </div>
    </div>
  );
}
