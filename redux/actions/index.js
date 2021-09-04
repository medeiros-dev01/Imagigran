import { USER_STATE_CHANGE } from '../constants';
import firebase from 'firebase';
import 'firebase/firestore'

export const fetchUser = () => {
  return (dispatch) => {
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
          if(snapshot.exists) {
              console.log(snapshot.data());
              dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
          } else {
              console.log('Usuário não existe');
          }
      });
  };
};
