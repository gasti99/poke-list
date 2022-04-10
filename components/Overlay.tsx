import { StyleSheet, View, Image, ImageBackground } from 'react-native'
import React, { ReactNode } from 'react'
import background from '../assets/background.png'

interface OverlayProps {
    children: ReactNode
}

const Overlay = ({ children }: OverlayProps) => {
  return (
    <View
      style={styles.container}
    >
      <ImageBackground 
        source={background}
        resizeMode="cover"
        style={styles.backgroundImg}
      >
        { children }
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    backgroundImg: {
      flex: 1,
      justifyContent: "center"
    }
});

export default Overlay