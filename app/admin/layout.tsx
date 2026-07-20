import { notFound } from "next/navigation";

export default function AdminLayout({
  children: _children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  notFound();
}
