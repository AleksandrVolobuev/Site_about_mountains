import "./globals.css";

export const metadata = {
  title: "MNTN | Polski przewodnik po górach",
  description:
    "MNTN - polski przewodnik po górach, szlakach i przygotowaniu do wędrówek w Tatrach, Beskidach oraz Karkonoszach.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
