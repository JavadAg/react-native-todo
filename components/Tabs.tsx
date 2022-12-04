import { Pressable, Text, useWindowDimensions } from "react-native"
import React from "react"
import { SceneRendererProps, TabBar, TabView } from "react-native-tab-view"
import TodoDetails from "./TodoDetails"
import moment from "moment"
import { GetDates, StorageTodo } from "../App"
import { Todo } from "./CreateModal"

interface IProps {
  routes: GetDates[]
  todos: StorageTodo[]
}

const Tabs: React.FC<IProps> = ({ routes, todos }) => {
  const [index, setIndex] = React.useState(0)

  const layout = useWindowDimensions()

  const renderScene = ({ route }: any) => {
    let todoData: string = ""
    todos.filter((todo) => {
      if (todo[0] === route.key) todoData = todo[1]
    })

    if (todoData.length > 0) return <TodoDetails todoData={todoData} />
  }

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      scrollEnabled
      gap={8}
      tabStyle={{ width: "auto" }}
      indicatorStyle={{ display: "none" }}
      className="bg-gray-900 "
      renderTabBarItem={({ route }) => (
        <Pressable
          onPress={() => {
            props.jumpTo(route.key)
          }}
          className={`${
            route.key === props.navigationState.routes[index].key
              ? "bg-[#FF8468] p-2 rounded-lg text-white py-4 text-center items-center justify-center my-2 ml-2"
              : "bg-gray-700 rounded-lg p-2 text-gray-200 py-4 text-center items-center justify-center my-2 ml-2"
          }`}
        >
          <Text
            className={`${
              route.key === props.navigationState.routes[index].key
                ? "font-bold text-white text-base"
                : " text-gray-200"
            }`}
          >
            {moment(route.title).format("MMM Do")}
          </Text>
        </Pressable>
      )}
    />
  )

  return (
    <TabView
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  )
}

export default Tabs
