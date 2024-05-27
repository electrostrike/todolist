import { StyleSheet, Text, TextInput, View, Pressable } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import db from '../../../firebaseConfig.js';
import { collection, addDoc } from 'firebase/firestore'

const index = () => {
  const [value, setValue] = useState("");
  const [currentCategory, setCurrentCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [deadline, setDeadline] = useState(new Date());
  const [show, setShow] = useState(false);
  const categories = [
    "Chores",
    "School",
    "Work",
    "Plan",
  ];
  const suggestions = [
    "Drink water",
    "Do the chores",
    "Read a book",
  ];

  const handleDate = ({type}, selectedDate) => {
    if (type === "set") {
      setShow(!show);
      const currentDate = selectedDate;
      setDate(currentDate);
      setDeadline(currentDate.toDateString());
    } else {
      setShow(!show);
    }
  }

  const handleSubmit = async () => {
    try {
      const ref = await addDoc(collection(db, 'todos'), {
        task: value,
        category: currentCategory,
        status: false,
        deadline: date,
      });
      setValue("");
      setCurrentCategory("");
      setDate(new Date());
      setDeadline(new Date());
      alert('Task added!');
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <View style={(styles.container)}>
      <Text style={(styles.header)}>New task</Text>
      <TextInput value={value} placeholder='Type your task here...' onChangeText={setValue} style={(styles.input)}/>
      <Text style={(styles.label)}>Deadline</Text>
      <Pressable onPress={() => setShow(!show)}> 
        <TextInput value={deadline} placeholder='Deadline...' onChangeText={setDeadline} editable={false} style={(styles.input)}/>
      </Pressable>
      {show && <DateTimePicker mode="date" display="spinner" value={date} onChange={handleDate} />}
      <Text style={(styles.label)}>Choose a category</Text>
      <View style={(styles.category)}>
      {categories.map((category, id) => (
          <Pressable key={id} style={currentCategory === category ? (styles.activeItem) : (styles.item)} onPress={() => setCurrentCategory(category)}>
            <Text style={(styles.text)}>{category}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={(styles.label)}>Suggestions</Text>
      <View style={(styles.suggestion)}>
        {suggestions.map((suggestion, id) => (
          <Pressable key={id} style={(styles.item)} onPress={() => {setValue(suggestion)}}>
            <Text style={(styles.text)}>{suggestion}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={(styles.add)} onPress={handleSubmit}>
        <AntDesign name="pluscircleo" size={24} color="black" style={(styles.addIcon)}/>
        <Text style={(styles.addText)}>Add new task</Text>
      </Pressable>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    margin: 14,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    backgroundColor: "white",
    flex: 1,
  },
  header: {
    fontSize: 32,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 30,
    fontSize: 16,
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
  },
  category: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  suggestion: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  item: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "lightblue",
  },
  activeItem: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#7CB9E8",
  },
  text: {
    color: "black",
    fontSize: 16,
  },
  add: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    padding: 20,
    borderRadius: 50,
    backgroundColor: "#7CB9E8",
  },
  addText: {
    fontSize: 16,
    fontWeight: "bold",
  }
})