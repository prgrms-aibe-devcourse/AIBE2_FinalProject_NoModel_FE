import { useState } from 'react';
import { ComponentsDemo } from './pages/ComponentsDemo';
import { ApiDemo } from './components/ApiDemo/ApiDemo';
import { Button } from './components/Button/Button';
import './styles/globals.css';

type Page = 'components' | 'api';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('components');

  return (
    <div className="app">
      <nav className="app-nav">
        <div className="app-nav__container">
          <h1 className="app-nav__title">Linear Design System</h1>
          <div className="app-nav__buttons">
            <Button
              variant={currentPage === 'components' ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setCurrentPage('components')}
            >
              Components
            </Button>
            <Button
              variant={currentPage === 'api' ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setCurrentPage('api')}
            >
              API Demo
            </Button>
          </div>
        </div>
      </nav>

      <main className="app-main">
        {currentPage === 'components' && <ComponentsDemo />}
        {currentPage === 'api' && <ApiDemo />}
      </main>

      <style>{`
        .app {
          min-height: 100vh;
          background-color: var(--color-background-primary);
        }

        .app-nav {
          background-color: var(--color-background-primary);
          border-bottom: 1px solid var(--color-border);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .app-nav__container {
          max-width: 1200px;
          margin: 0 auto;
          padding: var(--spacing-4) var(--spacing-6);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .app-nav__title {
          margin: 0;
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-text-primary);
        }

        .app-nav__buttons {
          display: flex;
          gap: var(--spacing-2);
        }

        .app-main {
          min-height: calc(100vh - 80px);
        }

        @media (max-width: 768px) {
          .app-nav__container {
            flex-direction: column;
            gap: var(--spacing-3);
            padding: var(--spacing-3) var(--spacing-4);
          }

          .app-nav__buttons {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
