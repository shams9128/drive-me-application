// Shared visual building blocks used across Home / About (and reusable
// anywhere else that wants the same section/card look).

export const COLORS = {
  bg1: "#4286f4", // hero - blue
  bg2: "#474e5d", // dark blue
  bg3: "#ffffff", // white
  bg3Text: "#555555",
  bg4: "#2f2f2f", // black gray
  white: "#ffffff",
  accent: "#1abc9c",
};

export function Section({ background, color, children, style, ...rest }) {
  return (
    <div
      style={{
        backgroundColor: background,
        color,
        padding: "70px 20px",
        textAlign: "center",
        ...style,
      }}
      {...rest}
    >
      <div style={{ maxWidth: 1170, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

export function FeatureCard({ icon, title, children }) {
  return (
    <div style={{ flex: "1 1 260px", maxWidth: 340, padding: "0 15px" }}>
      <div
        style={{
          width: 90,
          height: 90,
          margin: "0 auto 20px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f2f4f7",
          color: COLORS.bg1,
        }}
      >
        {icon}
      </div>
      <h3 style={{ margin: "0 0 10px" }}>{title}</h3>
      <p style={{ fontSize: 16, color: COLORS.bg3Text }}>{children}</p>
    </div>
  );
}
