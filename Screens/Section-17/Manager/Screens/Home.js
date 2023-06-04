import React, { useState,useEffect } from 'react'
import { View, StyleSheet, StatusBar, TextInput, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import Header from '../Components/Header'
import auth from '@react-native-firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Home = (props) => {
    const [userDetails, setUserDetails] = useState({
        email: '',
        password: ''
    })
    const [user, setUser] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [signInLoader, setSignInLoader] = useState(false)
    const [logOutLoader, setLogOutLoader] = useState(false)
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        checkUserToken()
    }, [])

    const checkUserToken = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken')
            if (token) {
                props.navigation.navigate('Employee')
            }
        } catch (error) {
            console.log('Error retrieving user token:', error)
        }
    }

    const handleSignUp = () => {
        setLoader(true)
        auth()
            .createUserWithEmailAndPassword(userDetails.email.trim(), userDetails.password.trim())
            .then(async (userCredential) => {
                console.log(userCredential.user.uid, 'UId')
                const user = userCredential.user
                setUser(user)
                try {
                    const token = await user.getIdToken()
                    await AsyncStorage.setItem('userToken', token)
                    console.log('User token stored successfully:', token)
                } catch (error) {
                    console.log('Error storing user token:', error)
                }

            })
            .catch((error) => {
                setErrorMessage(error.message)
                setUserDetails({})
                console.log('signUp Error', error.message)
            })

        props.navigation.navigate('Employee')
        setLoader(false)
    }

    const handleSignIn = () => {
        setSignInLoader(true)
        auth()
            .signInWithEmailAndPassword(userDetails.email.trim(), userDetails.password.trim())
            .then(async (userCredential) => {
                const user = userCredential.user
                setUser(user)
                try {
                    const token = await user.getIdToken()
                    await AsyncStorage.setItem('userToken', token)
                    console.log('User token stored successfully:', token)
                } catch (error) {
                    console.log('Error storing user token:', error)
                }

            })
            .catch((error) => {
                setErrorMessage(error.message)
                setUserDetails({})
                console.log('signIn Error', error.message)
            })
        props.navigation.navigate('Employee')
        setSignInLoader(false)
    }

    /* const handleSignOut = () => {
          auth()
              .signOut()
              .then(() => {
                  setUser(null)
                  setErrorMessage(null)
                  setUserDetails({})
              })
              .catch((error) => {
                  setErrorMessage(error.message)
                  setUserDetails({})
              })
      }*/


    return (
        <>
            <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
            <Header title={'Authentication'} />
            <View style={styles.container}>
                <>
                    <Text style={styles.heading}>Email</Text>
                    <TextInput
                        placeholder='Email'
                        autoCapitalize='none'
                        autoCorrect={false}
                        style={styles.input}
                        value={userDetails.email}
                        onChangeText={(text) => setUserDetails({ ...userDetails, email: text })}
                        onFocus={() => setErrorMessage(null)}
                    />
                    <Text style={styles.heading}>Password</Text>
                    <TextInput
                        placeholder='Password'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry
                        style={styles.input}
                        value={userDetails.password}
                        onChangeText={(text) => setUserDetails({ ...userDetails, password: text })}
                        onFocus={() => setErrorMessage(null)}
                    />
                    {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={!loader && handleSignUp} activeOpacity={0.7} style={styles.button}>
                            {loader ? <ActivityIndicator size="large" color="white" /> : <Text style={styles.buttonText}>Sign Up</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={!loader && handleSignIn} activeOpacity={0.7} style={styles.button}>
                            {signInLoader ? <ActivityIndicator size="large" color="white" /> : <Text style={styles.buttonText}>Sign In</Text>}
                        </TouchableOpacity>
                    </View>
                </>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        // alignItems: 'center',
        //justifyContent: 'center'
    },
    heading: {
        marginLeft: '5%',
        marginTop: '5%',
        color: 'black',
        fontSize: 20,
        fontWeight: '500'
    },
    input: {
        width: '90%',
        backgroundColor: '#F5F5F5',
        height: 60,
        alignSelf: 'center',
        borderRadius: 5,
        marginTop: '2%',
        paddingLeft: '5%',
        paddingRight: '5%',
        color: 'black',
        fontSize: 16,
        // fontWeight:'300'
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        height: 65,
        alignSelf: 'center',
        marginTop: '10%'
    },
    button: {
        height: 60,
        width: '45%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '700'
    },
    errorMessage: {
        width: '80%',
        textAlign: 'center',
        alignSelf: 'center',
        marginTop: '10%',
        color: 'red'
    },
    email: {
        fontSize: 20,
        fontWeight: '900',
        textAlign: 'center',
        marginTop: '10%',
        marginBottom: '10%'
    }
})

export default Home