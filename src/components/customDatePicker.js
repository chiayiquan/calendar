import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

export default function CustomDatePicker({ date, setDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date);
  const handleCancel = () => {
    setIsOpen(false);
  };
  const handleOk = () => {
    setDate(selectedDate);
    setIsOpen(false);
  };

  const onAndroidChange = (selectedDate) => {
    setIsOpen(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setDate(moment(selectedDate).format("YYYY-MM-DD"));
    }
  };
  const renderDatePicker = () => {
    return (
      <DateTimePicker
        timeZoneOffsetInMinutes={0}
        mode="date"
        value={new Date(selectedDate)}
        minimumDate={
          new Date(moment().subtract(50, "years").format("YYYY-MM-DD"))
        }
        maximumDate={new Date(moment().add(30, "years").format("YYYY-MM-DD"))}
        onChange={(_, selectedDate) =>
          Platform.OS === "ios"
            ? setSelectedDate(moment(selectedDate).format("YYYY-MM-DD"))
            : onAndroidChange(selectedDate)
        }
      />
    );
  };
  return (
    <TouchableHighlight activeOpacity={0} onPress={() => setIsOpen(true)}>
      <View>
        <Text
          style={{
            paddingVertical: 15,
            paddingHorizontal: 10,
            borderWidth: 1,
          }}
        >
          {moment(date, "YYYY-MM-DD").format("DD-MM-YYYY")}
        </Text>
        {Platform.OS === "android" && isOpen && renderDatePicker()}
        {Platform.OS === "ios" && isOpen && (
          <Modal
            transparent={true}
            animationType="slide"
            visible={isOpen}
            supportedOrientations={["portrait"]}
            onRequestClose={() => setIsOpen(false)}
          >
            <View style={{ flex: 1 }}>
              <TouchableHighlight
                style={{
                  flex: 1,
                  alignItems: "flex-end",
                  flexDirection: "row",
                }}
                activeOpacity={1}
                visible={isOpen}
                onPress={() => setIsOpen(false)}
              >
                <TouchableHighlight
                  underlayColor="#FFFFFF"
                  style={{
                    flex: 1,
                    borderTopColor: "#E9E9E9",
                    borderTopWidth: 1,
                  }}
                  onPress={() => console.log("datepicker clicked")}
                >
                  <View
                    style={{
                      backgroundColor: "#FFFFFF",
                      height: 250,
                      overflow: "hidden",
                    }}
                  >
                    <View style={{ marginTop: 20 }}>{renderDatePicker()}</View>

                    <TouchableHighlight
                      underlayColor="transparent"
                      onPress={handleCancel}
                      style={[styles.btnText, styles.btnCancel]}
                    >
                      <Text>Cancel</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                      underlayColor="transparent"
                      onPress={handleOk}
                      style={[styles.btnText, styles.btnDone]}
                    >
                      <Text>Done</Text>
                    </TouchableHighlight>
                  </View>
                </TouchableHighlight>
              </TouchableHighlight>
            </View>
          </Modal>
        )}
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  btnText: {
    position: "absolute",
    top: 0,
    height: 42,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnCancel: {
    left: 0,
  },
  btnDone: {
    right: 0,
  },
});
