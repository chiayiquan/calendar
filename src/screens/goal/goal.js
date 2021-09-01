import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import Checkbox from "@react-native-community/checkbox";
import { StatusBar } from "expo-status-bar";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import * as Styles from "../../components/styles";
import { CredentialsContext } from "../../components/credentialsContext";
import IconButton from "../../components/iconButton";
import { Swipeable } from "react-native-gesture-handler";
import axios from "axios";
import ApiRoutes from "../../routes/api";
import Popup from "./popup";
import { showMessage } from "react-native-flash-message";
import Button, { colorScheme } from "../../components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Goal() {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);
  const { width } = Dimensions.get("window");
  const today = moment().format("YYYY-MM-DD");
  const [selectedData, setSelectedData] = useState([]);
  const [markedDate, setMarkedDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(today);
  const [data, setData] = useState([]);
  const defaultMarkedValue = {
    selected: true,
    selectedColor: "#00adf5",
  };
  const [openPopup, setOpenPopup] = useState(false);
  const apiHeader =
    storedCredentials != null
      ? { Authorization: `Bearer ${storedCredentials.jwt}` }
      : {};
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState({});
  const [createError, setCreateError] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    // here should call api to get data from db and set the data
    const fetchData = async () => {
      try {
        const response = await axios.get(ApiRoutes.listGoal, {
          headers: apiHeader,
        });
        const cleanedData = response.data.data.map((entry) => ({
          id: entry.id,
          date: moment(entry.date).format("YYYY-MM-DD"),
          color: entry.color,
          isCompleted: entry.isCompleted,
          name: entry.name,
          userId: entry.userId,
        }));
        return setData(cleanedData);
      } catch (error) {
        return showMessage({
          message: error.response.data.message,
          type: "error",
          duration: 3000,
          floating: true,
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const markData = data.reduce(
      (accumulator, currentValue) => {
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
      },
      { [selectedDate]: { ...defaultMarkedValue } }
    );
    setMarkedDate(markData);
    return setSelectedData(data.filter((entry) => entry.date === selectedDate));
  }, [data]);

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

  const handleAdd = async (data) => {
    try {
      setCreateError(null);
      const response = await axios.post(ApiRoutes.addGoal, data, {
        headers: apiHeader,
      });
      const responseData = response.data.data;
      setData((state) => [...state, responseData]);
      setIsLoading(false);
      setOpenPopup(false);
      return showMessage({
        message: "Goal has been added.",
        type: "success",
        duration: 3000,
        floating: true,
      });
    } catch (error) {
      return setCreateError(error.response.data.message);
    }
  };

  const handleUpdate = async (data) => {
    try {
      setUpdateError(null);
      const response = await axios.post(ApiRoutes.updateGoal, data, {
        headers: apiHeader,
      });
      const responseData = response.data.data;
      setData((state) => {
        const removeOldData = state.filter(
          (goal) => goal.id !== responseData.id
        );
        return [...removeOldData, responseData];
      });
      setIsLoading(false);
      setEditData({});
      setOpenPopup(false);
      return showMessage({
        message: "Goal has been updated.",
        type: "success",
        duration: 3000,
        floating: true,
      });
    } catch (error) {
      return setUpdateError(error.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(
        `${ApiRoutes.deleteGoal}/${id}`,
        {},
        {
          headers: apiHeader,
        }
      );
      const responseData = response.data.data;
      setData((state) => state.filter((entry) => entry.id !== responseData));
      return showMessage({
        message: "Goal has been deleted.",
        type: "success",
        duration: 3000,
        floating: true,
      });
    } catch (error) {
      return showMessage({
        message: error.response.data.message,
        type: "error",
        duration: 3000,
        floating: true,
      });
    }
  };

  const leftActions = (dragX, goal) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });
    return (
      <View style={styles.deleteContainer}>
        <IconButton
          iconName="delete"
          onPress={() => showDeletePrompt(goal.id)}
          style={{ transform: [{ scale }] }}
          size={48}
        />
      </View>
    );
  };

  const rightActions = (dragX, goal) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <View style={styles.editContainer}>
        <IconButton
          iconName="edit"
          style={{ transform: [{ scale }] }}
          size={48}
          onPress={() => {
            setEditData(goal);
            return setOpenPopup(true);
          }}
        />
      </View>
    );
  };

  const handlePopup = () => {
    return setOpenPopup((state) => !state);
  };

  const showDeletePrompt = (id) => {
    Alert.alert("Delete Goal", "Do you want to delete this goal?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "OK", onPress: () => handleDelete(id) },
    ]);
  };

  const logout = () => {
    AsyncStorage.removeItem("goalSetting")
      .then(() => {
        setStoredCredentials(null);
      })
      .catch((error) => console.log(error));
  };
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Button
          label="Logout"
          color={colorScheme.transparent}
          textStyle={{ color: "black", fontSize: 13 }}
          buttonStyle={{ width: 120 }}
          onPress={logout}
        />
      </View>

      <Popup
        isOpen={openPopup}
        onClose={handlePopup}
        onCreate={handleAdd}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        goal={editData}
        onUpdate={handleUpdate}
        error={createError || updateError}
      />
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
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Goals:</Text>
        <IconButton iconName="pluscircleo" size={24} onPress={handlePopup} />
      </View>
      <ScrollView
        style={{
          flex: 1,
          alignContent: "flex-end",
        }}
      >
        {selectedData.length > 0 &&
          selectedData.map((activity) => {
            return (
              <Swipeable
                renderLeftActions={(_, dragX) => leftActions(dragX, activity)}
                renderRightActions={(_, dragX) => rightActions(dragX, activity)}
                key={activity.id}
              >
                <View style={styles.rowContainer}>
                  <Checkbox
                    value={activity.isCompleted}
                    disabled={true}
                    tintColors={true}
                  />
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: activity.color,
                      }}
                    />
                    <Text style={{ width: width - 140, marginLeft: 10 }}>
                      {activity.name}
                    </Text>
                  </View>
                </View>
              </Swipeable>
            );
          })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Styles.StatusBarHeight,
    backgroundColor: "#FFFFFF",
  },
  content: Styles.contentContainer,
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    borderColor: "#e6e6e6",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  deleteContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  editContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});
