import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  screenL: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screenD: {
    flex: 1,
    backgroundColor: '#111',
  },
  container: {
    paddingTop: hp(15),
    paddingHorizontal: wp(5),
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: hp(20),
  },
  headerText: {
    fontSize: hp(4),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: hp(2),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: wp(4),
    borderRadius: 25,
    marginBottom: hp(2),
  },
  inputContainerHoriz: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: hp(1.5),
    fontSize: hp(2),
    color: '#333',
  },
  emailDomain: {
    paddingVertical: hp(1.5),
    fontSize: hp(2),
    color: '#333',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: wp(2),
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: hp(2),
  },
  forgotPasswordText: {
    fontSize: hp(1.8),
    color: '#666',
  },
  loginButton: {
    backgroundColor: '#166939',
    paddingVertical: hp(1.5),
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  loginButtonText: {
    color: '#fff',
    fontSize: hp(2.7),
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp(2),
  },
  registerText: {
    fontSize: hp(1.8),
    color: '#666',
  },
  registerLink: {
    fontSize: hp(1.8),
    fontWeight: 'bold',
    color: '#166939',
  },
  profileImageProfilePage: {
    height: hp(15),
    aspectRatio: 1,
    borderRadius: 100,
    marginBottom: hp(4),
  },
  submitDiscardButtonProfilePage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#166939',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(11),
    borderRadius: 25,
    marginBottom: hp(2),
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: wp(4),
    borderRadius: 25,
    marginBottom: hp(2),
  },
  editButton: {
    position: 'absolute',
    right: 125,
    bottom: 30,
    borderRadius: 100,
    backgroundColor: '#e0e0e0',
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: "#333",
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalItemText: {
    fontSize: 18,
    textAlign: 'center',
    color: "#333",
  },
});

export default styles;
