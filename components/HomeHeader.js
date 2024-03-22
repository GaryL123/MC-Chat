import { View, Text, Platform } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Octicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { blurhash } from '../utils/common';
import { useAuth } from '../context/authContext';
import { useRouter } from 'expo-router';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { MenuItem } from './CustomMenuItems';

const ios = Platform.OS == 'ios';
export default function HomeHeader() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const { top } = useSafeAreaInsets();

    const handleLogout = async () => {
        await logout();
    }
    return (
        <View style={{ paddingTop: ios ? top : top + 10 }} className="flex-row justify-between px-5 bg-green-700 pb-6 rounded-b-3xl shadow">
            <View>
                <Text style={{ fontSize: hp(3) }} className="font-medium text-white">Chats</Text>
            </View>

            <View>
                <Menu>
                    <MenuTrigger customStyles={{
                        triggerWrapper: {
                            // trigger wrapper styles
                        }
                    }}>
                        <Image
                            style={{ height: hp(4.3), aspectRatio: 1, borderRadius: 100 }}
                            source={user?.profileUrl}
                            placeholder={blurhash}
                            transition={500}
                        />
                    </MenuTrigger>
                    <MenuOptions
                        customStyles={{
                            optionsContainer: {
                                borderRadius: 10,
                                borderCurve: 'continuous',
                                marginTop: 40,
                                marginLeft: -30,
                                backgroundColor: 'white',
                                shadowOpacity: 0.2,
                                shadowOffset: { width: 0, height: 0 },
                                width: 160
                            }
                        }}
                    >
                        <MenuItem
                            text="Profile"
                            action={() => router.push('profile')}
                            value={null}
                            icon={<Octicons name="person" size={hp(2.5)} color="gray" />}
                        />
                        <Divider />
                        <MenuItem
                            text="Settings"
                            action={() => router.push('settings')}
                            value={null}
                            icon={<Octicons name="gear" size={hp(2.5)} color="gray" />}
                        />
                        <Divider />
                        <MenuItem
                            text="Add Friends"
                            action={() => router.push('addFriend')}
                            value={null}
                            icon={<Octicons name="person-add" size={hp(2.5)} color="gray" />}
                        />
                        <Divider />
                        <MenuItem
                            text="Sign Out"
                            action={handleLogout}
                            value={null}
                            icon={<Octicons name="sign-out" size={hp(2.5)} color="gray" />}
                        />
                    </MenuOptions>
                </Menu>
            </View>
        </View>
    )
}

const Divider = () => {
    return (
        <View className="p-[1px] w-full bg-neutral-200" />
    )
}
