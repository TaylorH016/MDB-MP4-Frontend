import React, { useState, useEffect } from "react";
import { View, FlatList, Text } from "react-native";
import { Appbar, Button, Card } from "react-native-paper";
import firebase from "firebase/app";
import "firebase/firestore";
import { StackNavigationProp } from "@react-navigation/stack";
import { PostModel } from "models/posts";

interface Props {
    navigation: StackNavigationProp<"FeedScreen">;
}

export default function FeedScreen( { navigation }: Props) {
    const [posts, setPosts] = useState<PostModel[]>([]);
    const currentUserId = firebase.auth().currentUser!.uid;

    useEffect(() => {
        const db = firebase.firestore();
        const unsubscribe = db
          .collection("posts")
          .orderBy("postTime", "asc")
          .onSnapshot((querySnapshot: any) => {
            var newPosts: PostModel[] = [];
            querySnapshot.forEach((post: any) => {
              const newPost = post.data() as PostModel;
              post.id = post.id;
              newPosts.push(newPost);
            });
            setPosts(newPosts);
          });
        return unsubscribe;
      }, []);

      const renderPost = ({ item }: { item: PostModel }) => {
        const onPress = () => {
          navigation.navigate("DetailScreen", {
            post: item,
          });
        };
    
        let curUID = firebase.auth().currentUser!.uid;
        let deleteBin = <></>;

        if (curUID == item.uid) {
            deleteBin = <Button onPress = {deletePost}>Delete</Button>
        }
        let likeBin = <Button onPress = {toggleInterested}>{item.liked.includes(curUID) ? "Liked": "Like"}</Button>
        
        const toggleInterested = (post: PostModel) => {
            if (item.liked.includes(curUID)) {
              let index = post.liked.indexOf(curUID);
              item.liked.splice(index,1);
            } else {
              item.liked.push(curUID);
            }
            firebase.firestore().collection("PostModels").doc(item.id).update({liked: item.liked});
          };
          
        const deleteSocial = (post: PostModel) => {
            firebase.firestore().collection("PostModels").doc(item.id).delete().then(() => {
              console.log("Document deleted");
            }).catch((error) => {
              console.error("Error removing the document: ", error);
            });
        
            const index = posts.indexOf(post);
            setPosts(posts.splice(index, 1));
        }

          return (
              <Card onPress = {onPress} style = {{margin: 16}}>
                  <Card.Cover source = {{ uri: item.scheduleImage}} />
                  <Card.Title
                    title = {item.title}
                    subtitle = {new Date(item.postTime).toLocaleString()} />
                    <Card.Actions>
                        {deleteBin}
                        {likeBin}
                    </Card.Actions>
              </Card>
          );
        };

        const Bar = () => {
            return (
              <Appbar.Header>
                <Appbar.Action
                  icon="exit-to-app"
                  onPress={() => firebase.auth().signOut()}
                />
                <Appbar.Content title="Posts" />
                <Appbar.Action
                  icon="plus"
                  onPress={() => {
                    navigation.navigate("AddScreen");
                  }}
                />
              </Appbar.Header>
            );
          };

          return (
            <>
              <Bar/>
              <View>
                <FlatList
                  data={posts}
                  renderItem={renderPost}
                  keyExtractor={(_: any, index: number) => "key-" + index}
                  ListEmptyComponent={<Text>Create a Post By Pressing +</Text>}
                />
              </View>
            </>
          );
}