import { useState } from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom"; 
import { Toaster } from "react-hot-toast";
import { Menu } from "lucide-react";

// --- Imported Components ---
import Sidebar from "./components/Sidebar";
import MiniNavbar from "./components/MiniNavbar"; 
import { Suspense } from 'react';
import GlobalLoader from './components/GlobalLoader';
import { BRAND_NAME, CANVAS, NAVY_ACCENT, FONT_HERO } from './theme/brand';

// --- Styled Components ---

const Container = styled.div`
  display: flex; 
  height: 100vh;
  width: 100%;
  background-color: ${CANVAS};
  overflow: hidden; 
`;

const MainContent = styled.main`
  flex: 1; 
  height: 100%;
  overflow-y: auto; 
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1600px; 
  margin: 0 auto;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    padding: 0px; 
  }
`;

const MobileHeader = styled.div`
  display: none;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px; 
  padding: 20px 20px 0 20px; 
  
  @media (max-width: 768px) {
    display: flex;
  }

  h2 {
    font-family: ${FONT_HERO};
    font-size: 18px;
    font-weight: 800;
    color: ${NAVY_ACCENT};
  }
`;

const MenuButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${NAVY_ACCENT};
  display: none; 

  @media (max-width: 768px) {
    display: block;
  }
`;

// Helper to hide MiniNavbar on mobile if you prefer using MobileHeader exclusively
// Or you can keep both. MiniNavbar handles its own responsive layout nicely.
const DesktopNavWrapper = styled.div`
  width: 100%;
  z-index: 40;
  
  @media (max-width: 768px) {
    /* Optional: Hide MiniNavbar on mobile if it conflicts with MobileHeader */
    /* display: none; */ 
  }
`;

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <Container>
      <Toaster position="top-center" />
      
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        closeSidebar={closeSidebar} 
        toggle={toggleSidebar} 
      />
      
      <MainContent>
        
        <DesktopNavWrapper>
           <MiniNavbar />
        </DesktopNavWrapper>

        {/* Mobile Header (Visible only on small screens for Sidebar Toggle) */}
        <MobileHeader>
          <MenuButton onClick={toggleSidebar}>
            <Menu size={28} />
          </MenuButton>
          <h2>{BRAND_NAME}</h2>
          <div style={{ width: 28 }}></div> 
        </MobileHeader>

        {/* Content Area */}
        <ContentWrapper>
          <Suspense fallback={<GlobalLoader />}>
            <Outlet />
          </Suspense>
        </ContentWrapper>

      </MainContent>
    </Container>
  );
};

export default App;