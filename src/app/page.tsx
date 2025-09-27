import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-temple">
      <div className="relative overflow-hidden">
        {/* Greek columns decoration */}
        <div className="absolute inset-0 flex justify-around items-end opacity-10">
          <div className="greek-column w-8 h-full"></div>
          <div className="greek-column w-8 h-full"></div>
          <div className="greek-column w-8 h-full"></div>
          <div className="greek-column w-8 h-full"></div>
          <div className="greek-column w-8 h-full"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-6xl font-serif font-bold text-primary-800 mb-6">
              ΑΘΗΝΑ
            </h1>
            <p className="text-xl text-primary-600 mb-8 max-w-2xl mx-auto">
              Embrace the wisdom of ancient Greece on your journey to personal excellence. 
              Let Athena, the goddess of wisdom, guide your path to self-improvement.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/profile"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Begin Your Journey
              </Link>
              <Link
                href="/dashboard"
                className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                View Dashboard
              </Link>
            </div>
          </div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gold-200">
              <div className="text-gold-600 text-3xl mb-4">🏛️</div>
              <h3 className="text-lg font-serif font-semibold text-primary-700 mb-2">
                Profile Setup
              </h3>
              <p className="text-primary-600">
                Define your purpose, vision, and values to create a foundation for growth.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gold-200">
              <div className="text-gold-600 text-3xl mb-4">📊</div>
              <h3 className="text-lg font-serif font-semibold text-primary-700 mb-2">
                Progress Tracking
              </h3>
              <p className="text-primary-600">
                Monitor your habits and visualize your journey toward personal excellence.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gold-200">
              <div className="text-gold-600 text-3xl mb-4">💬</div>
              <h3 className="text-lg font-serif font-semibold text-primary-700 mb-2">
                AI Guidance
              </h3>
              <p className="text-primary-600">
                Receive personalized advice and insights powered by ancient wisdom.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gold-200">
              <div className="text-gold-600 text-3xl mb-4">⏱️</div>
              <h3 className="text-lg font-serif font-semibold text-primary-700 mb-2">
                Focus Timer
              </h3>
              <p className="text-primary-600">
                Use the Pomodoro technique to enhance concentration and productivity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}