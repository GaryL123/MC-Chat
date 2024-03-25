import React from 'react';
import { View, Text } from 'react-native';
import { MenuOption } from 'react-native-popup-menu';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const MenuItem = ({ text, action, value, icon, customContent }) => {
    return (
        <MenuOption onSelect={() => action(value)}>
            <View className="px-4 py-1 flex-row justify-between items-center">
                <Text style={{ fontSize: hp(1.7) }} className="font-semibold text-neutral-600">
                    {text}
                </Text>
                {customContent ? customContent : icon}
            </View>
        </MenuOption>
    );
};
