import { SafeAreaView, Text, View } from "react-native"
import React, { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { KeyValuePair } from "@react-native-async-storage/async-storage/lib/typescript/types"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import CreateModal, { Todo } from "./components/CreateModal"
import Tabs from "./components/Tabs"

export interface GetDates {
  key: string
  title: string
}

export interface StorageTodo {
  0: string
  1: string
}

export default function App() {
  const [todos, setTodos] = useState<StorageTodo[]>([])
  const [loading, setLoading] = useState(false)
  const [routes, setRoutes] = useState<GetDates[]>([])
  useEffect(() => {
    getTodos()
  }, [])

  const getTodos = async () => {
    /* await AsyncStorage.clear() */
    setLoading(true)
    let keys = await AsyncStorage.getAllKeys()
    const fetchedTodos = await AsyncStorage.multiGet(keys)
    setTodos(fetchedTodos as unknown as StorageTodo[])
    let getDays: GetDates[] = []
    fetchedTodos.map(
      (todo) => (getDays = [...getDays, { key: todo[0], title: todo[0] }])
    )
    setRoutes(getDays)
    setLoading(false)
  }

  return (
    <SafeAreaView className="flex-1 w-full">
      <GestureHandlerRootView className="relative items-center justify-start flex-1 w-full">
        <View className="items-center justify-center w-full h-16 bg-gray-900 border-b border-gray-800">
          <Text className="w-full ml-5 text-3xl italic font-bold text-slate-200">
            Todo App
          </Text>
        </View>
        <View className="flex-row items-start justify-center flex-1 w-full pt-2 bg-gray-900">
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <View className="w-full ">
              {todos.length > 0 ? (
                <Tabs routes={routes} todos={todos} />
              ) : (
                <Text className="text-xl text-center text-white">
                  No Todo here , Create one
                </Text>
              )}
            </View>
          )}
        </View>
        <CreateModal getTodos={getTodos} />
      </GestureHandlerRootView>
    </SafeAreaView>
  )
}
