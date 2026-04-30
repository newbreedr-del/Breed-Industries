import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const title = searchParams.get('title') || 'Breed Industries';
    const subtitle = searchParams.get('subtitle') || 'Build Your Business Empire';
    const image = searchParams.get('image') || '/assets/images/portfolio-hero.png';

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            position: 'relative',
          }}
        >
          {/* Background Image */}
          <img
            src={`https://thebreed.co.za${image}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          
          {/* Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)',
            }}
          />

          {/* Content */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '60px',
              width: '70%',
            }}
          >
            <p
              style={{
                color: '#f59e0b',
                fontSize: '20px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '16px',
              }}
            >
              Breed Industries
            </p>
            <h1
              style={{
                color: '#ffffff',
                fontSize: '64px',
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: '16px',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '32px',
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Logo */}
          <img
            src="https://thebreed.co.za/assets/images/logos/breed-logo-just.png"
            style={{
              position: 'absolute',
              top: '30px',
              right: '30px',
              width: '60px',
              height: '60px',
              opacity: 0.9,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.log(`${e}`);
    return new Response('Failed to generate image', { status: 500 });
  }
}
