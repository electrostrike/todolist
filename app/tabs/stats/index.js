import { Dimensions, StyleSheet, Text, View, Pressable } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import React, { useState, useEffect } from 'react';
import db from '../../../firebaseConfig.js';
import { collection, query, onSnapshot } from 'firebase/firestore';
import moment from 'moment'
import { clearLogEntriesAsync } from 'expo-updates';

const Index = () => {
  const [toDos, setToDos] = useState([]);
  const [dateRange, setDateRange] = useState("All time");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      colors: [],
    }]
  });
  const ranges = [
    "All time",
    "Last 30 days",
    "Last 7 days",
  ]

  useEffect(() => {
    setToDos([]);
    const q = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const arr = [];
      querySnapshot.forEach((doc) => {
        arr.push({ ...doc.data(), id: doc.id });
      });
      setToDos(arr);
    }, (error) => {
      console.log(error);
    });

    return () => unsubscribe();
  }, [dateRange]);

  useEffect(() => {
    let toDoList = toDos;

    if (toDoList.length === 0) return;
    
    if (dateRange === "Last 30 days") {
      toDoList = toDoList.filter((toDo) => {
        const date1 = new Date(toDo.createdAt.toDate());
        const date2 = new Date();
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays <= 30;
      })
    }
    if (dateRange === "Last 7 days") {
      toDoList = toDoList.filter((toDo) => {
        const date1 = new Date(toDo.createdAt.toDate());
        const date2 = new Date();
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays <= 7; 
      })
    }

    const due = toDoList.filter((toDo) => toDo.status === false && moment().isBefore(toDo.deadline.toDate())).length;
    const late = toDoList.filter((toDo) => toDo.status === false && moment().isAfter(toDo.deadline.toDate())).length;
    const completed = toDoList.filter((toDo) => toDo.status === true && toDo.ontime === true).length;
    const completedLate = toDoList.filter((toDo) => toDo.status === true && toDo.ontime === false).length;

    const newChartData = {
      labels: ["Due", "Late", "Completed", "C. Late"],
      datasets: [
        {
          data: [due, late, completed, completedLate],
          colors: [ 
            (opacity = 1) => "#00b4d8",
            (opacity = 1) => "#f94449",
            (opacity = 1) => "#9be931",
            (opacity = 1) => "#b4b4b4",
          ]
        }
      ]
    };

    setChartData(newChartData);
  }, [toDos]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Statistics</Text>
      {chartData && chartData.datasets[0].data.length > 0 ? (
        <BarChart
          data={chartData}
          width={Dimensions.get('window').width - 50}
          height={300}
          fromZero={true}
          withCustomBarColorFromData={true}
          flatColor={true}
          showBarTops={false}
          showValuesOnTopOfBars={true}
          withInnerLines={false}
          decimalPlaces
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            barRadius: 12,
            barPercentage: 0.66,
            decimalPlaces: 1,
            propsForLabels: {
              paddingTop: 10,
              fontSize: 12,
            },
            formatYLabel: (yValue = 10) => `${yValue}`,
            style:{
              borderRadius: 16,
            } 
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            boxShadow: 5,
          }}
        />
      ) : (
        <Text>No data available</Text>
      )}
      <Text style={(styles.label)}>Filter by created date</Text>
      <View style={(styles.timeRange)}>
        {ranges.map((range, id) => (
            <Pressable key={id} style={dateRange === range ? (styles.activeItem) : (styles.item)} onPress={() => setDateRange(range)}>
              <Text style={(styles.text)}>{range}</Text>
            </Pressable>
          ))}
        </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    margin: 14,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 30,
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
  },
  header: {
    fontSize: 32,
    textAlign: "center",
    fontWeight: "bold",
  },
  timeRange: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
  }
});