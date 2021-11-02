import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { COLOR_ACCENT, COLOR_PRIMARY } from "./AppStyles";
import firebase from "firebase";
import FeedScreen from "./FeedScreen";

const firebaseConfig = require("./keys.json");

if (firebase.apps.length == 0) {
  firebase.initializeApp(firebaseConfig);
}

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: COLOR_PRIMARY,
      accent: COLOR_ACCENT,
    },
  };

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <FeedScreen />
      </PaperProvider>
    </SafeAreaProvider>
  );
}