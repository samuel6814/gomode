import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import styled from 'styled-components';
import { useSession } from '../../api/authClient'; // Adjust path if needed
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const FullScreenLoader = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  background: #FFFFFF;
  color: #111827;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  
  span {
    margin-top: 1rem;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
`;

const AuthCallback = () => {
  const navigate = useNavigate();
  // Grab the session data directly from better-auth
  const { data: session, isPending } = useSession(); 

  useEffect(() => {
    // Only run the routing logic once the session has finished loading
    if (!isPending) {
      if (session?.user) {
        const userRole = session.user.role?.toUpperCase();
        
        // --- THE MAGIC ROLE CHECK ---
        if (userRole === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        // If they somehow got here without a session, send them back to login
        navigate('/login', { replace: true });
      }
    }
  }, [session, isPending, navigate]);

  return (
    <div style={{padding: '2rem', width: '100%'}}><Skeleton count={1} height={200} borderRadius={12} style={{marginBottom: '2rem'}}/><Skeleton count={3} height={40} style={{marginBottom: '1rem'}}/></div>
  );
};

export default AuthCallback;