import React, { useState, useEffect } from "react";
import { Platform, View } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase/app"
import "firebase/firestore";
import { StackNavigationProp } from "@react-navigation/stack";

interface Props {
    navigation: StackNavigationProp<"AddScreen">;
}

export default function AddScreen( { navigation }: Props) {
    const [title, setTitle] = useState("");
    const [postInfo, setPostInfo] = useState("");
    const [scheduleImage, setScheduleImage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
          if (Platform.OS !== "web") {
            const {
              status,
            } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
              alert("Sorry, we need camera roll permissions to make this work!");
            }
          }
        })();
      }, []);

      const pickImage = async () => {
        console.log("picking image");
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        console.log("done");
        if (!result.cancelled) {
          setScheduleImage(result.uri);
        }
      };

      const onDismissSnackBar = () => setVisible(false);
      const showError = (error: string) => {
        setMessage(error);
        setVisible(true);
      };
    
      const saveSchedule = async () => {
        if (!title) {
          showError("Please enter a title for the post.");
          return;
        } else if (!scheduleImage) {
          showError("Please upload an image of your schedule.");
          return;
        } else if (!postInfo) {
          showError("Please enter information about your post.");
          return;
        } else {
          setLoading(true);
        }

        try {
            console.log("getting file object");
            const object: Blob = (new getFileObjectAsync()) as Blob;
            const postRef = firebase.firestore().collection("posts").doc();
            console.log("putting file object");
            const result = await firebase
              .storage()
              .ref()
              .child(postRef.id + ".jpg")
              .put(object);
            console.log("getting download url");
            const downloadURL = await result.ref.getDownloadURL();
            const doc: PostModel = {
                title: title,
                postInfo: postInfo,
                scheduleImage: downloadURL,
                uid: firebase.auth().currentUser.uid,
                liked: [],
                postComments: [],
            };
            console.log("setting download url");
            await postRef.set(doc);
            setLoading(false);
            navigation.goBack();
          } catch (error) {
            setLoading(false);
            showError(error.toString());
          }
        };

        const Bar = () => {
            return (
              <Appbar.Header>
                <Appbar.Action onPress={navigation.goBack} icon="close" />
                <Appbar.Content title="Posts" />
              </Appbar.Header>
            );
          };
    
          return (
            <>
              <Bar />
              <View>
                <TextInput
                  label="Post Title"
                  value={title}
                  onChangeText={(name: any) => setTitle(name)}
                  style={{ backgroundColor: "white", marginBottom: 10 }}
                />
                <TextInput
                  label="Comments about Your Schedule"
                  value={postInfo}
                  onChangeText={(info: any) => setPostInfo(info)}
                  style={{ backgroundColor: "white", marginBottom: 10 }}
                />
                <Button mode="outlined" onPress={pickImage} style={{ marginTop: 20 }}>
                  {scheduleImage ? "Change Image" : "Pick an Image"}
                </Button>
                <Button
                  mode="contained"
                  onPress={saveSchedule}
                  style={{ marginTop: 20 }}
                  loading={loading}
                >
                  Post Schedule
                </Button>
                <Snackbar
                  duration={3000}
                  visible={visible}
                  onDismiss={onDismissSnackBar}
                >
                  {message}
                </Snackbar>
              </View>
            </>
          );
}
