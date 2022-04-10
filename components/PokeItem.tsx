import { StyleSheet, View, Text, Image } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'

interface PokeItemProps {
  poke: {
    name: string,
    sprite: string,
    id: number
  },
  userFavPokes: IFavPoke[] | undefined,
  addToPoketeam(favPoke: IFavPoke): void | null
}
interface IFavPoke {
  name: string,
  sprite: string
}

const PokeItem = ({ poke, userFavPokes, addToPoketeam }: PokeItemProps) => {
  let alreadyFav
  if (userFavPokes){
    for(let favPoke of userFavPokes){
      if(favPoke.name == poke.name) alreadyFav = true
    }
  }
  let icon = alreadyFav
    ? <AntDesign
        style={styles.itemIcon}
        name="heart" size={12}
        color="red"
      />
    : <AntDesign
        onPress={() => addToPoketeam({
          name: poke.name, 
          sprite: poke.sprite
        })}
        style={styles.itemIcon}
        name="hearto" size={12}
        color="black"
      />

  return (
    <View style={styles.item}>
      <View style={styles.itemCircle}>
        <Image
          source={{ uri: poke.sprite }}
          style={styles.itemImage}
        />
      </View>
      <View style={styles.itemLabel}>
        <Text style={styles.itemText}>{poke.name}</Text>
        {icon}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    width: 100,
    padding: 5,
    margin: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4
  },
  itemLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemText: {
    fontWeight: 'bold',
    color: '#555',
    textTransform: 'capitalize',
    textAlign: 'center'
  },
  itemIcon: {
    marginTop: 5
  },
  itemImage: {
    width: 100,
    height: 100,
    transform: [
      { scale: 1.2 },
      { translateX: -2 }
    ]
  },
  itemCircle: {
    backgroundColor: '#A8B5DB',
    borderRadius: 10
  }
})

export default PokeItem