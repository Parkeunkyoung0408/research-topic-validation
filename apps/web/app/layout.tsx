import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "연구 주제 검증",
  description: "근거 기반 연구 주제 의사결정 지원"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
