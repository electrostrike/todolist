import { Tabs } from "expo-router";
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="tasks" options={{
          tabBarLabel: "Tasks",
          tabBarLabelStyle: ({focused}) => {
            focused ? {color:"#7CB9E8"} : {color:"black"}
          },
          headerShown: false,
          tabBarIcon:({ focused }) => 
          focused? (
            <FontAwesome5 name="tasks" size={24} color="#7CB9E8" />
          ) : (
            <FontAwesome5 name="tasks" size={24} color="black" />
          )
        }}/>
      <Tabs.Screen name="add" options={{
          tabBarLabel: "Add",
          tabBarLabelStyle: ({focused}) => {
            focused ? {color:"#7CB9E8"} : {color:"black"}
          },
          headerShown: false,
          tabBarIcon:({ focused }) => 
          focused? (
            <Feather name="plus-circle" size={24} color="#7CB9E8" />
          ) : (
            <Feather name="plus-circle" size={24} color="black" />
          )
        }}/>
      <Tabs.Screen name="stats" options={{
        tabBarLabel: "Stats",
        tabBarLabelStyle: ({focused}) => {
          focused ? {color:"#7CB9E8"} : {color:"black"}
        },
        headerShown: false,
        tabBarIcon:({focused}) => 
        focused? (
          <Ionicons name="stats-chart" size={24} color="#7CB9E8" />
        ) : (
          <Ionicons name="stats-chart" size={24} color="black" />
        )
      }}/>
    </Tabs>
  );
}