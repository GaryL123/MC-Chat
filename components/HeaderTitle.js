import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { useSettings } from '../logic/settingsContext';
import { getldStyles } from '../assets/styles/LightDarkStyles';

const HeaderTitle = ({ photo, name }) => {
    const { textSize } = useSettings();
    const ldStyles = getldStyles(textSize);
    
    return (
        <View style={ldStyles.headerTitleContainer}>
            <Image source={{ uri: photo }} style={ldStyles.headerProfileImage}/>
            <Text style={ldStyles.headerTitle}>{name}</Text>
        </View>
    );
};

export default HeaderTitle;