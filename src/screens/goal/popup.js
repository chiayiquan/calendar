import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, Switch } from "react-native";
import Input from "../../components/input";
import Button from "../../components/button";
import IconButton from "../../components/iconButton";
import * as Regex from "../../components/regex";
import moment from "moment";
// https://jonasjacek.github.io/colors/data.json
import colorData from "../../assets/color.json";
import { Picker } from "@react-native-picker/picker";
import CustomDatePicker from "../../components/customDatePicker";
import Error from "../../components/error";

export default function Popup({
  isOpen = false,
  onClose,
  goal,
  onCreate,
  isLoading,
  setIsLoading,
  onUpdate,
  error,
}) {
  const [formData, setFormData] = useState({
    id: goal.id || "",
    date: {
      value: goal.date || moment().format("YYYY-MM-DD"),
      isError: false,
    },
    color: {
      value: goal.color || "#0000ff",
      isError: false,
    },
    isCompleted: {
      value: goal.isCompleted || false,
      isError: false,
    },
    name: {
      value: goal.name || "",
      isError: false,
    },
    userId: goal.userId || "",
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (Object.keys(goal).length > 0) setIsEdit(true);
    setFormData({
      id: goal.id || "",
      date: {
        value: goal.date || moment().format("YYYY-MM-DD"),
        isError: false,
      },
      color: {
        value: goal.color || "#0000ff",
        isError: false,
      },
      isCompleted: {
        value: goal.isCompleted || false,
        isError: false,
      },
      name: {
        value: goal.name || "",
        isError: false,
      },
      userId: goal.userId || "",
    });
  }, [goal]);

  const isDisabled = formData.name.value.trim().length === 0 || false;
  const onValueChange = (type) => (value) => {
    return setFormData((state) => ({
      ...state,
      [type]: { value, isError: false },
    }));
  };

  const onBlur = (type) => {
    switch (type) {
      case "name":
        if (formData.name.value.trim().length === 0) {
          return setFormData((state) => ({
            ...state,
            name: { ...state.name, isError: true },
          }));
        }
        break;
      default:
        break;
    }
  };

  const create = () => {
    if (Regex.checkValidColor(formData.color.value) === false) {
      return setFormData((state) => ({
        ...state,
        color: { ...state.color, isError: true },
      }));
    }
    if (formData.name.value.trim().length === 0) {
      return setFormData((state) => ({
        ...state,
        name: { ...state.name, isError: true },
      }));
    }
    if (moment(formData.date, "YYYY-MM-DD", true).isValid()) {
      return setFormData((state) => ({
        ...state,
        date: { ...state.name, isError: true },
      }));
    }
    setIsLoading(true);
    if (isEdit) {
      return onUpdate({
        id: formData.id,
        name: formData.name.value,
        date: moment(formData.date.value).format("YYYY-MM-DD"),
        color: formData.color.value,
        isCompleted: formData.isCompleted.value,
        userId: formData.userId,
      });
    } else {
      return onCreate({
        name: formData.name.value,
        date: moment(formData.date.value).format("YYYY-MM-DD"),
        color: formData.color.value,
        isCompleted: formData.isCompleted.value,
      });
    }
  };
  return (
    <Modal visible={isOpen} animationType="slide">
      <View>
        <View style={styles.closeIcon}>
          <Text style={styles.header}>Add Goal</Text>
          <IconButton iconName="close" onPress={onClose} />
        </View>

        <Input
          label="Goal Name"
          inputValue={formData.name.value}
          inputOnChange={onValueChange("name")}
          leftIconName="note"
          onBlur={() => onBlur("name")}
          isError={formData.name.isError}
          errorLabel="Name cannot be empty."
        />

        <View style={styles.fieldContainer}>
          <Text style={{ fontSize: 13 }}>Color:</Text>
          <View>
            <View
              style={{
                width: 20,
                height: 20,
                backgroundColor: formData.color.value,
                left: 15,
                top: 10,
                position: "absolute",
                zIndex: 1,
              }}
            />
            <View style={{ borderWidth: 1 }}>
              <Picker
                selectedValue={formData.color.value}
                onValueChange={onValueChange("color")}
                style={{ padding: 20, marginLeft: 30 }}
              >
                {colorData.map((color) => (
                  <Picker.Item
                    label={color.name}
                    value={color.hexString}
                    key={color.hexString}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={{ fontSize: 13 }}>Date:</Text>
          <CustomDatePicker
            date={formData.date.value}
            setDate={onValueChange("date")}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            margin: 5,
          }}
        >
          <Text style={{ fontSize: 13 }}>Completed:</Text>
          <Switch
            onValueChange={onValueChange("isCompleted")}
            value={formData.isCompleted.value}
          />
        </View>
        <Error message={error} />
        <View style={{ margin: 5 }}>
          <Button
            label={isEdit ? "Update Task" : "Add Task"}
            onPress={create}
            disabled={isDisabled || isLoading}
            isLoading={isLoading}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  closeIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
  fieldContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    margin: 5,
  },
});
