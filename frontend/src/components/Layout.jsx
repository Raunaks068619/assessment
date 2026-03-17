import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="app-container">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={setSidebarOpen} />

            <main className="main-content">
                <header className="topbar">
                    <button className="menu-trigger" onClick={() => setSidebarOpen(true)}>
                        ☰
                    </button>
                    <div style={{ marginLeft: 16, fontWeight: 600 }}>Admin Dashboard</div>
                </header>

                <div className="page-container">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
