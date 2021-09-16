import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native';
import { connect } from 'react-redux';

import firebase from 'firebase';
import 'firebase/firestore';

const Profile = ({ currentUser, following, posts, route }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { uid } = route.params;

  useEffect(() => {
    if (uid && uid === currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
    } else {
      firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          }
        });

      firebase
        .firestore()
        .collection('posts')
        .doc(uid)
        .collection('userPosts')
        .orderBy('creation', 'asc')
        .get()
        .then((snapshot) => {
          const _posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setUserPosts(_posts);
        });
    }
  }, [uid]);

  useEffect(() => {
    if(following.includes(uid)) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }

  }, [following]);

  const handleFollow = () => {
    firebase
      .firestore()
      .collection('following')
      .doc(currentUser.uid)
      .collection('userFollowing')
      .doc(uid)
      .set({});

  };

  const handleUnfollow = () => {
    firebase
      .firestore()
      .collection('following')
      .doc(currentUser.uid)
      .collection('userFollowing')
      .doc(uid)
      .delete();

  };

  if (!user) return <View />;

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text>{user?.name}</Text>
        <Text>{user?.email}</Text>
        {uid && uid !== currentUser.uid && (
          <View>
            {!isfollowing && <Button title="Follow" onPress={handleFollow} />}
            {isfollowing && <Button title="Unfollow" onPress={handleUnfollow} />}
          </View>
        )}
      </View>
      <View style={styles.gallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.images}>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  info: {
    margin: 20,
  },
  gallery: {
    flex: 1,
  },
  images: {
    flex: 1 / 3,
    height: 100,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
});

const MapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
});

export default connect(MapStateToProps, null)(Profile);
