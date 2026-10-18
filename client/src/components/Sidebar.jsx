import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    MessageSquare,
    Database,
    ChevronDown,
    ChevronRight,
    LogOut,
    CreditCard,
    Building2,
    Users,
    Box,
    Tag,
    FileText,
    Activity,
    Search,
    Monitor,
    UserCheck
} from 'lucide-react';
import logoTrade from '../assets/trade_remittance_new.png';

const Sidebar = ({ user }) => {
    const [openMenus, setOpenMenus] = useState({
        ciu: true,
        master: false,
        users: false, // Renamed from admin
        activity: false
    });
    const location = useLocation();

    // Check if user is admin (idgroup 1)
    const isAdmin = user && (user.idgroup == 1);
    // Check if user is MGR (idgroup 2)
    const isMGR = user && (user.idgroup == 2);
    // Check if user is SPV (idgroup 3)
    const isSPV = user && (user.idgroup == 3);

    // Admin or MGR or SPV
    const hasPrivilegedAccess = isAdmin || isMGR || isSPV;

    const toggleMenu = (key) => {
        setOpenMenus(prev => {
            // New logic: If we are OPENING a menu (prev[key] is false), close all others.
            // If we are CLOSING (prev[key] is true), just close it.
            if (!prev[key]) {
                return {
                    ciu: key === 'ciu',
                    master: key === 'master',
                    users: key === 'users',
                    activity: key === 'activity'
                };
            }
            // Standard toggle if just closing
            return { ...prev, [key]: !prev[key] };
        });
    };
    const masterLinks = [
        { to: "/master/bic", label: "BIC" },
        { to: "/master/bnirr", label: "BNI RR" },
        { to: "/master/branch", label: "Branch" },
        { to: "/master/channel", label: "Channel Type" },
        { to: "/master/customertype", label: "Customer Type" },
        { to: "/master/payingagent", label: "Paying Agent" },
        { to: "/master/product", label: "Product List" },
        { to: "/master/subject", label: "Subject List" },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: '1rem', padding: '1.5rem 1rem' }}>
                <img src={logoTrade} alt="Logo" style={{ maxWidth: '70px', height: 'auto', borderRadius: '8px' }} />
                <div style={{ textAlign: 'left' }}>
                    <h1 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>Database</h1>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Trade & Remittance</span>
                </div>
            </div>

            <div style={{ padding: '1rem 0' }}>

                {/* Ciu Menu */}
                <div
                    className={`nav-item ${openMenus.ciu ? 'active' : ''}`}
                    onClick={() => toggleMenu('ciu')}
                >
                    <MessageSquare size={18} style={{ marginRight: '0.75rem' }} />
                    <span style={{ flex: 1 }}>Ciu</span>
                    {openMenus.ciu ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>

                {openMenus.ciu && (
                    <div className="nav-group">
                        <NavLink
                            to="/ciu/complaints"
                            className={({ isActive }) => `nav-item nav-sub ${isActive ? 'active' : ''}`}
                        >
                            Data List
                        </NavLink>
                        {isAdmin && (
                            <NavLink
                                to="/ciu/import-csv"
                                className={({ isActive }) => `nav-item nav-sub ${isActive ? 'active' : ''}`}
                            >
                                Import CSV
                            </NavLink>
                        )}
                    </div>
                )}

                {/* Master Menu */}
                <div
                    className={`nav-item ${openMenus.master ? 'active' : ''}`}
                    onClick={() => toggleMenu('master')}
                    style={{ marginTop: '0.5rem' }}
                >
                    <Database size={18} style={{ marginRight: '0.75rem' }} />
                    <span style={{ flex: 1 }}>Master</span>
                    {openMenus.master ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>

                {openMenus.master && (
                    <div className="nav-group">
                        {masterLinks.map(link => (
                            <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-item nav-sub ${isActive ? 'active' : ''}`}>
                                {link.label}
                            </NavLink>
                        ))}
                    </div>
                )}

                {/* Users Menu (Only for Group 1) - Renamed from Admin */}
                {isAdmin && (
                    <>
                        <div
                            className={`nav-item ${openMenus.users ? 'active' : ''}`}
                            onClick={() => toggleMenu('users')}
                            style={{ marginTop: '0.5rem' }}
                        >
                            <Users size={18} style={{ marginRight: '0.75rem' }} />
                            <span style={{ flex: 1 }}>Users</span>
                            {openMenus.users ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </div>

                        {openMenus.users && (
                            <div className="nav-group">
                                <NavLink
                                    to="/users"
                                    className={({ isActive }) => `nav-item nav-sub ${isActive ? 'active' : ''}`}
                                >
                                    Manage Users
                                </NavLink>
                            </div>
                        )}
                    </>
                )}

                {/* Activity Log Menu (For Admin & SVP) */}
                {hasPrivilegedAccess && (
                    <>
                        <div
                            className={`nav-item ${openMenus.activity ? 'active' : ''}`}
                            onClick={() => toggleMenu('activity')}
                            style={{ marginTop: '0.5rem' }}
                        >
                            <Activity size={18} style={{ marginRight: '0.75rem' }} />
                            <span style={{ flex: 1 }}>Activity Log</span>
                            {openMenus.activity ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </div>

                        {openMenus.activity && (
                            <div className="nav-group">
                                <NavLink
                                    to="/activity/user"
                                    className={({ isActive }) => `nav-item nav-sub ${isActive ? 'active' : ''}`}
                                >
                                    <UserCheck size={14} style={{ marginRight: '0.5rem' }} />
                                    Log User
                                </NavLink>
                                <NavLink
                                    to="/activity/app"
                                    className={({ isActive }) => `nav-item nav-sub ${isActive ? 'active' : ''}`}
                                >
                                    <Monitor size={14} style={{ marginRight: '0.5rem' }} />
                                    Log Aplikasi
                                </NavLink>
                            </div>
                        )}
                    </>
                )}

            </div>

            <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {user && (
                    <div className="flex flex-col items-center gap-1 mb-4 px-2" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textAlign: 'center' }}>
                        <div className="flex items-center gap-2">
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }}></div>
                            <div className="text-white font-medium">{user.fullname}</div>
                        </div>
                        <div>{user.jabatan}</div>
                    </div>
                )}
                <div className="nav-item" onClick={() => { localStorage.removeItem('user'); window.location.href = '/login'; }} style={{ justifyContent: 'center', width: '100%' }}>
                    <LogOut size={18} style={{ marginRight: '0.75rem' }} />
                    <span>Logout</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
