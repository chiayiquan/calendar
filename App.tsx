import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  AppRegistry,
  StyleSheet,
  SafeAreaView,
  Button,
} from "react-native";
import Checkbox from "@react-native-community/checkbox";
import { StatusBar } from "expo-status-bar";
import { expo } from "./app.json";
import {
  Calendar,
  CalendarProvider,
  ExpandableCalendar,
} from "react-native-calendars";
import moment from "moment";
import { AntDesign } from "@expo/vector-icons";

export default function App() {
  const today = moment().format("YYYY-MM-DD");
  const [selectedData, setSelectedData] = useState([]);
  const [markedDate, setMarkedDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(today);
  const [data, setData] = useState([]);
  const defaultMarkedValue = {
    selected: true,
    selectedColor: "#00adf5",
  };

  useEffect(() => {
    // here should call api to get data from db and set the data
    const randomData = [
      {
        date: moment().format("YYYY-MM-DD"),
        isCompleted: true,
        name: "Running",
        id: "1",
        color: "red",
      },
      {
        date: moment().format("YYYY-MM-DD"),
        isCompleted: false,
        name: "Shopping",
        id: "2",
        color: "yellow",
      },
      {
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        isCompleted: false,
        name: "Play game",
        id: "3",
        color: "black",
      },
      {
        date: moment().add(1, "day").format("YYYY-MM-DD"),
        isCompleted: false,
        name: "Running",
        id: "4",
        color: "green",
      },
      {
        date: moment().add(10, "day").format("YYYY-MM-DD"),
        isCompleted: false,
        name: "Running",
        id: "5",
        color: "blue",
      },
    ];
    const markData = randomData.reduce((accumulator, currentValue) => {
      const key = currentValue.date;

      return {
        ...accumulator,
        [currentValue.date]: {
          ...(accumulator[currentValue.date] || {
            ...defaultMarkedValue,
            selected: selectedDate === currentValue.date,
          }),
          dots: [
            ...(accumulator[key]?.dots || []),
            { color: currentValue.color, key: currentValue.id },
          ],
        },
      };
    }, {});
    setData(randomData);
    setMarkedDate(markData);
    return setSelectedData(randomData.filter((entry) => entry.date === today));
  }, []);

  const getDataByDate = (day) => {
    const filteredData = data.filter((entry) => entry.date === day.dateString);
    setMarkedDate((state) => ({
      ...state,
      [selectedDate]: {
        ...state[selectedDate],
        selected: false,
      },
      [day.dateString]: {
        ...(state[day.dateString] || defaultMarkedValue),
        selected: true,
        dots: [...(state[day.dateString]?.dots || [])],
      },
    }));
    setSelectedDate(day.dateString);
    return setSelectedData(filteredData);
  };

  const checkboxOnChange = (id, value) => {
    setData((state) =>
      state.map((entry) =>
        entry.id === id ? { ...entry, isCompleted: value } : entry
      )
    );
    return setSelectedData((state) =>
      state.map((entry) =>
        entry.id === id ? { ...entry, isCompleted: value } : entry
      )
    );
  };

  const handleDelete = (id) => {
    const markData = data.reduce((accumulator, currentValue) => {
      const key = currentValue.date;

      if (currentValue.id === id) {
        return accumulator;
      }
      return {
        ...accumulator,
        [currentValue.date]: {
          ...(accumulator[currentValue.date] || {
            ...defaultMarkedValue,
            selected: selectedDate === currentValue.date,
          }),
          dots: [
            ...(accumulator[key]?.dots || []),
            { color: currentValue.color, key: currentValue.id },
          ],
        },
      };
    }, {});
    setMarkedDate(markData);
    setData((state) => state.filter((entry) => entry.id !== id));
    return setSelectedData((state) => state.filter((entry) => entry.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" /> */}

      {
        // https://bestofreactjs.com/repo/wix-react-native-calendars-react-react-native-awesome-components
      }
      <Calendar
        // Initially visible month. Default = Date()
        current={today}
        // Handler which gets executed on day press. Default = undefined
        onDayPress={getDataByDate}
        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
        monthFormat={"yyyy MM"}
        // Do not show days of other months in month page. Default = false
        hideExtraDays={true}
        // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
        // day from another month that is visible in calendar page. Default = false
        disableMonthChange={true}
        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
        firstDay={1}
        // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
        disableAllTouchEventsForDisabledDays={true}
        // Enable the option to swipe between months. Default = false
        enableSwipeMonths={true}
        markedDates={markedDate}
        markingType={"multi-dot"}
      />
      {/* <CalendarProvider>
        <ExpandableCalendar
          current={today}
          onDayPress={getDataByDate}
          firstDay={1}
          disablePan={true} //we need this
          disableWeekScroll={true}
          disableMonthChange={true}
        />
      </CalendarProvider> */}
      <View
        style={{
          flex: 1,
          alignContent: "flex-end",
        }}
      >
        <Text>Activities:</Text>
        {selectedData.length > 0 &&
          selectedData.map((activity) => {
            return (
              <View key={activity.id} style={styles.rowContainer}>
                <Checkbox
                  value={activity.isCompleted}
                  onValueChange={(value) =>
                    checkboxOnChange(activity.id, value)
                  }
                />
                <View style={styles.rowContainer}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: activity.color,
                    }}
                  />
                  <Text>{activity.name}</Text>
                </View>
                <AntDesign.Button
                  name="delete"
                  size={24}
                  color="black"
                  backgroundColor="transparent"
                  onPress={() => handleDelete(activity.id)}
                />
              </View>
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  rowContainer: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});

AppRegistry.registerComponent(expo.name, () => App);
