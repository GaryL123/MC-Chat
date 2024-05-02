import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';
import { getAuth, onIdTokenChanged } from 'firebase/auth';

// Context Providers
import { AuthContextProvider, useAuth } from './logic/authContext';
import { SettingsContextProvider } from './logic/settingsContext';

// Navigators
import MainTabNavigator from './navigators/MainTabNavigator';
import AuthStackNavigator from './navigators/AuthStackNavigator';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, user => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SettingsContextProvider>
      <MenuProvider>
        <NavigationContainer>
          <AuthContextProvider>
            {currentUser ? <MainTabNavigator /> : <AuthStackNavigator />}
          </AuthContextProvider>
        </NavigationContainer>
      </MenuProvider>
    </SettingsContextProvider>
  );
}

export default App;