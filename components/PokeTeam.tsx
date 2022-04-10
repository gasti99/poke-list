import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

interface PokeTeamProps {
  userFavPokes: IFavPoke[],
  clearPoketeam(): void
}
interface IFavPoke {
  name: string,
  sprite: string
}

const PokeTeam = ({ userFavPokes, clearPoketeam }: PokeTeamProps) => {
  return (
    <View style={styles.pokeTeamContainer}>
      { userFavPokes.map(poke => (
            <TouchableOpacity onPress={() => clearPoketeam()}>
              <View style={styles.pokeCircle}>
                <Image
                  source={{ uri: poke.sprite }}
                  style={styles.pokeImage}
                />
              </View>
            </TouchableOpacity>
          )
      ) }
    </View>
  )
}

const styles = StyleSheet.create({
  pokeTeamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  pokeImage: {
    width: 40,
    height: 40,
    transform: [
      { scale: 1.2 }
    ]
  },
  pokeCircle: {
    backgroundColor: '#A8B5DB',
    marginHorizontal: 3,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 50
  }
})

export default PokeTeam