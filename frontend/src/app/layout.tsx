import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "IPFS File Storage",
  description: "Decentralized file storage on Rootstock with IPFS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}