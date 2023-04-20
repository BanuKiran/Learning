// scroll bar
import 'simplebar/src/simplebar.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// contexts
import { SettingsProvider } from './contexts/SettingsContext';
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';

//
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './contexts/JWTContext';

// ----------------------------------------------------------------------

ReactDOM.render(
  <HelmetProvider>
    <SettingsProvider>
      <CollapseDrawerProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </CollapseDrawerProvider>
    </SettingsProvider>
  </HelmetProvider>,
  document.getElementById('root')
);
