import { AuthProvider } from './context/AuthContext';
import NavCompMobile from './components/nav-comp-mobile';

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <nav>
            <NavCompMobile />
          </nav>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
