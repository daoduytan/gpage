import React, { Component, type Node } from 'react';
import ErrorLayout from './ErrorLayout';

type ErrorBoundaryProps = {
  children: Node,
  fallback: Node
};

type ErrorBoundaryState = {
  hasError: boolean,
  error: any
};

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  render() {
    const { children, fallback } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      if (fallback) return fallback;
      return <ErrorLayout />;
    }
    return children;
  }
}
