import { SeatPicker } from '@/components/events/SeatPicker';

export const metadata = {
  title: 'FPB Event — Breed Industries',
  description: 'Select your seats for the FPB event',
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
          maxWidth: '750px',
          background: 'rgba(11, 17, 24, 0.75)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 159, 0, 0.2)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          padding: '12px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <SeatPicker />
      </div>
    </div>
  );
}
