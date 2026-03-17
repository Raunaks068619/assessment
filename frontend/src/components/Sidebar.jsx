import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <>
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    Admin Dashboard
                </div>
                <nav>
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        onClick={() => toggleSidebar(false)}
                    >
                        Items
                    </NavLink>
                    <NavLink
                        to="/stats"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        onClick={() => toggleSidebar(false)}
                    >
                        Stats
                    </NavLink>
                </nav>
            </aside>

            {isOpen && (
                <div
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 30 }}
                    onClick={() => toggleSidebar(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
