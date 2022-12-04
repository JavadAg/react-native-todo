import React, { useState } from "react"
import { Text, Pressable, View, TextInput, Button } from "react-native"
import Icon from "react-native-vector-icons/Octicons"
import { LinearGradient } from "expo-linear-gradient"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ZoomIn,
  ZoomOut
} from "react-native-reanimated"
import AsyncStorage from "@react-native-async-storage/async-storage"
import uuid from "react-native-uuid"
import {
  DateTimePickerAndroid,
  DateTimePickerEvent
} from "@react-native-community/datetimepicker"
import moment from "moment"

export interface Todo {
  key?: string
  name?: string
  description?: string
  status?: string
  date?: Date
}

type AndroidMode = "date" | "time"

interface IProps {
  getTodos: () => void
}
const CreateModal: React.FC<IProps> = ({ getTodos }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [error, setError] = useState("")
  const [todo, setTodo] = useState<Todo>({
    key: "",
    name: "",
    description: "",
    status: "notCompleted",
    date: new Date()
  })

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate
    setTodo((current) => ({ ...current, date: currentDate }))
  }

  const showMode = (currentMode: AndroidMode) => {
    DateTimePickerAndroid.open({
      minimumDate: new Date(),
      value: todo.date!,
      onChange,
      mode: currentMode,
      is24Hour: true
    })
  }

  const showDatepicker = () => {
    showMode("date")
  }

  const showTimepicker = () => {
    showMode("time")
  }

  const handleAddTodo = async () => {
    try {
      if (todo.name?.length! > 0 && todo.description?.length! <= 70) {
        todo.key = uuid.v4() as string
        const selectedDate = moment(todo.date).format("YYYY-MM-DD")

        if (await AsyncStorage.getItem(selectedDate)) {
          let storageItem = await AsyncStorage.getItem(selectedDate)

          let JSONValue = JSON.parse(storageItem!)

          let newValues = [...JSONValue, todo]

          let stringifiedItem = JSON.stringify(newValues)

          await AsyncStorage.setItem(selectedDate, stringifiedItem)
        } else {
          let stringifiedItem = JSON.stringify([todo])
          await AsyncStorage.setItem(selectedDate, stringifiedItem)
        }

        await getTodos()
        setTodo({
          name: "",
          description: "",
          status: "notCompleted",
          date: new Date()
        })
        setModalVisible(false)
      } else {
        setError("no name entered or description more than 50 word")
      }
    } catch (error) {}
  }

  const rotateVal = useSharedValue(0)

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateVal.value}deg` }]
    }
  })
  const handleModal = () => {
    setModalVisible((current) => !current)
    if (rotateVal.value === 0) {
      rotateVal.value = withTiming(45, { duration: 300 })
    } else {
      rotateVal.value = withTiming(0, { duration: 300 })
    }
  }

  return (
    <>
      {modalVisible ? (
        <Animated.View
          entering={ZoomIn.duration(300)}
          exiting={ZoomOut.duration(300)}
          className={`flex-1 absolute inset-0 justify-center items-center mt-10 bg-gray-700/80`}
          style={{ elevation: 1, zIndex: 1 }}
        >
          <View className="relative flex items-center justify-start w-9/12 px-10 py-4 space-y-2 bg-gray-900 rounded-3xl">
            <Text className="text-lg font-bold text-white">Create a Task</Text>
            <TextInput
              value={todo.name}
              placeholderTextColor="#5C5C5B"
              maxLength={20}
              className="w-full p-2 text-gray-300 border border-gray-300 rounded-2xl"
              placeholder="input name"
              onChangeText={(text) =>
                setTodo((current) => ({ ...current, name: text }))
              }
            />
            <TextInput
              maxLength={70}
              placeholderTextColor="#5C5C5B"
              value={todo.description}
              className="w-full p-2 text-gray-200 border border-gray-300 rounded-2xl"
              placeholder="input description"
              onChangeText={(text) =>
                setTodo((current) => ({ ...current, description: text }))
              }
            />
            <Pressable
              className={`rounded-2xl justify-center flex-1 w-full items-center py-5`}
              onPress={showDatepicker}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={["#FF8468", "#fc7151"]}
                className="relative items-center justify-center w-full h-full py-5 rounded-2xl"
              >
                <Text className="absolute text-base font-bold text-white">
                  Pick Date
                </Text>
              </LinearGradient>
            </Pressable>
            <Pressable
              className={`rounded-2xl justify-center flex-1 w-full items-center py-5`}
              onPress={showTimepicker}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={["#FF8468", "#fc7151"]}
                className="relative items-center justify-center w-full h-full py-5 rounded-2xl"
              >
                <Text className="absolute text-base font-bold text-white">
                  Pick Time
                </Text>
              </LinearGradient>
            </Pressable>
            <Text className="font-bold text-gray-400">
              Selected: {todo.date!.toLocaleString()}
            </Text>
            <Pressable
              disabled={todo.name?.length! < 5}
              onPress={() => handleAddTodo()}
              className={`rounded-2xl justify-center flex-1 w-full bg-red-200 items-center py-5`}
            >
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={["#FF8468", "#fc7151"]}
                className="relative items-center justify-center w-full h-full py-5 rounded-2xl"
              >
                <Text className="absolute text-base font-bold text-white">
                  Add
                </Text>
              </LinearGradient>
            </Pressable>
            {error.length > 0 ? (
              <Text className="text-red-500">{error}</Text>
            ) : (
              ""
            )}
          </View>
        </Animated.View>
      ) : (
        ""
      )}

      <Pressable
        className={`absolute bottom-5 right-4 rounded-full z-40`}
        onPress={handleModal}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["#FF8468", "#fc7151"]}
          className="flex-1 w-full h-full p-4 px-5 rounded-full"
        >
          <Animated.View style={animatedStyles}>
            <Icon name="plus" size={30} color="#fff" />
          </Animated.View>
        </LinearGradient>
      </Pressable>
    </>
  )
}

export default CreateModal
