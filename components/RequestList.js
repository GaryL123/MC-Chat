import { View, Text, FlatList } from 'react-native'
import React from 'react'
import RequestItem from './RequestItem'
import { useRouter } from 'expo-router'

export default function RequestList({ users, currentUser }) {
  const router = useRouter();
  return (
    <View className="flex-1">
      <FlatList
        data={users}
        contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
        keyExtractor={item => item.email.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => <RequestItem
          noBorder={index + 1 == users.length}
          router={router}
          currentUser={currentUser}
          item={item}
          index={index}
        />}
      />
    </View>
  )
}
