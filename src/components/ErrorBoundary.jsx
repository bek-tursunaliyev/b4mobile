import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            fontFamily: "sans-serif",
            background: "#f7f7f8",
          }}
        >
          <div
            style={{
              maxWidth: 420,
              textAlign: "center",
              background: "#fff",
              border: "1px solid #ededed",
              borderRadius: 20,
              padding: "36px 28px",
            }}
          >
            <h1 style={{ fontSize: 18, marginBottom: 10 }}>
              Ilovada xatolik yuz berdi
            </h1>
            <p style={{ color: "#777", fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
              Iltimos, sahifani qayta yuklang. Muammo davom etsa, quyidagi
              xabarni administratorga yuboring.
            </p>
            <pre
              style={{
                textAlign: "left",
                background: "#f7f7f8",
                borderRadius: 10,
                padding: 12,
                fontSize: 11,
                color: "#c0392b",
                overflowX: "auto",
                whiteSpace: "pre-wrap",
              }}
            >
              {String(this.state.error?.message || this.state.error)}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
