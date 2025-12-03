'use client';

import Link from 'next/link';
import { useState, CSSProperties } from 'react'; // 1. Import CSSProperties

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={styles.container}>
      {/* CSS Keyframes */}
      <style jsx global>{`
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Dekorasi Background */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.card}>
        
        {/* Logo / Icon */}
        <div style={styles.iconWrapper}>
          <span style={styles.icon}>🎓</span>
        </div>

        <h1 style={styles.title}>
          Kampus App
        </h1>
        
        <p style={styles.subtitle}>
          Selamat datang di Sistem Informasi Akademik Terpadu. <br/>
          Platform digital masa depan untuk Mahasiswa dan Dosen.
        </p>

        {/* Tombol */}
        <Link href="/login">
          <button 
            style={{
              ...styles.button,
              ...(isHovered ? styles.buttonHover : {})
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Masuk ke Aplikasi
            <span style={{ marginLeft: '10px' }}>→</span>
          </button>
        </Link>

        <div style={styles.footer}>
           <p style={styles.footerText}>
             🚀 Project API Laravel & Next.js
           </p>
        </div>

      </div>
    </div>
  );
}

// --- Styles ---

// 2. Tambahkan tipe data explicit di sini agar TypeScript tidak error
const styles: { [key: string]: CSSProperties } = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
        backgroundSize: '400% 400%',
        animation: 'gradientBG 15s ease infinite',
        fontFamily: "'Inter', sans-serif",
        padding: '20px',
        position: 'relative', // Error position hilang
        overflow: 'hidden',
    },
    blob1: {
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: 0,
    },
    blob2: {
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '350px',
        height: '350px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        zIndex: 0,
    },
    card: {
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '60px 40px',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
        width: '100%',
        maxWidth: '480px',
        textAlign: 'center', // Error textAlign hilang
        border: '1px solid rgba(255, 255, 255, 0.5)',
        zIndex: 1,
        animation: 'slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
    },
    iconWrapper: {
        fontSize: '60px', 
        marginBottom: '20px',
        display: 'inline-block',
        animation: 'float 3s ease-in-out infinite',
        filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))'
    },
    icon: {
        display: 'block',
    },
    title: {
        color: '#1e293b', 
        margin: '0 0 15px 0', 
        fontSize: '36px',
        fontWeight: '800', // TypeScript menerima number atau string untuk fontWeight
        letterSpacing: '-1px',
        background: 'linear-gradient(to right, #2563eb, #9333ea)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        color: '#64748b', 
        fontSize: '16px', 
        lineHeight: '1.6', 
        marginBottom: '40px',
        fontWeight: '500',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '18px',
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '14px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.4)',
        transition: 'all 0.3s ease',
        transform: 'scale(1)',
    },
    buttonHover: {
        transform: 'scale(1.02) translateY(-2px)',
        boxShadow: '0 15px 30px -5px rgba(37, 99, 235, 0.5)',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    },
    footer: {
        marginTop: '40px', 
        borderTop: '1px solid rgba(0,0,0,0.05)', 
        paddingTop: '25px'
    },
    footerText: {
        fontSize: '13px', 
        color: '#94a3b8',
        fontWeight: '500',
        letterSpacing: '0.5px'
    }
};