import type { NextPageContext } from 'next';

function ErrorPage({ statusCode }: { statusCode?: number }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      padding: '40px',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 900, color: '#8b1a1a', margin: 0 }}>
        {statusCode || 'Error'}
      </h1>
      <p style={{ fontSize: '1rem', color: '#6b5d4d', marginTop: '8px' }}>
        {statusCode === 404
          ? 'Page not found'
          : 'An error occurred'}
      </p>
      <a
        href="/"
        style={{
          display: 'inline-block',
          marginTop: '24px',
          padding: '10px 24px',
          background: '#8b1a1a',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '4px',
          fontSize: '0.9rem',
        }}
      >
        Back to Dashboard
      </a>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
