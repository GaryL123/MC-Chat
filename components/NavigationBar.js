import React from 'react';
import { Tabs } from 'expo-router';

function NavigationBar() {
  return (
    <Tabs>
      <Tabs.Screen name="home"
        //component={chatsIndividual}
      />
      <Tabs.Screen name="chatsRooms"
        //component={ProfileScreen}
      />
    </Tabs>
  );
}

export default NavigationBar;
