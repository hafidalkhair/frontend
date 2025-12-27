'use client';

import Link from 'next/link';
import { useState, CSSProperties } from 'react';

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={styles.container}>
      {/* Simple CSS Reset & Animation */}
      <style jsx global>{`
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={styles.card}>
        
        {/* Header / Icon Area */}
        <div style={styles.headerSection}>
            <div style={styles.iconWrapper}>
                <span style={styles.icon}>🎓</span>
            </div>
            <div style={styles.badge}>v2.0 Released</div>
        </div>

        <h1 style={styles.title}>
          Kampus App
        </h1>
        
        <p style={styles.subtitle}>
          Sistem Informasi Akademik Terpadu.<br/>
          Kelola data Mahasiswa dan Dosen dengan lebih efisien, cepat, dan modern.
        </p>

        {/* Action Area */}
        <div style={styles.actionArea}>
            <Link href="/login" style={{ textDecoration: 'none', width: '100%' }}>
            <button 
                style={{
                ...styles.button,
                ...(isHovered ? styles.buttonHover : {})
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                Masuk ke Dashboard
                <span style={styles.arrow}>→</span>
            </button>
            </Link>
        </div>

        <div style={styles.footer}>
           <p style={styles.footerText}>
             Powered by Laravel API & Next.js
           </p>
        </div>

      </div>
    </div>
  );
}

// --- Modern Minimalist Styles ---

const styles: { [key: string]: CSSProperties } = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb', // Light Gray background (Konsisten dengan Login)
        color: '#111827',
        padding: '20px',
    },
    card: {
        background: '#ffffff',
        padding: '48px',
        borderRadius: '24px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)', // Soft shadow
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center',
        border: '1px solid #e5e7eb', // Thin border
        animation: 'fadeInUp 0.6s ease-out',
    },
    headerSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
    },
    iconWrapper: {
        fontSize: '40px',
        width: '80px',
        height: '80px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#eff6ff', // Light Blue circle
        borderRadius: '20px',
        marginBottom: '8px',
    },
    icon: {
        lineHeight: 1,
        display: 'block',
    },
    badge: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#4f46e5',
        backgroundColor: '#eef2ff',
        padding: '4px 12px',
        borderRadius: '999px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    title: {
        color: '#111827', 
        margin: '0 0 16px 0', 
        fontSize: '32px',
        fontWeight: '800',
        letterSpacing: '-0.025em',
        lineHeight: 1.2,
    },
    subtitle: {
        color: '#6b7280', // Cool Gray
        fontSize: '16px', 
        lineHeight: '1.6', 
        marginBottom: '40px',
        fontWeight: '400',
        maxWidth: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    actionArea: {
        width: '100%',
        marginBottom: '32px',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '16px 24px',
        backgroundColor: '#111827', // Dark Slate / Black (Konsisten dengan Login)
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    buttonHover: {
        backgroundColor: '#000000',
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    arrow: {
        marginLeft: '8px',
        transition: 'transform 0.2s ease',
    },
    footer: {
        borderTop: '1px solid #f3f4f6', 
        paddingTop: '24px',
    },
    footerText: {
        fontSize: '13px', 
        color: '#9ca3af',
        fontWeight: '500',
    }
};