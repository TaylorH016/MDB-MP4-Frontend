import React, { useState, useEffect } from "react";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScrollView, Image, Text, View, Button } from "react-native";
import { Appbar, TextInput } from "react-native-paper";
import { styles } from "./DetailScreen.styles"

interface Props {
    navigation: StackNavigationProp<"DetailScreen">;
    route: RouteProp<"DetailScreen">;
}

export default function DetailScreen( {route, navigation }: Props) {
    const { post } = route.params;
    const [comment, setComment] = useState("");

    const submitComment = async () => {
        post.comments.push(comment)
    };

    const Bar = () => {
        return (
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.navigate("FeedScreen")} />
            <Appbar.Content title="Posts" />
          </Appbar.Header>
        );
    };

    return (
        <>
          <Bar />
          <ScrollView>
            <View>
              <Image style={styles.image} source={{ uri: post.scheduleImage }} />
              <Text style={{ marginVertical: 10 }}>
                {post.title}
              </Text>
              <Text style={{ marginBottom: 5 }}>
                {post.eventInfo}
              </Text>
              <Text style={styles.subtitle}>{post.postComments}</Text>
              <Text style={{ marginBottom: 15 }}>Add Comment</Text>
              <TextInput
                  label="Add a comment"
                  value={comment}
                  onChangeText={(postComment: any) => setComment(postComment)}
                  style={{ backgroundColor: "white", marginBottom: 10 }}
                />
                <Button mode="outlined" onPress={submitComment} style = {{ marginTop: 20 }}>Submit</Button>
            </View>
          </ScrollView>
        </>
      );
}