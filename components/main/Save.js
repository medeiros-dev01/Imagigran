import React, { useState } from 'react';
import { View, TextInput, Image, Button } from 'react-native';

import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/firebase-storage';
import 'firebase/auth';

const Save = ({ navigation, route }) => {
  const { image } = route.params;
  const [caption, setCaption] = useState('');

  const savePostData = (downloadURL) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(firebase.auth().currentUser.uid)
      .collection('userPosts')
      .add({
        downloadURL,
        caption,
        created: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => navigation.popToTop());
  };

  const uploadImage = async () => {
    const childPath = `post/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;
    const res = await fetch(image);
    const blob = await res.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskError = (snapshot) => console.log;

    const taskProgress = (snapshot) => {
      console.log(`transfered: ${snapshot.bytesTransfered}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
      });
    };

    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };

  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: image }} />
      <TextInput
        placeholder="Enter a description..."
        onChangeText={(caption) => setCaption(caption)}
      />

      <Button title="Save" onPress={() => uploadImage()} />
    </View>
  );
};

export default Save;
