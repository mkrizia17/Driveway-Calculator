import './globals.css';
import { Inter } from 'next/font/google';
import JsonLd from '@/components/JsonLd';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '700'],
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <JsonLd />
            </head>
            <body className={inter.className}>
                {children}
            </body>
        </html>
    );
}
