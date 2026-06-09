import React from "react";

export default class ErrorBoundary
extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      hasError: false
    };

  }

  static getDerivedStateFromError() {

    return {
      hasError: true
    };

  }

  componentDidCatch(
    error,
    errorInfo
  ) {

    console.error(
      error,
      errorInfo
    );

  }

  render() {

    if (
      this.state.hasError
    ) {

      return (

        <div
          style={{
            color: "white",
            padding: 20
          }}
        >
          Something went wrong.
        </div>

      );

    }

    return this.props.children;

  }

}