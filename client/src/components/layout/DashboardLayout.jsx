import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useRedux';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, loading, navigate]);

    if (!isAuthenticated) return null; // Avoid flashing protected content

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Navigation Components */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <TopBar
                onMenuClick={() => setIsSidebarOpen(true)}
            />

            {/* Main Content Area */}
            <main className="transition-all duration-300 pt-16 md:pl-64 min-h-screen">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {/* Render Child Routes (Dashboard, Companies, etc.) */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
