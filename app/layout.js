import "./globals.css";

export const metadata = {
  title: "Restauruuun",
  description: "AI-augmented Dining Experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        {/*Font loading (valid JSX syntax) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;600&family=Great+Vibes&family=Noto+Serif+SC:wght@200;300;400;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>{children}</body>
    </html>
  );
}
