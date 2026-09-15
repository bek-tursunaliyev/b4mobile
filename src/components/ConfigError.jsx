import React from "react";

function ConfigError() {
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
          maxWidth: 440,
          textAlign: "center",
          background: "#fff",
          border: "1px solid #ededed",
          borderRadius: 20,
          padding: "36px 28px",
        }}
      >
        <h1 style={{ fontSize: 18, marginBottom: 10 }}>Sozlash talab qilinadi</h1>
        <p style={{ color: "#777", fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
          Sayt Supabase bilan bog‘lanishi uchun kerakli muhit o‘zgaruvchilari
          topilmadi. Hosting sozlamalarida (masalan Vercel) quyidagilarni
          qo‘shing va qayta deploy qiling:
        </p>
        <pre
          style={{
            textAlign: "left",
            background: "#f7f7f8",
            borderRadius: 10,
            padding: 12,
            fontSize: 11,
            color: "#333",
            overflowX: "auto",
          }}
        >
          VITE_SUPABASE_URL{"\n"}VITE_SUPABASE_ANON_KEY
        </pre>
      </div>
    </div>
  );
}

export default ConfigError;
