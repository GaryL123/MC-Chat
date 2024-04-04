import { View, Text, FlatList } from 'react-native'
import React from 'react'
import RoomItem from './RoomItem'
import { useRouter } from 'expo-router'

export default function RoomList({ rooms }) {
  const router = useRouter();
  return (
    <View className="flex-1">
      <FlatList
        data={rooms}
        contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
        keyExtractor={item => Math.random()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) =>  
        <RoomItem
          noBorder={index + 1 == rooms.length}
          router={router}
          currentUser={currentUser}
          item={item}
          index={index}
        />}
      /> 
    </View>
  )
}
