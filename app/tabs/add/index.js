import { StyleSheet, Text, TextInput, View, Pressable, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import db from '../../../firebaseConfig.js';
import { collection, addDoc, updateDoc } from 'firebase/firestore'

const index = () => {
  const [value, setValue] = useState("");
  const [currentCategory, setCurrentCategory] = useState("Other");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [deadlineDate, setDeadlineDate] = useState(new Date());
  const [deadlineTime, setDeadlineTime] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const categories = [
    "Chores",
    "School",
    "Work",
    "Plan",
    "Other",
  ];
  // const suggestions = [
  //   "Lorem ipsum",
  //   "Lorem ipsum",
  // ];

  const handleDate = ({type}, selectedDate) => {
    if (type === "set") {
      setShowDate(!showDate);
      const currentDate = selectedDate;
      setDate(currentDate);
      setDeadlineDate(currentDate.toDateString());
    } else {
      setShowDate(!showDate);
    }
  }

  const handleTime = ({type}, selectedTime) => {
    if (type === "set") {
      setShowTime(!showTime);
      const currentTime = selectedTime;
      setTime(currentTime);
      setDeadlineTime(currentTime.toLocaleTimeString());
    } else {
      setShowTime(!showTime);
    }
  }

  const handleSubmit = async () => {
    try {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
    
      const hours = time.getHours();
      const minutes = time.getMinutes();
      const seconds = 0;

      const dt = new Date(year, month, day, hours, minutes, seconds);
      const ref = await addDoc(collection(db, 'todos'), {
        task: value,
        category: currentCategory,
        status: false,
        deadline: dt,
        ontime: true,
        createdAt: new Date(),
      });
      await updateDoc(ref, {
        id: ref.id
      });
      setValue("");
      setCurrentCategory("Other");
      setDate(new Date());
      setDeadlineDate(new Date());
      setTime(new Date());
      setDeadlineTime(new Date());
      alert('Task added!');
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={(styles.container)}>
        <Text style={(styles.header)}>New task</Text>
        <TextInput value={value} placeholder='Type your task here...' onChangeText={setValue} style={(styles.input)}/>
        <Text style={(styles.label)}>Deadline</Text>
        <Pressable onPress={() => setShowDate(!showDate)}> 
          <TextInput value={deadlineDate} placeholder='Date...' onChangeText={setDeadlineDate} editable={false} style={(styles.input)}/>
        </Pressable>
        {showDate && <DateTimePicker mode="date" display="spinner" value={date} onChange={handleDate} />}
        <Pressable onPress={() => setShowTime(!showTime)}> 
          <TextInput value={deadlineTime} placeholder='Time...' onChangeText={setDeadlineTime} editable={false} style={(styles.input)}/>
        </Pressable>
        {showTime && <DateTimePicker mode="time" display="spinner" value={time} onChange={handleTime} />}
        <Text style={(styles.label)}>Choose a category</Text>
        <View style={(styles.category)}>
        {categories.map((category, id) => (
            <Pressable key={id} style={currentCategory === category ? (styles.activeItem) : (styles.item)} onPress={() => setCurrentCategory(category)}>
              <Text style={(styles.text)}>{category}</Text>
            </Pressable>
          ))}
        </View>
        {/* <Text style={(styles.label)}>Suggestions</Text>
        <View style={(styles.suggestion)}>
          {suggestions.map((suggestion, id) => (
            <Pressable key={id} style={(styles.item)} onPress={() => {setValue(suggestion)}}>
              <Text style={(styles.text)}>{suggestion}</Text>
            </Pressable>
          ))}
        </View> */}
        <Pressable style={(styles.add)} onPress={handleSubmit}>
          <AntDesign name="pluscircleo" size={24} color="black" style={(styles.addIcon)}/>
          <Text style={(styles.addText)}>Add new task</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    margin: 14,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 30,
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
  item: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "lightblue",
  },
  activeItem: {
    padding: 10,
    borderRadius: 10,
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
    marginTop: 50,
  },
  addText: {
    fontSize: 16,
    fontWeight: "bold",
  }
})