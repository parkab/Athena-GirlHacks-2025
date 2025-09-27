import PomodoroTimer from '@/components/PomodoroTimer';

export default function PomodoroPage() {
  return (
    <div className="min-h-screen bg-temple py-12">
      <div className="relative">
        {/* Greek columns decoration */}
        <div className="absolute inset-0 flex justify-around items-end opacity-5">
          <div className="greek-column w-4 h-full"></div>
          <div className="greek-column w-4 h-full"></div>
          <div className="greek-column w-4 h-full"></div>
          <div className="greek-column w-4 h-full"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PomodoroTimer />
        </div>
      </div>
    </div>
  );
}