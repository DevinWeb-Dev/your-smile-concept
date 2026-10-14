import React from "react";
import {
  AlertCircle,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Smile,
} from "lucide-react";

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, info) {
    console.error(
      "YOUR SMILE — Unexpected rendering error:",
      error,
      info
    );
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main
        style={{
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          padding: "30px",
          background: "#F9F8F3",
          color: "#173D43",
          fontFamily: "'DM Sans', Arial, sans-serif",
          textAlign: "center",
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: "600px",
            padding: "clamp(28px, 6vw, 64px)",
            border: "1px solid #D9E8DD",
            background: "#FFFFFF",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "34px",
            }}
          >
            <Smile
              size={34}
              color="#5D917E"
              strokeWidth={1.5}
            />

            <strong
              style={{
                fontSize: "1.3rem",
                letterSpacing: "0.07em",
              }}
            >
              YOUR SMILE.
            </strong>
          </div>

          <AlertCircle
            size={35}
            color="#C58E7A"
            strokeWidth={1.5}
          />

          <h1
            style={{
              margin: "25px 0 18px",
              fontFamily:
                "'DM Serif Display', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(2.7rem, 7vw, 4.2rem)",
              lineHeight: 1.08,
            }}
          >
            A little unexpected
            <br />
            <em style={{ color: "#79A18E" }}>
              interruption.
            </em>
          </h1>

          <p
            style={{
              color: "#718A80",
              lineHeight: 1.9,
              fontSize: "0.94rem",
              marginBottom: "29px",
            }}
          >
            This website concept encountered an
            unexpected error. You can reload the
            experience and try again.
          </p>

          <button
            type="button"
            onClick={this.handleReload}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              minHeight: "52px",
              padding: "14px 24px",
              background: "#173D43",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              fontSize: "0.84rem",
              fontWeight: 800,
            }}
          >
            <RefreshCw size={17} />
            Reload Experience
            <ArrowRight size={17} />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "9px",
              marginTop: "35px",
              color: "#81988B",
              fontSize: "0.7rem",
            }}
          >
            <ShieldCheck size={17} />

            YOUR SMILE · WEBSITE CONCEPT
          </div>
        </section>
      </main>
    );
  }
}