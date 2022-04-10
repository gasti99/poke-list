import { StyleSheet, View, Text, TextInput, FlatList, SafeAreaView, ListRenderItemInfo } from 'react-native'
import React, { useState, useEffect } from 'react'
import PokeItem from './PokeItem'

interface PokeListProps {
  user: {
    email: string,
    uid: string,
    favPokes: IFavPoke[]
  } | null | undefined
  addToPoketeam(favPoke: IFavPoke): void | null
}
interface IPoke {
  name: string,
  sprite: string,
  id: number
}
interface IFavPoke {
  name: string,
  sprite: string
}

const PokeList = ({ user, addToPoketeam }: PokeListProps) => {
  const [pokes, setPokes] = useState<IPoke[]>([]) // Will keep original array of pokes
  const [filteredPokes, setFilteredPokes] = useState<IPoke[]>([])
  const [lastPokeIndex, setLastPokeIndex] = useState(1) // Keeps track of last requested poke
  const [isSearching, setIsSearching] = useState(false) // Will stop new api requests while user is writing
  useEffect(() => {
    if(typeof getPokes == 'function') getPokes()
  }, [])
  let getPokes: Function | null = () => {
    let fetchsToDo = []
    let i = lastPokeIndex
    for(; i <= lastPokeIndex + 17; i++){
      // Request 18 new pokes each time FlatList reachs end
      fetchsToDo.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`))
    }
    setLastPokeIndex(i)
    Promise.all(fetchsToDo)
      .then(allResponses => {
        allResponses.forEach(res => {
          res.json()
            .then(data => {
              if(!data.name) getPokes = null // No more pokes, get rid of the function
              const poke = {
                name: data.name,
                sprite: data.sprites.front_default,
                id: data.id
              }
              // Update both arrays including newly requested pokes
              setPokes(lastPokes => [...lastPokes, poke])
              setFilteredPokes(lastFilteredPokes => [...lastFilteredPokes, poke])
            })
            .catch(err => console.log(err.message))
        })
      })
      .catch(err => console.log(err.message))
  }
  const searchFilter = (text: string) => {
    if(text == ''){
      // Input is empty, restore results without alterations
      return setFilteredPokes(pokes)
    }
    const searchPokes = filteredPokes.filter((poke) => {
      return poke.name.toUpperCase().indexOf(text.toUpperCase()) > -1
    })
    if(searchPokes.length){
      // At least one poke name matches user's input (inside the current array, not in the api)
      return setFilteredPokes(searchPokes)
    }
    // If no poke was found, try finding it in the api
    fetch(`https://pokeapi.co/api/v2/pokemon/${text.toLowerCase()}`)
      .then(res => res.json())
      .then(data => {
        // Poke was found, add it to the temporary filtered results
        const poke = [{
          name: data.name,
          sprite: data.sprites.front_default,
          id: data.id
        }]
        return setFilteredPokes(poke)
      })
      .catch(err => {
        console.log(err.message)
         // No Poke was found in the api
        return setFilteredPokes(pokes)
      })
  }
  const renderItem = ({ item }: ListRenderItemInfo<IPoke>) => (
    <PokeItem poke={item} userFavPokes={user?.favPokes} addToPoketeam={addToPoketeam} />
  )
  return (
    <View style={styles.listContainer}>
      <Text style={styles.listText}>Pokes</Text>
      <TextInput
        style={styles.listInput}
        placeholder='Search...'
        onChangeText={text => searchFilter(text)}
        onFocus={() => setIsSearching(true)}
        onBlur={() => setIsSearching(false)}
      />
      <SafeAreaView style={{flex: 1}}>
        <FlatList
            contentContainerStyle={styles.itemContainer}
            data={filteredPokes}
            renderItem={item => renderItem(item)}
            keyExtractor={item => item.id.toString()}
            onEndReached={() => {
              if(typeof getPokes == 'function' && !isSearching) getPokes()
            }}
        />
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  listContainer: {
      flex: 1,
      alignSelf: 'stretch',
      backgroundColor: '#4474DB',
      marginHorizontal: 5,
      marginBottom: 10,
      padding: 5,
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
  listText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 17,
      textAlign: 'center'
  },
  listInput: {
    alignSelf: 'center',
    backgroundColor: '#ffffffaa',
    paddingHorizontal: 50,
    marginVertical: 5,
    borderRadius: 5
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderRadius: 5
  }
})

export default PokeList