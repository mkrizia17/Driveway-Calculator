"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

export default function Navigation() {
    const pathname = usePathname();

    return (
        <nav className={styles.navigation}>
            <ul className={styles.navList}>
                <li className={pathname === '/' ? styles.active : ''}>
                    <Link href="/">Home</Link>
                </li>
                <li className={pathname === '/gravel' ? styles.active : ''}>
                    <Link href="/gravel">Gravel</Link>
                </li>
                <li className={pathname === '/concrete' ? styles.active : ''}>
                    <Link href="/concrete">Concrete</Link>
                </li>
                <li className={pathname === '/asphalt' ? styles.active : ''}>
                    <Link href="/asphalt">Asphalt</Link>
                </li>
                <li className={pathname === '/pavers' ? styles.active : ''}>
                    <Link href="/pavers">Pavers</Link>
                </li>
            </ul>
        </nav>
    );
} 