import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Protected({ component: Component }: { component: React.ComponentType }) {
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    let timer: NodeJS.Timeout;

    const checkAuth = (user: any) => {
      if (user) {
        console.log('User details:', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
        setAuthState('authenticated');
      } else {
        setAuthState('unauthenticated');
        navigate("/login");
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      timer = setTimeout(() => {
        checkAuth(user);
      }, 2000);
    });

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [navigate]);

  if (authState === 'loading') {
    return <div>Loading...</div>;
  }

  return authState === 'authenticated' ? <Component /> : null;
}