import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native';
import { connect } from 'react-redux';

const Feed = ({ feed, following, usersFollowingLoaded }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (usersFollowingLoaded == following.length && following.length > 0)  {
      feed.sort((x,y) => x.creation - y.creation);
      setPosts(feed)
    }
  }, [usersFollowingLoaded, feed])

  return (
    <View style={styles.container}>
      <View style={styles.gallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.images}>
              <Text> {item?.user?.name} </Text>
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
  gallery: {
    flex: 1,
  },
  images: {
    flex: 1,
    height: 500,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
});

const MapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
});

export default connect(MapStateToProps, null)(Feed);
