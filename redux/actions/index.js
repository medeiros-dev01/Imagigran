import {
  USER_STATE_CHANGE,
  USER_POST_CHANGE,
  USER_FOLLOWING_CHANGE,
  USERS_DATA_CHANGE,
  USERS_POST_CHANGE
} from '../constants';
import firebase from 'firebase';
import 'firebase/firestore';

export const fetchUser = () => {
  return (dispatch) => {
    const uid = firebase.auth().currentUser.uid;
    firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          const data = snapshot.data();
          console.log({ ...data, uid });
          dispatch({ type: USER_STATE_CHANGE, currentUser: { ...data, uid } });
        }
      });
  };
};

export const fetchUserPosts = () => {
  return (dispatch) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(firebase.auth().currentUser.uid)
      .collection('userPosts')
      .orderBy('creation', 'asc')
      .get()
      .then((snapshot) => {
        const posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        dispatch({ type: USER_POST_CHANGE, posts });
      });
  };
};

export const fetchUserFollowing = () => {
  return (dispatch) => {
    firebase
      .firestore()
      .collection('following')
      .doc(firebase.auth().currentUser.uid)
      .collection('userFollowing')
      .onSnapshot((snapshot) => {
        const following = snapshot.docs.map((doc) => doc.id);
        dispatch({ type: USER_FOLLOWING_CHANGE, following });
        following.map((value, index) => {
          dispatch(fetchUsersData(following[index], true));
        })
      });
  };
};

export const fetchUsersData = (uid, getPosts) => {
  return (dispatch, getState) => {
    const found = getState().usersState.users.some((el) => el.uid === uid);

    if (!found) {
      firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            const data = snapshot.data();

            dispatch({ type: USERS_DATA_CHANGE, user: { ...data, uid } });
          }
        });

        if(getPosts) {
          dispatch(fetchUsersFollowingPosts(uid));
        }
    }
  };
};

export function fetchUsersFollowingPosts(uid) {
return ((dispatch, getState) => {
  firebase
      .firestore()
      .collection('posts')
      .doc(uid)
      .collection('userPosts')
      .orderBy('creation', 'asc')
      .get()
      .then((snapshot) => {
        const uid = snapshot.query.EP.path.segments[1];
        const user = getState().usersState.users.find((el) => el.uid === uid);

        const posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data, user };
        });
        dispatch({ type: USERS_POST_CHANGE, posts, uid });
      });
});
};
