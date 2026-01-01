
import React, { useState, useEffect, useRef } from 'react';

// --- The user's provided logic encapsulated ---
const MockReact = (() => {
  let cache: Record<string, any> = {};
  let hookIndex = 0;

  function resetIndex() { hookIndex = 0; }

  function useMockState<T>(initialValue: T): [T, (newValue: T | ((prev: T) => T)) => void] {
    const key = `s${hookIndex++}`;
    if (cache[key] === undefined) {
      cache[key] = initialValue;
    }
    
    const setValue = (newValue: T | ((prev: T) => T)) => {
      if (typeof newValue === 'function') {
        cache[key] = (newValue as Function)(cache[key]);
      } else {
        cache[key] = newValue;
      }
      // In a real framework, this would trigger a re-render.
      // We simulate this by having the parent component track its own real React state
    };
    
    return [cache[key], setValue];
  }

  function getCache() { return { ...cache }; }

  return { useMockState, resetIndex, getCache };
})();

export const HookLab: React.FC = () => {
  // We use real React state to trigger the visual updates of our Mock system
  const [renderCount, setRenderCount] = useState(0);
  const [currentCache, setCurrentCache] = useState<Record<string, any>>({});

  // Simulate a component re-running its logic
  const refreshMock = () => {
    MockReact.resetIndex();
    // These calls register the state in the Mock cache
    const [count, setCount] = MockReact.useMockState(0);
    const [name, setName] = MockReact.useMockState("React User");
    
    setCurrentCache(MockReact.getCache());
  };

  useEffect(() => {
    refreshMock();
  }, [renderCount]);

  const incrementCount = () => {
    MockReact.resetIndex();
    const [count, setCount] = MockReact.useMockState(0);
    setCount(count + 1);
    setRenderCount(prev => prev + 1);
  };

  const updateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    MockReact.resetIndex();
    const [count] = MockReact.useMockState(0); // must keep order
    const [name, setName] = MockReact.useMockState("React User");
    setName(e.target.value);
    setRenderCount(prev => prev + 1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-800">Hook Runtime Simulation</h2>
        <p className="text-sm text-slate-500">Visualizing the internal cache of the provided polyfill</p>
      </div>

      <div className="p-6 flex-1 space-y-8 overflow-y-auto">
        {/* Controls Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30 flex flex-col gap-3">
            <label className="text-xs font-bold text-blue-600 uppercase tracking-wider">Hook 1: Counter State</label>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-blue-900">{currentCache['s0'] ?? 0}</span>
              <button 
                onClick={incrementCount}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Increment Mock State
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/30 flex flex-col gap-3">
            <label className="text-xs font-bold text-purple-600 uppercase tracking-wider">Hook 2: Text State</label>
            <input 
              type="text"
              value={currentCache['s1'] ?? ''}
              onChange={updateName}
              className="px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 w-full"
              placeholder="Type something..."
            />
          </div>
        </div>

        {/* Visual Cache Representation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Internal Cache Store (c_)</h3>
            <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] rounded font-mono">Render ID: {renderCount}</span>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-emerald-400">
              {JSON.stringify(currentCache, null, 2)}
            </pre>
          </div>
        </div>

        <div className="text-sm text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200 italic">
          <strong>Note:</strong> This simulation uses the exact state tracking logic from your snippet. Every interaction updates the <code>c_</code> cache object and increments the <code>h_</code> counter behind the scenes.
        </div>
      </div>
    </div>
  );
};
