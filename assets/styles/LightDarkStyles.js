import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ldStyles = StyleSheet.create({
  screenL: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screenD: {
    flex: 1,
    backgroundColor: '#111111',
  },
  profileImage: {
    height: hp(6),
    width: hp(6),
    borderRadius: 100,
  },
  emailDomainL: {
    paddingVertical: hp(1.5),
    fontSize: hp(2),
    color: '#333333',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: wp(2),
  },
  emailDomainD: {
    paddingVertical: hp(1.5),
    fontSize: hp(2),
    color: '#f1f1f1',
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: wp(2),
  },
  nameTextL: {
    fontSize: hp(1.8),
    fontWeight: 'bold',
    color: 'black',
  },
  nameTextD: {
    fontSize: hp(1.8),
    fontWeight: 'bold',
    color: '#f1f1f1',
  },
  timeTextL: {
    fontSize: hp(1.6),
    color: 'grey',
  },
  timeTextD: {
    fontSize: hp(1.6),
    color: 'lightgrey',
  },
  lastMessageTextL: {
    fontSize: hp(1.6),
    color: 'grey',
  },
  lastMessageTextD: {
    fontSize: hp(1.6),
    color: 'lightgrey',
  },
  sectionHeaderL: {
    backgroundColor: '#ebebeb',
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    marginBottom: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  sectionHeaderD: {
    backgroundColor: '#1b1b1b',
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    marginBottom: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f1f1f1',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(4),
    marginBottom: hp(1),
    paddingBottom: hp(1),
  },
  itemContainerText: {
    flex: 1,
    marginLeft: wp(4),
  },
  itemContainer2L: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebebeb',
    paddingHorizontal: wp(4),
    borderRadius: 25,
    marginBottom: hp(2),
  },
  itemContainer2D: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b1b1b',
    paddingHorizontal: wp(4),
    borderRadius: 25,
    marginBottom: hp(2),
  },
  itemContainer2TextL: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: hp(1.5),
    fontSize: hp(2),
    color: '#333333',
    marginRight: 10
  },
  itemContainer2TextD: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: hp(1.5),
    fontSize: hp(2),
    color: '#f1f1f1',
    marginRight: 10
  },
  myMessageL: {
    backgroundColor: '#146034',
    borderWidth: 0,
    alignSelf: 'flex-end',
  },
  myMessageD: {
    backgroundColor: '#146034',
    borderWidth: 0,
    alignSelf: 'flex-end',
  },
  theirMessageL: {
    backgroundColor: '#e0e0e0',
    borderWidth: 0,
    alignSelf: 'flex-start',
  },
  theirMessageD: {
    backgroundColor: '#262626',
    borderWidth: 0,
    alignSelf: 'flex-start',
  },
  myMessageTextL: {
    fontSize: 16,
    color: "#f1f1f1",
  },
  myMessageTextD: {
    fontSize: 16,
    color: "#f1f1f1",
  },
  theirMessageTextL: {
    fontSize: 16,
    color: "black",
  },
  theirMessageTextD: {
    fontSize: 16,
    color: "#f1f1f1",
  },
  inputContainerL: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: 'white',
    alignItems: 'center',  // Ensure vertical alignment is centered
  },
  inputContainerD: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#262626',
    backgroundColor: '#1b1b1b',
    alignItems: 'center',  // Ensure vertical alignment is centered
  },
  textInputL: {
    flex: 1,
    marginRight: 8,
    marginLeft: 8,
    paddingLeft: 15,
    fontSize: 16,
    borderWidth: 1,  // Set border width to create the outline
    borderColor: '#e0e0e0',  // Set border color to match the send button background
    borderRadius: 20,  // Keep your rounded corners
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 35 // Set a minimum height
  },
  textInputD: {
    flex: 1,
    marginRight: 8,
    marginLeft: 8,
    paddingLeft: 15,
    fontSize: 16,
    borderWidth: 1,  // Set border width to create the outline
    borderColor: '#262626',  // Set border color to match the send button background
    borderRadius: 20,  // Keep your rounded corners
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 35 // Set a minimum height
  },
  circleButtonL: {
    padding: 8,
    width: 44,  // Assign a fixed width
    height: 44, // Assign a fixed height
    justifyContent: 'center', // Center the icon vertically and horizontally
    alignItems: 'center',
    borderRadius: 22,  // Half of width and height to create a circle
    backgroundColor: '#e0e0e0',
  },
  circleButtonD: {
    padding: 8,
    width: 44,  // Assign a fixed width
    height: 44, // Assign a fixed height
    justifyContent: 'center', // Center the icon vertically and horizontally
    alignItems: 'center',
    borderRadius: 22,  // Half of width and height to create a circle
    backgroundColor: '#262626',
  },
  editButtonL: {
    position: 'absolute',
    right: 125,
    bottom: 30,
    borderRadius: 100,
    backgroundColor: '#e0e0e0',
    padding: 8,
  },
  editButtonD: {
    position: 'absolute',
    right: 125,
    bottom: 30,
    borderRadius: 100,
    backgroundColor: '#262626',
    padding: 8,
  },
  menuOptionsStyleL: {
    borderRadius: 10,
    marginTop: 30,
    marginLeft: -30,
    backgroundColor: 'white',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    width: 190
  },
  menuOptionsStyleD: {
    borderRadius: 10,
    marginTop: 30,
    marginLeft: -30,
    backgroundColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    width: 190
  },
  menuItemTextL: {
    fontSize: hp(1.7),
    fontWeight: '600',
    color: '#333333',  // This color corresponds to Tailwind's text-neutral-600
  },
  menuItemTextD: {
    fontSize: hp(1.7),
    fontWeight: '600',
    color: '#f1f1f1',  // This color corresponds to Tailwind's text-neutral-600
  },
  headerTextL: {
    fontSize: hp(4),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    marginBottom: hp(2),
  },
  headerTextD: {
    fontSize: hp(4),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#f1f1f1',
    marginBottom: hp(2),
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalContainerL: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainerD: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentL: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalContentD: {
    backgroundColor: '#111111',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitleL: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: "#333333",
  },
  modalTitleD: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: "#f1f1f1",
  },
  modalItemTextL: {
    fontSize: 18,
    textAlign: 'center',
    color: "#333333",
  },
  modalItemTextD: {
    fontSize: 18,
    textAlign: 'center',
    color: "#f1f1f1",
  },
});

export default ldStyles;
