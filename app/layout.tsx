import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LOCALOOM — 부산 로컬 트립 다이어리",
  description: "부산의 장소와 감정을 사진, 그림, 색으로 모아 나만의 여행책을 만드는 로컬 트립 다이어리",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
