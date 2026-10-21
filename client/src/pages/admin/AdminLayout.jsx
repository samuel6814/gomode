import React, { useState } from 'react';
import styled from 'styled-components';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';

// --- Colors & Theme ---
const COLORS = {
  background: '#f9f9fb',            
};

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${COLORS.background};
  width: 100%;
  overflow-x: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  margin-left: 260px; /* Sidebar width */
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;

const PageContent = styled.main`
  padding: 2rem;
  flex: 1;

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const Overlay = styled.div`
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 45;

  @media (max-width: 1024px) {
    display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  }
`;

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <PageContainer>
      {/* 1. The Persistent Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay $isOpen={isSidebarOpen} onClick={toggleSidebar} />
      
      <ContentArea>
        {/* 2. The Persistent Top Header (Now imported as a clean component) */}
        <AdminNavbar toggleSidebar={toggleSidebar} />

        {/* 3. The Content passed from the Page Component (e.g. AdminDashboard) */}
        <PageContent>
          {children}
        </PageContent>

      </ContentArea>
    </PageContainer>
  );
};

export default AdminLayout;