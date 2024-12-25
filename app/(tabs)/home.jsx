import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import ContentComponent from '../../components/Home/ContentComponent'

export default function home() {
  return (
    <View style= {styles.container}>
      <ContentComponent/>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flex : 1,
    padding : 10,
    paddingTop : 20,
    backgroundColor : 'black'
  }
})