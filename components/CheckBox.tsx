import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function CheckBox(props: any) {

    const [isTrue, setIsTrue] = React.useState(false);

    const handleClick = () => {
        setIsTrue(!isTrue);

        props.onClick(!isTrue);

        //console.log(!isTrue);
    }

    return (
        <TouchableOpacity onPress={() => handleClick()}>
            <View style={{ backgroundColor: isTrue ? '#50c878' : '#fff', borderWidth: 2.5, borderColor: 'gray', borderRadius: 5, maxWidth: 22.5, minWidth: 22.5, maxHeight: 22.5, minHeight: 22.5 }}>
                <Text style={{ fontWeight: 'bold', color: '#fff', alignSelf: 'center' }}>{isTrue ? '✓' : null}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default CheckBox;