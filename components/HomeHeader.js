import { View, Text, Platform, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Octicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { blurhash } from '../utils/common';
import { useAuth } from '../context/authContext';
import { useRouter, usePathname } from 'expo-router';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { MenuItem } from './CustomMenuItems';

const ios = Platform.OS == 'ios';
export default function HomeHeader() {
    const router = useRouter();
    const { user, logout, pendingFriendRequests } = useAuth();
    const { top } = useSafeAreaInsets();
    const pathName = usePathname();

    const handleLogout = async () => {
        await logout();
    }
    
    const hasPendingRequests = pendingFriendRequests && pendingFriendRequests.length > 0;

    const NotificationBubble = ({ count }) => {
        return (
            <View style={{
                minWidth: 20, // Ensure the bubble is at least somewhat circular
                padding: 2,
                backgroundColor: 'red',
                borderRadius: 10, // Adjust for circularity
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text style={{ color: 'white', fontSize: 10, padding: 1 }}>{count}</Text>
            </View>
        );
    };

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
                            //borderWidth: hasPendingRequests ? 2 : 0,
                            //borderColor: hasPendingRequests ? 'red' : 'transparent',
                        }
                    }}>
                        {pathName == '/homeRooms' && (
                            <TouchableOpacity onPress={() => router.push('createChatRoom')} style={{ marginRight: 10 }}>
                                <Octicons name="plus" size={hp(3)} color="white" />
                            </TouchableOpacity>
                        )}
                        <Image
                            style={{ height: hp(4.3), aspectRatio: 1, borderRadius: 100 }}
                            source={user?.profileUrl}
                            placeholder={blurhash}
                            transition={500}
                        />
                        {hasPendingRequests && (
                            <View style={{
                                position: 'absolute',
                                right: -6,
                                bottom: -3,
                                backgroundColor: 'red',
                                borderRadius: 50,
                                width: hp(2),
                                height: hp(2),
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Text style={{ color: 'white', fontSize: 10 }}>{pendingFriendRequests.length}</Text>
                            </View>
                        )}
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
                            text="Home"
                            action={() => router.push('home')}
                            value={null}
                            icon={<Octicons name="person" size={hp(2.5)} color="gray" />}
                        />
                        <Divider />
                        <MenuItem
                            text="HomeRooms"
                            action={() => router.push('homeRooms')}
                            value={null}
                            icon={<Octicons name="person" size={hp(2.5)} color="gray" />}
                        />
                        <Divider />
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
                        {hasPendingRequests && (
                            <MenuItem
                                text="Friend Requests"
                                action={() => router.push('friendRequests')}
                                value={null}
                                customContent={ // Use `customContent` or a similar prop if `MenuItem` supports it, or adjust according to your component's API
                                    <NotificationBubble count={pendingFriendRequests.length} />
                                }
                            />
                        )}
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
