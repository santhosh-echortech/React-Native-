import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

const Header = ({ title }) => {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: 'white',
        marginBottom: '5%',
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center'
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: 'black'
    },
})

export default Header