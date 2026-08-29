import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-card p-6 border border-red-500/20 bg-red-950/10 text-left space-y-4 max-w-md mx-auto">
          <h3 className="text-lg font-serif font-semibold text-red-400">Booking Module Error</h3>
          <p className="text-xs text-luxury-lightGray font-light leading-relaxed">
            {this.state.error && this.state.error.toString()}
          </p>
          {this.state.error && this.state.error.stack && (
            <pre className="text-[10px] text-red-300 font-mono bg-black/40 p-3 overflow-x-auto max-h-40 no-scrollbar">
              {this.state.error.stack}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-semibold uppercase tracking-widest transition-colors duration-200 cursor-pointer"
          >
            Reload Module
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
