"use client";

import React, { Component, type ReactNode } from "react";
import { Button } from "@/src/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 max-w-md mb-8">
            An unexpected error occurred. We've been notified and are working to fix it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              type="button"
              onClick={this.handleReset}
              className="rounded-xl bg-blue-500 hover:bg-blue-600 px-8 h-12 flex items-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              RELOAD PAGE
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={() => window.location.href = "/"}
              className="rounded-xl border-gray-200 px-8 h-12"
            >
              GO HOME
            </Button>
          </div>
          {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
            <pre className="mt-8 p-4 bg-gray-50 rounded-lg text-left text-xs text-red-600 overflow-auto max-w-2xl w-full">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
