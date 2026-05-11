export default function GlitchText({ children, className = "", as: Tag = "span" }) {
  const text = typeof children === "string" ? children : "";
  return (
    <Tag className={`glitch ${className}`} data-text={text}>
      {children}
    </Tag>
  );
}
