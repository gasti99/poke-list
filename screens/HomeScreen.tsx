import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { app } from '../firebase'
import { 
    getAuth,
    signOut,
} from 'firebase/auth'
import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    collection
} from 'firebase/firestore'
import Overlay from '../components/Overlay'
import PokeTeam from '../components/PokeTeam'
import PokeList from '../components/PokeList'

const auth = getAuth(app)
const db = getFirestore(app)
const usersRef = collection(db, 'users')

interface HomeScreenProps {
    navigation: NativeStackNavigationProp<any>
}
interface IUser {
    email: string,
    uid: string,
    favPokes: IFavPoke[]
}
interface IFavPoke {
    name: string,
    sprite: string
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
    const [user, setUser] = useState<IUser | null>()
    useEffect(() => {
        const docRef = doc(db, `users/${auth.currentUser?.uid}`)
        getDoc(docRef)
            .then((snapshot) => {
                const data = snapshot.data()
                setUser({
                    email: data?.email,
                    uid: data?.uid,
                    favPokes: data?.favPokes
                })
            })
            .catch(err => alert(err.message))
    }, [])
    const handleSignOut = () => {
        signOut(auth)
            .then(() => navigation.replace('Login'))
            .catch((err) => alert(err.message))
    }
    const addToPoketeam = (favPoke: IFavPoke) => {
        if(!user) return null
        if(user.favPokes.length >= 6) return null // Array is full (max. 6 pokes)
        for(let userFavPoke of user.favPokes){
            if(userFavPoke.name == favPoke.name) return null // Poke's already in the array
        }
        const newFavPokes = user.favPokes
        newFavPokes.push(favPoke)
        setUser({...user, favPokes: newFavPokes})
        updateDoc(doc(usersRef, user.uid), {
            favPokes: user.favPokes,
        })
          .catch(err => console.log(err.message))
    }
    const clearPoketeam = () => {
        if(!user) return null
        return Alert.alert(
            "Clear Poketeam",
            "Your whole Poketeam will be cleared",
            [{
                text: "Ok",
                onPress: () => {
                    setUser({...user, favPokes: []})
                    updateDoc(doc(usersRef, user.uid), {
                        favPokes: [],
                    })
                      .catch(err => console.log(err.message))
                }
              },
              {
                text: "Cancel",
            }]
        );
        
        
    }
    return (
        <Overlay>
            <View style={styles.container}>
                <View style={styles.userContainer}>
                    <Text style={styles.userText}>Welcome, {user?.email}!</Text>
                    { user?.favPokes.length 
                        ? <PokeTeam userFavPokes={user.favPokes} clearPoketeam={clearPoketeam} /> 
                        : <Text style={styles.userText}>No Poketeam registered</Text> }
                    <TouchableOpacity
                        style={styles.button}
                        onPress={async () => handleSignOut()}
                    >
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
                <PokeList user={user} addToPoketeam={addToPoketeam} />
            </View>
        </Overlay>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    userContainer: {
        backgroundColor: '#4474DB',
        marginTop: 30,
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
    userText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 5
    },
    button: {
        backgroundColor: 'white',
        padding: 4,
        marginTop: 10,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#777'
    }
})

export default HomeScreen