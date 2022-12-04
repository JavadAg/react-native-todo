import moment from "moment"
import React, { useCallback, useState } from "react"
import {
  FlatList,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View
} from "react-native"
import Icon from "react-native-vector-icons/Octicons"
import SwipeableItem, {
  useSwipeableItemParams
} from "react-native-swipeable-item"
import AsyncStorage from "@react-native-async-storage/async-storage"

const TodoDetails = ({ todoData }: any) => {
  const [parsedData, setParsedData] = useState(JSON.parse(todoData))

  const renderItemList: ListRenderItem<any> = useCallback(({ item }) => {
    return (
      <SwipeableItem
        key={item.key}
        item={item}
        renderUnderlayLeft={() => <UnderlayLeft item={item} />}
        renderUnderlayRight={() => <UnderlayRight item={item} />}
        snapPointsLeft={[60]}
        snapPointsRight={[60]}
      >
        <View
          className={`${
            item.status === "completed" ? "bg-green-700" : "bg-gray-700"
          } flex items-center justify-center w-full p-3 mb-2 rounded-xl`}
        >
          <Text className="self-end text-gray-400">
            {moment(item.date).format("DD-MM-YYYY HH:mm:ss").split(" ")[1]}
          </Text>
          <Text className="w-full pb-2 text-lg font-bold text-center text-gray-300 rounded-lg">
            {item.name}
          </Text>
          {item.description && (
            <Text className="w-full pb-3 text-base text-center text-gray-400 rounded-lg">
              {item.description}
            </Text>
          )}
        </View>
      </SwipeableItem>
    )
  }, [])

  const UnderlayLeft = ({ item }: any) => {
    const deleteTodo = async () => {
      const selectedDate = moment(item.date).format("YYYY-MM-DD")
      const todos = await AsyncStorage.getItem(selectedDate)
      const parsedTodo = JSON.parse(todos!)

      const filteredData = parsedTodo.filter(
        (todo: any) => todo.key !== item.key
      )
      const stringifiedData = JSON.stringify(filteredData)
      await AsyncStorage.setItem(selectedDate, stringifiedData)
      setParsedData(filteredData)
      close()
    }
    const { close } = useSwipeableItemParams()

    return (
      <View className="flex-row items-center justify-end flex-1 mb-2 bg-red-400 rounded-xl">
        <TouchableOpacity onPress={() => deleteTodo()} className="p-5">
          <Text>
            <Icon name="trash" size={22} color="#fff" />
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const UnderlayRight = ({ item }: any) => {
    const handleStatus = async () => {
      const selectedDate = moment(item.date).format("YYYY-MM-DD")
      const todos = await AsyncStorage.getItem(selectedDate)
      const parsedTodo = JSON.parse(todos!)

      for (const obj of parsedTodo) {
        if (obj.key === item.key) {
          obj.status =
            obj.status === "notCompleted" ? "completed" : "notCompleted"
          break
        }
      }

      const stringifiedData = JSON.stringify(parsedTodo)
      await AsyncStorage.setItem(selectedDate, stringifiedData)
      setParsedData(parsedTodo)
      close()
    }
    const { close } = useSwipeableItemParams()

    return (
      <View className="flex-row items-center justify-start flex-1 mb-2 bg-green-400 rounded-xl">
        <TouchableOpacity onPress={() => handleStatus()} className="p-5">
          <Text>
            {item.status === "notCompleted" ? (
              <Icon name="check-circle" size={22} color="#fff" />
            ) : (
              <Icon name="circle-slash" size={22} color="#fff" />
            )}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex-1 px-2 mt-5 space-y-2">
      <Text className="italic text-gray-600">
        Swipe left or right to manage Todo
      </Text>
      <FlatList
        className="w-full mb-24 bg-gray-900 rounded-2xl"
        data={parsedData.sort(
          (a: any, b: any) => new Date(a.date) - new Date(b.date)
        )}
        keyExtractor={(item) => item.key}
        renderItem={renderItemList}
      />
    </View>
  )
}

export default TodoDetails
