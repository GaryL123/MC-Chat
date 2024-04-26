import React from 'react';
import ProfileButton from '../components/ProfileButton'; // Adjust the path as necessary

export const HeaderScreenOptions = {
  tabBarActiveTintColor: "white",
  tabBarInactiveTintColor: "lightgray",
  tabBarStyle: {
    backgroundColor: '#166939',
    height: 100,
  },
  headerStyle: {
    backgroundColor: '#166939',
    height: 120,
    shadowOpacity: 0,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  headerRight: () => (
    <ProfileButton />
  ),
};
