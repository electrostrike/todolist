import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { AntDesign } from '@expo/vector-icons';
import db from '../../../firebaseConfig.js'
import { collection, query, where, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore'
import moment from 'moment'

const index = () => {
  const [toDos, setToDos] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("All");
  const categories = [
    "All",
    "Chores",
    "School",
    "Work",
    "Plan",
    "Other",
  ];

  useEffect(() => {
    let q;
    if (currentCategory === "All") {
      q = query(collection(db, "todos"), where("status", "==", false));
    } else {
      q = query(collection(db, "todos"), where("status", "==", false), where("category", "==", currentCategory));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const arr = [];
      querySnapshot.forEach((doc) => {
        arr.push({ ...doc.data(), id: doc.id });
      });
      setToDos(arr);
    }, (error) => {
      console.log(error);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [currentCategory]);

  const handleStatus = async (toDo) => {
    try {
      const todoRef = doc(db, "todos", toDo.id);
      await updateDoc(todoRef, {
        status: true,
      });
      if (moment().isAfter(toDo.deadline.toDate())) {
        await updateDoc(todoRef, {
          ontime: false,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (toDo) => {
    try {
      await deleteDoc(doc(db, "todos", toDo.id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <View style={(styles.navBar)}>
      {categories.map((category, id) => (
          <Pressable key={id} style={currentCategory === category ? (styles.navActiveItem) : (styles.navItem)} onPress={() => setCurrentCategory(category)}>
            <Text style={(styles.navText)}>{category}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={(styles.content)}>
        <View style={(styles.toDo)}>
          {toDos?.length ? (
            <View style={(styles.tasks)}>
              <Text style={(styles.textDue)}>Due tasks</Text>
              {toDos.filter((toDo) => {
                return moment().isBefore(toDo.deadline.toDate());
              }).map((toDo, id) => (
                <View style={(styles.toDoItem)} key={id}>
                  <View>
                    <Text style={(styles.toDoText)}>
                      {"(" + toDo.category + ") " + toDo.task}
                    </Text>
                    <Text style={(styles.toDoDeadline)}>
                      {moment(toDo.deadline.toDate()).from(moment())}
                    </Text>
                  </View>
                  <View style={styles.icon}>
                    <AntDesign onPress={() => handleStatus(toDo)} name="checkcircle" size={36} color="black" />
                    <AntDesign onPress={() => handleDelete(toDo)} name="closecircle" size={36} color="black" />
                  </View>
                </View>
              ))}
              <Text style={(styles.textLate)}>Late tasks</Text>
              {toDos.filter((toDo) => {
                return moment().isAfter(toDo.deadline.toDate());
              }).map((toDo, id) => (
                <View style={(styles.toDoItemLate)} key={id}>
                  <View>
                    <Text style={(styles.toDoText)}>
                      {"(" + toDo.category + ") " + toDo.task}
                    </Text>
                    <Text style={(styles.toDoDeadline)}>
                      {moment(toDo.deadline.toDate()).from(moment())}
                    </Text>
                  </View>
                  <View style={styles.icon}>
                    <AntDesign onPress={() => handleStatus(toDo)} name="checkcircle" size={36} color="black" />
                    <AntDesign onPress={() => handleDelete(toDo)} name="closecircle" size={36} color="black" />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={(styles.empty)}>
              <Image style={(styles.image)} source={require("../../../assets/empty.png")}/>
              <Text style={(styles.text)}>Congratulations!</Text>
              <Text style={(styles.text)}>You have no tasks left</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  )
}

export default index

const styles = StyleSheet.create({
  navBar: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navItem: {
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },  
  navActiveItem: {
    backgroundColor: "#7CB9E8",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    color: "black",
    textAlign: "center",
    fontSize: 16,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    margin: 15,
    marginTop: 0,
  },
  toDo: {
    padding: 10,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 100,
  },
  image: {
    width: 300,
    height: 300,
  },
  text: {
    fontWeight: "bold",
    fontSize: 24,
  },
  textDue: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#00b4d8",
  },
  textLate: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#f94449",
  },
  tasks: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  toDoItem: {
    backgroundColor: "#00b4d8",
    padding: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  toDoItemLate: {
    backgroundColor: "#f94449",
    padding: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  toDoText: {
    color: "black",
    fontSize: 22,
    maxWidth: 200,
  },
  toDoDeadline: {
    color: "black",
    fontSize: 16,
  },
  icon: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
})