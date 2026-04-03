import './globals.css';

export const metadata = {
  title: 'Datos Contigo — Tus datos, contigo a donde vayas',
  description: 'Datos móviles instantáneos para tu viaje. eSIM digital para USA, Europa, Asia y LATAM. Sin chip físico, sin roaming. Activación vía QR.',
  keywords: 'datos moviles viaje, esim, esim estados unidos, esim europa, datos para viajar, datos contigo',
  openGraph: {
    title: 'Datos Contigo — Tus datos, contigo a donde vayas',
    description: 'Datos móviles para 200+ destinos. Activación instantánea.',
    url: 'https://datoscontigo.com',
    siteName: 'Datos Contigo',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
    }
