import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import db from '../../../firebaseConfig.js';
import { collection, getDocs, where } from 'firebase/firestore'

const index = () => {
  const [toDos, setToDos] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("All");
  const categories = [
    "All",
    "Chores",
    "School",
    "Work",
    "Plan",
  ];

  /*const getToDos = async () => {
    setToDos([]);
    const arr = [];
    try {
      if (currentCategory === "All") {
        const ref = await getDocs(collection(db, "todos"), where("status", "==", false));
        ref.forEach((doc) => {
          //console.log(doc.data());
          arr.push(doc.data());
        })
      } else {
        const ref = await getDocs(collection(db, "todos"), where("status", "==", false), where("category", "==", currentCategory));
        ref.forEach((doc) => {
          //console.log(doc.data());
          arr.push(doc.data());
        })
      }
      setToDos(arr);
    } catch(err) {
      console.log(err);
    } 
  };

  // bug filter
  useEffect(() => {
    getToDos();
    console.log(toDos);
  }, [currentCategory]);*/

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
            <View style={(styles.tasks)}></View>
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
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },  
  navActiveItem: {
    backgroundColor: "#7CB9E8",
    padding: 12,
    borderRadius: 12,
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
})