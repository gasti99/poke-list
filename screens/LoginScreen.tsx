import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { app } from '../firebase'
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    serverTimestamp
} from 'firebase/firestore'
import Overlay from '../components/Overlay'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

const auth = getAuth(app)
const db = getFirestore(app)
const usersRef = collection(db, 'users')

interface AuthInputProps {
    navigation: NativeStackNavigationProp<any>
}

const AuthInput = ({ navigation }: AuthInputProps) => {
    const [userInput, setUserInput] = useState({
        email: '',
        password: ''
    })
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if(user) navigation.replace('Home')
        })
        return unsubscribe
    }, [])
    const handleSignIn = () => {
    if([userInput.email, userInput.password].includes('')){
        // A user field is empty
        return alert("Please, enter both your email and password in order to sign in")
    }
    return signInWithEmailAndPassword(auth, userInput.email, userInput.password)
        .catch(err => alert(err.message))
    }
    const handleSignUp = () => {
    if([userInput.email, userInput.password].includes('')){
        // A user field is empty
        return alert("Please, enter both your email and a password in order to sign up")
    }
    return createUserWithEmailAndPassword(auth, userInput.email, userInput.password)
        .then((userCredential) => {
            const user = userCredential.user
            setDoc(doc(usersRef, user.uid), {
                uid: user.uid,
                email: user.email,
                favPokes: [],
                createdAt: serverTimestamp()
            })
        })
        .catch(err => alert(err.message))
    }
    return (
        <Overlay>
            <View style={styles.container}>
                <View>
                    <Text style={styles.title}>POKELIST</Text>
                </View>
                <View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Please, enter your email and password</Text>
                        <TextInput 
                            style={styles.input}
                            placeholder='Your email'
                            value={userInput.email}
                            onChangeText={text => setUserInput({...userInput, email: text})}
                        />
                        <TextInput 
                            style={styles.input}
                            placeholder='Your password'
                            value={userInput.password}
                            onChangeText={text => setUserInput({...userInput, password: text})}
                            secureTextEntry={true}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleSignIn()}
                        >
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleSignUp()}
                        >
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Overlay>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 35,
        color: 'white',
        textShadowColor: 'black',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1
    },
    inputContainer: {
        backgroundColor: '#4474DB',
        marginTop: 50,
        marginBottom: 10,
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
        margin: 10,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },
    inputLabel: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textShadowColor: 'black',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 1
    },
    buttonContainer: {
        marginTop: 20,
        alignSelf: 'center'
    },
    button: {
        backgroundColor: '#4474DB',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white'
    }
})

export default AuthInput