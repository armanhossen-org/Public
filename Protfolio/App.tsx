import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { supabase, ensureProjectResourcesExist } from './services/supabase';

// UI Components
import { SunIcon, MoonIcon, Spinner } from './components/UI';
// Page Components
import { ProjectGrid, ProjectDetail } from './components/Portfolio';
import { Login, ProtectedRoute, AdminPanel } from './components/Admin';

// --- THEME TOGGLE ---
const ThemeToggle: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    return (
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </button>
    );
};

// --- LAYOUT: NAVBAR ---
const Navbar: React.FC = () => {
    const { session } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };
    
    const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
    const activeNavLinkClasses = "bg-primary-100 dark:bg-gray-700 text-primary-700 dark:text-white";

    const navLinks = (
      <>
        <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Home</NavLink>
        <NavLink to="/about" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>About</NavLink>
        <NavLink to="/contact" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Contact</NavLink>
        {session && (
          <NavLink to="/admin" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Admin</NavLink>
        )}
      </>
    );

    return (
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">MyPortfolio</Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {navLinks}
              {session 
                  ? <button onClick={handleLogout} className={navLinkClasses}>Logout</button>
                  : <NavLink to="/login" className={navLinkClasses}>Login</NavLink>
              }
              <ThemeToggle />
            </div>
            <div className="md:hidden flex items-center">
              <ThemeToggle />
              <button onClick={() => setIsOpen(!isOpen)} className="ml-2 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-start">
            {navLinks}
            {session 
                ? <button onClick={handleLogout} className={navLinkClasses + " w-full text-left"}>Logout</button>
                : <NavLink to="/login" className={navLinkClasses + " w-full text-left"}>Login</NavLink>
            }
          </div>
        )}
      </nav>
    );
};

// --- LAYOUT: FOOTER ---
const Footer: React.FC = () => (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} MyPortfolio. All rights reserved.
        </div>
    </footer>
);

// --- PAGE COMPONENTS ---
const HomePage: React.FC = () => (
    <>
        <header className="text-center py-16 px-4">
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">Welcome to My Portfolio</h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Discover my latest projects and creative work.</p>
        </header>
        <ProjectGrid />
    </>
);

const AboutPage: React.FC = () => (
    <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">About Me</h1>
        <div className="prose prose-lg dark:prose-invert mx-auto text-gray-600 dark:text-gray-300">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
    </div>
);

const ContactPage: React.FC = () => (
    <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Me</h1>
        <p className="text-center text-lg text-gray-600 dark:text-gray-300">
            Feel free to reach out via email at <a href="mailto:hello@example.com" className="text-primary-600 dark:text-primary-400 hover:underline">hello@example.com</a>.
        </p>
    </div>
);

const ProjectPage: React.FC = () => <div className="py-12"><ProjectDetail /></div>;
const AdminLoginPage: React.FC = () => <Login />;
const AdminDashboardPage: React.FC = () => <ProtectedRoute><AdminPanel /></ProtectedRoute>;

// --- MAIN APP ---
const App: React.FC = () => {
    const [initializing, setInitializing] = useState(true);
    const [initError, setInitError] = useState<string | null>(null);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                await ensureProjectResourcesExist();
            } catch (error: any) {
                setInitError(error.message);
            } finally {
                setInitializing(false);
            }
        };
        initializeApp();
    }, []);

    if (initializing) {
        return (
            <div className="h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
                <Spinner className="w-12 h-12" />
                <p className="mt-4 text-lg">Initializing application...</p>
            </div>
        );
    }

    if (initError) {
        return (
            <div className="h-screen flex flex-col justify-center items-center bg-red-50 dark:bg-gray-900 p-8">
                <div className="max-w-2xl text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl">
                    <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Application Initialization Failed</h1>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">There was a problem setting up the application. Please follow the steps below:</p>
                    <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 text-left text-sm text-gray-800 dark:text-gray-200 rounded-md whitespace-pre-wrap font-mono">
                        {initError}
                    </pre>
                    <button onClick={() => window.location.reload()} className="mt-6 px-4 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-900 dark:text-gray-200 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/project/:id" element={<ProjectPage />} />
                    <Route path="/login" element={<AdminLoginPage />} />
                    <Route path="/admin" element={<AdminDashboardPage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

export default App;
