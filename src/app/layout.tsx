import './globals.css';
import { Inter } from 'next/font/google';
import JsonLd from '@/components/JsonLd';
import { Metadata } from 'next';

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '700'],
});

export const metadata: Metadata = {
    metadataBase: new URL('https://www.calcmydrive.com'),
    title: {
        template: '%s | CalcMyDrive',
        default: 'CalcMyDrive - Driveway Cost & Material Calculator'
    },
    description: 'Calculate accurate costs and materials for your driveway project. Free calculators for asphalt, concrete, gravel, and paving driveways.',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
    openGraph: {
        type: 'website',
        siteName: 'CalcMyDrive',
        locale: 'en_US',
    }
}

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
