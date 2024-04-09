import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';

function SettingsScreen() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: false,
    fontSize: 17, // Initial font size
  });

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: form.darkMode ? '#222' : '#fff',
      },
      headerTintColor: form.darkMode ? '#fff' : '#000',
    });
  }, [form.darkMode]);

  const calculateFontSize = (baseFontSize) => {
    return baseFontSize * (form.fontSize / 17); // Assuming 17 is the base font size
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: form.darkMode ? '#222' : '#fff' }]}>
      <View style={styles.container}>
        <View style={styles.profile}>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}>
            <View style={styles.profileAvatarWrapper}>
              <Image
                alt=""
                source={{
                  uri: 'https://image.unsplash.com/photos/a-lake-surrounded-by-trees-and-mountains-under-a-cloudy-sky-6AFFx5eU99k',
                }}
                style={[styles.profileAvatar, { fontSize: calculateFontSize(19) }]} />

              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}>
                <View style={styles.profileAction}>
                  <FeatherIcon
                    color="#fff"
                    name="edit-3"
                    size={calculateFontSize(15)} />
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <View>
            <Text style={[styles.profileName, { fontSize: calculateFontSize(19), color: form.darkMode ? '#fff' : '#414d63' }]}>User's name</Text>

            <Text style={[styles.profileAddress, { fontSize: calculateFontSize(16), color: form.darkMode ? '#989898' : '#414d63' }]}>
            4513 Manhattan College Pkwy, Bronx, NY 10471
            </Text>
          </View>
        </View>

        <ScrollView>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: form.darkMode ? '#9e9e9e' : '#000' }]}>Preferences</Text>

            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={[styles.row, { backgroundColor: form.darkMode ? '#333' : '#f2f2f2' }]}>
              <View style={[styles.rowIcon, { backgroundColor: '#fe9400' }]}>
                <FeatherIcon color="#fff" name="globe" size={calculateFontSize(20)} />
              </View>

              <Text style={[styles.rowLabel, { color: form.darkMode ? '#fff' : '#0c0c0c', fontSize: calculateFontSize(17) }]}>Language</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon
                color="#C6C6C6"
                name="chevron-right"
                size={calculateFontSize(20)} />
            </TouchableOpacity>

            <View style={[styles.row, { backgroundColor: form.darkMode ? '#333' : '#f2f2f2' }]}>
              <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
                <FeatherIcon color="#fff" name="moon" size={calculateFontSize(20)} />
              </View>

              <Text style={[styles.rowLabel, { color: form.darkMode ? '#fff' : '#0c0c0c', fontSize: calculateFontSize(17) }]}>Dark Mode</Text>

              <View style={styles.rowSpacer} />

              <Switch
                onValueChange={darkMode => setForm({ ...form, darkMode })}
                value={form.darkMode} />
            </View>

            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={[styles.row, { backgroundColor: form.darkMode ? '#333' : '#f2f2f2' }]}>
              <View style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
                <FeatherIcon
                  color="#fff"
                  name="navigation"
                  size={calculateFontSize(20)} />
              </View>

              <Text style={[styles.rowLabel, { color: form.darkMode ? '#fff' : '#0c0c0c', fontSize: calculateFontSize(17) }]}>Location</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon
                color="#C6C6C6"
                name="chevron-right"
                size={calculateFontSize(20)} />
            </TouchableOpacity>

            <View style={[styles.row, { backgroundColor: form.darkMode ? '#333' : '#f2f2f2' }]}>
              <View style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
                <FeatherIcon
                  color="#fff"
                  name="at-sign"
                  size={calculateFontSize(20)} />
              </View>

              <Text style={[styles.rowLabel, { color: form.darkMode ? '#fff' : '#0c0c0c', fontSize: calculateFontSize(17) }]}>Email Notifications</Text>

              <View style={styles.rowSpacer} />

              <Switch
                onValueChange={emailNotifications =>
                  setForm({ ...form, emailNotifications })
                }
                value={form.emailNotifications} />
            </View>

            <View style={[styles.row, { backgroundColor: form.darkMode ? '#333' : '#f2f2f2' }]}>
              <View style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
                <FeatherIcon color="#fff" name="bell" size={calculateFontSize(20)} />
              </View>

              <Text style={[styles.rowLabel, { color: form.darkMode ? '#fff' : '#0c0c0c', fontSize: calculateFontSize(17) }]}>Push Notifications</Text>

              <View style={styles.rowSpacer} />

              <Switch
                onValueChange={pushNotifications =>
                  setForm({ ...form, pushNotifications })
                }
                value={form.pushNotifications} />
            </View>

            {/* Font Size Slider */}
            <View style={[styles.row, { backgroundColor: form.darkMode ? '#333' : '#f2f2f2' }]}>
              <Text style={[styles.rowLabel, { color: form.darkMode ? '#fff' : '#0c0c0c', flex: 1 }]}>Text Size</Text>
              <Slider
                style={{ flex: 3 }}
                minimumValue={10}
                maximumValue={30}
                step={1}
                value={form.fontSize}
                onValueChange={value => setForm({ ...form, fontSize: value })}
                minimumTrackTintColor={form.darkMode ? '#fff' : '#007bff'}
                maximumTrackTintColor={form.darkMode ? '#fff' : '#C6C6C6'}
                thumbTintColor={form.darkMode ? '#fff' : '#007bff'}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: form.darkMode ? '#9e9e9e' : '#fff' }]}>Resources</Text>

            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={[styles.row, { backgroundColor: form.darkMode ? '#333' : '#f2f2f2' }]}>
              <View style={[styles.rowIcon, { backgroundColor: '#8e8d91' }]}>
                <FeatherIcon color="#fff" name="flag" size={calculateFontSize(20)} />
              </View>

              <Text style={[styles.rowLabel, { color: form.darkMode ? '#fff' : '#0c0c0c', fontSize: calculateFontSize(17) }]}>Report Bug</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon
                color="#C6C6C6"
                name="chevron-right"
                size={calculateFontSize(20)} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  profile: {
    padding: 24,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarWrapper: {
    position: 'relative',
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
  profileAction: {
    position: 'absolute',
    right: -4,
    bottom: -10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: '#007bff',
  },
  profileName: {
    marginTop: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  profileAddress: {
    marginTop: 5,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    paddingVertical: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontWeight: '400',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});

export default SettingsScreen;
