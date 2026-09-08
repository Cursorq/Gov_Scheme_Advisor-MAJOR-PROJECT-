import React, { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-8 border-t-8 border-orange-500">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <span>🇮🇳</span> Government Scheme Advisor
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            AI-Powered Personalized Recommendation & Assistance System
          </p>
          <span className="inline-block bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full mt-2 font-semibold">
            Team ID: CSE27-143
          </span>
        </div>

        {/* Chat Interface Placeholder */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='e.g. "I am a 22-year-old student from Uttarakhand needing a scholarship..."'
              className="flex-1 px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700"
            />
            <button 
              disabled 
              className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-xl opacity-60 cursor-not-allowed hover:bg-orange-600 transition flex items-center justify-center gap-2"
            >
              🔍 Ask Advisor (Coming Soon)
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
          </p>
        </div>

        {/* Team Credits - Highlight YOUR role as Frontend */}
        <div className="mt-6 text-center text-sm text-gray-400 border-t pt-4">
          Built by: Priyanshu Joshi  • Priyanshu Panwar  • Prithviraj Chauhan  • Bhaumik Negi 
        </div>
      </div>
    </div>
  );
}

export default App;