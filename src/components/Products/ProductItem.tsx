import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';

import { AssetImage } from '../Reusable'
import { Fire, Flash } from '../../services'

import { addWish, removeWish, isInWishes } from '../../actions/wishes.action'
import { switchTab } from '../../actions/tab.action'
import MaterialIcon from '@expo/vector-icons/MaterialCommunityIcons'
import AntIcon from '@expo/vector-icons/AntDesign'

import { Actions } from 'react-native-router-flux'

import { getBrandName } from '../../filters'
import { mainStyle } from '../../styles'

interface Props {
  index: number;
  product: any;
  wishes: any;

  switchTab: (tab: number) => void;
  addWish: (product: any) => void;
  removeWish: (product: any) => void;
  onPress: () => void;
  isInWishes: (product: any) => boolean;
}
const ProductItem: React.FC<Props> = (props: Props) => {
  
  const toggleWish = () => {
    const { addWish, removeWish, product, isInWishes } = props
    const onPress = () => {
      props.switchTab(3)
      Actions.reset('root')
    }

    if (isInWishes(product)) {
      removeWish(product)
      Flash.show('Supprimé des favoris !')
    } else {
      addWish(product)
      Flash.show('Ajouté aux favoris !', 'Cliquez pour voir vos favoris', onPress)
    }
  }

  const { product, index, onPress, isInWishes } = props
  const inWishes = isInWishes(product)
  const name = product.name && product.name.length > 22 ? (product.name.substr(0, 18) + '...') : product.name
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={[styles.shadow]}>
          <View style={styles.content}>

            <View style={styles.picture}>
              <AssetImage src={product.pictures ? {uri: product.pictures[0]} : require('../../images/user.png')} resizeMode='cover' />
            </View>

            <View style={styles.info}>
              <Text numberOfLines={1} style={styles.name}>{name}</Text>
              <View style={styles.row}>
                <View style={styles.icon}>
                  <AntIcon size={14} name="clockcircle" />
                </View>
                <Text style={[styles.txt]}> Aujourd'hui 21:40 - 22:05</Text>
              </View>
              <View style={styles.row}>
                <View style={styles.icon}>
                  <MaterialIcon size={18} name="map-marker" />  
                </View>
                <Text style={[styles.txt]}>4 km</Text>               
              </View>
            </View>


            <View style={styles.logoWrapper}>
              <View style={styles.logo}>
                <AssetImage src={product.logo ? {uri: product.logo[0]} : require('../../images/user.png')} resizeMode='cover' />
              </View>
            </View>

            <TouchableOpacity
              style={styles.wishBtn}
              onPress={() => toggleWish()}>
              { inWishes ? (
                <AssetImage src={require('../../images/like.png')} />
              ) : (
                <AssetImage src={require('../../images/like_empty.png')} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const margin = 20
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  shadow: {
    width: Dimensions.get('window').width - margin * 2,
    marginTop: 18,

    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  picture: {
    height: 110,
  },
  logoWrapper: {
    position: 'absolute',
    top: 95,
    left: 12,

    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logo: {
    ...mainStyle.circle(42),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  info: {
    padding: 10,
    backgroundColor: '#fff',
  },
  name: {
    ...mainStyle.montBold,
    fontSize: 16,
    marginLeft: 60,
    color: mainStyle.darkColor
  },
  txt: {
    fontSize: 13,
    color: mainStyle.darkColor,
  },
  row: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
  },

  wishBtn: {
    ...mainStyle.abs,
    bottom: undefined, left: undefined,
    top: 4, right: 4,
    width: 28,
    height: 28,
    padding: 3,
  },
});

const mapStateToProps = (state: any) => ({
  wishes: state.wishesReducer.list,
  wishesToggle: state.wishesReducer.toggle,
})
const mapDispatchToProps = (dispatch: any) => ({
  addWish: (product: any) => dispatch(addWish(product)),
  removeWish: (product: any) => dispatch(removeWish(product)),
  switchTab: (tab: number) => dispatch(switchTab(tab)),
  isInWishes: (product: any) => dispatch(isInWishes(product)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductItem)