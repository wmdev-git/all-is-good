import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Text, Animated, View, Alert, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import { AssetImage, BottomButton, CheckBox, SelectCreditCard } from '../Reusable'
import { Fire, Flash, Modal, Time } from '../../services'

import AntDesign from '@expo/vector-icons/AntDesign'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Fontiso from '@expo/vector-icons/Fontiso'
import Feather from '@expo/vector-icons/Feather'

import { mainStyle } from '../../styles'

interface Props {
  pro: any;
  onPay: (counter: number, card: string) => void;
}

const PaymentModal: React.FC<Props> = (props) => {
    
  const pro = props.pro
  const quantity_max = props.pro.quantity || 0
  const price = props.pro.price || 0
  const [counter, setCounter] = React.useState(1)
  const [confirmed, setConfirmed] = React.useState(false)
  const [showCards, setShowCards] = React.useState(false)
  const [showModes, setShowModes] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [showDelivery, setShowDelivery] = React.useState(false)
  const [card, setCard] = React.useState('')
  const [address, setAddress] = React.useState<any>(null)
  const [mode, setMode] = React.useState('')

  const total = Number(counter * price).toFixed(2)

  const modesAnimation = React.useRef(new Animated.Value(1)).current
  const deliveryAnimation = React.useRef(new Animated.Value(1)).current
  const cardsAnimation = React.useRef(new Animated.Value(1)).current
  const confirmAnimation = React.useRef(new Animated.Value(1)).current

  React.useEffect(() => {
    if (showCards) {
      Animated.spring(cardsAnimation, {
        toValue: 0,
        velocity: 3,
        tension: 2,
        friction: 8,
      }).start();
    } else {
      Animated.spring(cardsAnimation, {
        toValue: 1,
        velocity: 3,
        tension: 2,
        friction: 8,
      }).start();
    }
  }, [showCards])

  React.useEffect(() => {
    if (showDelivery) {
      Animated.spring(deliveryAnimation, {
        toValue: 0,
        velocity: 3,
        tension: 2,
        friction: 8,
      }).start();
    } else {
      Animated.spring(deliveryAnimation, {
        toValue: 1,
        velocity: 3,
        tension: 2,
        friction: 8,
      }).start();
    }
  }, [showDelivery])

  React.useEffect(() => {
    if (showModes) {
      Animated.spring(modesAnimation, {
        toValue: 0,
        velocity: 3,
        tension: 2,
        friction: 8,
      }).start();
    } else {
      Animated.spring(modesAnimation, {
        toValue: 1,
        velocity: 3,
        tension: 2,
        friction: 8,
      }).start();
    }
  }, [showModes])

  React.useEffect(() => {
    if (showConfirm) {
      Animated.spring(confirmAnimation, {
        toValue: 0,
        velocity: 3,
        tension: 2,
        friction: 8,
      }).start();
    } else {
      Animated.spring(confirmAnimation, {
        toValue: 1,
        velocity: 3,
        tension: 2,
        friction: 8,
      }).start();
    }
  }, [showConfirm])

  const updateCounter = (delta: number) => {
    const newCounter = counter + delta
    if (newCounter > quantity_max)
      setCounter(quantity_max)
    else if (newCounter < 0)
      setCounter(0)
    else
      setCounter(newCounter)
  }

  const nextStep = () => {
    if (!showModes) {
      setShowModes(true)
    } else if (!showDelivery && mode === 'delivery') {
      setShowDelivery(true)
    } else if (!showCards) {
      setShowCards(true)
    } else if (!showConfirm) {
      setShowConfirm(true)
    } else {
      props.onPay(counter, card)
    }
  }

  const translateCards = cardsAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  })
  const translateModes = modesAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  })
  const translateDelivery = deliveryAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  })
  const translateConfirm = confirmAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  })
  
  const opening = Time.getPickUpRange(props.pro)
  const lang = useSelector(state => state.langReducer.lang)

  const checkCanProceed = () => {
    if (!showModes)
      return counter > 0
    if (!showCards)
      return mode !== ''
    if (showDelivery && !showConfirm)
      return address !== null
    if (!showConfirm)
      return card !== ''
    return confirmed
  }

  const canProceed = checkCanProceed()
  const deliveryOpening = 'Nous pourrons livrer votre commande entre ' + pro.delivery_start + ' et ' + pro.delivery_end
  const pickUpOpening = 'Vous pourrez venir récupérer votre commande entre ' + pro.pick_up_start + ' et ' + pro.pick_up_end

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Restaurant</Text>
        <Text style={styles.open}>{lang.GLOBAL_TODAY} {opening}</Text>
      </View>
      <View style={styles.quantity}>
        <Text style={styles.subtitle}>{lang.PAYMENT_CHOOSE_QUANTITY}</Text>
        <View style={styles.quantityBtns}>
          <TouchableOpacity onPress={() => updateCounter(-1)}>
            <View style={[styles.btn, {backgroundColor: mainStyle.lightColor, marginRight: 30}]}>
              <AntDesign color={'#fff'} size={18} name="minus" />
            </View>
          </TouchableOpacity>
          <Text style={styles.counter}>{counter}</Text>
          <TouchableOpacity onPress={() => updateCounter(1)}>
            <View style={[styles.btn, {backgroundColor: mainStyle.themeColor, marginLeft: 30}]}>
              <AntDesign color={'#fff'} size={18} name="plus" />
            </View>
          </TouchableOpacity>      
        </View>

        <Text style={[styles.subtitle, {marginTop: 40, fontSize: 17}]}>
          Total: {Number(total).toFixed(2)}$
          (<Text style={{textDecorationLine: 'line-through'}}>{Number(Number(price * counter) * 1.7).toFixed(2)}$</Text>)
        </Text>

        <Animated.View style={[styles.modes, {transform: [{translateY: translateModes}]}]}>
          <TouchableOpacity style={styles.line} onPress={() => {setShowModes(false); setShowDelivery(false); setShowCards(false); setShowConfirm(false)}}>
            <Text style={styles.lineTitle}>{lang.PAYMENT_QUANTITY}</Text>
            <Text style={styles.lineValue}>{counter}</Text>
          </TouchableOpacity>
          <Text style={styles.subtitle}>{lang.PAYMENT_CHOOSE_MODE}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={[styles.modeContainer, mode === 'pick_up' ? styles.selected : {}]} onPress={() => setMode('pick_up')}>
              <View style={styles.modeCheck}>
                <MaterialIcons name="place" size={18} color={mode === 'pick_up' ? '#fff' : '#000'} />
              </View>
              <Text style={[styles.modeTxt, mode === 'pick_up' ? { color: '#fff' } : {}]}>{lang.PAYMENT_PICK_UP}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modeContainer, mode === 'delivery' ? styles.selected : {}, !pro.has_delivery ? {opacity: 0.4} : {}]} disabled={!pro.has_delivery} onPress={() => setMode('delivery')}>
              <View style={styles.modeCheck}>
                <Feather name="truck" size={14} color={mode === 'delivery' ? '#fff' : '#000'} />
              </View>
              <Text style={[styles.modeTxt, mode === 'delivery' ? { color: '#fff' } : {}]}>{lang.PAYMENT_DELIVERY}</Text>
            </TouchableOpacity>
          </View>
          { mode !== '' &&
            <View style={{marginTop: 20,}}>
              <Text style={styles.conditions}>{mode === 'delivery' ? deliveryOpening : pickUpOpening}</Text>
            </View>
          }
        </Animated.View>

        <Animated.View style={[styles.delivery, {transform: [{translateY: translateDelivery}]}]}>
          <TouchableOpacity style={styles.line} onPress={() => {setShowDelivery(false); setShowCards(false); setShowConfirm(false)}}>
            <Text style={styles.lineTitle}>{lang.PAYMENT_CHOOSE_MODE}</Text>
            <Text style={styles.lineValue}>{lang.PAYMENT_DELIVERY} / +3$</Text>
          </TouchableOpacity>
          <Text style={styles.subtitle}>{lang.PAYMENT_CHOOSE_ADDRESS}</Text>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity style={styles.addressContainer} onPress={() => Actions.addresses({ selected: address, onSelect: setAddress })}>
              <Text style={styles.addressTxt} numberOfLines={1}>{address !== null ? address.formatted_address : 'Sélectionner une adresse'}</Text>
              <AntDesign name="down" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View style={[styles.cards, mode === 'delivery' ? {top: 100} : {}, {transform: [{translateY: translateCards}]}]}>
          { mode === 'delivery' ? (
            <TouchableOpacity style={styles.line} onPress={() => {setShowCards(false); setShowConfirm(false)}}>
              <Text style={styles.lineTitle}>{lang.PAYMENT_CHOOSE_ADDRESS}</Text>
              <Text style={styles.lineValue}>{address ? address.formatted_address : 'Aucune adresse'}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.line} onPress={() => {setShowCards(false); setShowConfirm(false)}}>
              <Text style={styles.lineTitle}>{lang.PAYMENT_CHOOSE_MODE}</Text>
              <Text style={styles.lineValue}>{mode === 'delivery' ? lang.PAYMENT_DELIVERY : lang.PAYMENT_PICK_UP}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.subtitle}>{lang.PAYMENT_CHOOSE_METHOD}</Text>
          <SelectCreditCard cardSelected={(card) => setCard(card)} />
        </Animated.View>

        <Animated.View style={[styles.confirm, mode === 'delivery' ? {top: 150} : {}, {transform: [{translateY: translateConfirm}]}]}>
          <TouchableOpacity style={styles.line} onPress={() => setShowConfirm(false)}>
            <Text style={styles.lineTitle}>{lang.PAYMENT_METHOD}</Text>
            <Text style={styles.lineValue}>XXXX XXXX XXXX 1234</Text>
          </TouchableOpacity>

          <CheckBox
            active={confirmed}
            title={'En réservant ce panier, tu confirmes avoir pris connaissance des différents allergènes ainsi qu\'avoir lu les Conditions Générales d’utilisation de All is Good'}
            onPress={() => setConfirmed(!confirmed)}
            onTapText={() => setConfirmed(!confirmed)}
            />
        </Animated.View>
        
    </View>
      {/*}
      <View style={{backgroundColor: '#fff'}}>
        <Text style={styles.conditions}>En réservant ce panier, tu acceptes les Conditions Générales d’utilisation de All is Good</Text>
      </View>
    */}
      <BottomButton
        title={!showConfirm ? 'Continuer' : 'Payer ' + total + '$'}
        backgroundColor={mainStyle.themeColor}
        onPress={nextStep}
        disabled={!canProceed}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  
  header: {
    margin: 20,
    justifyContent: 'center',
  },
  title: {
    ...mainStyle.montBold,
    textAlign: 'center',
    fontSize: 15,
  },
  open: {
    ...mainStyle.montLight,
    textAlign: 'center',
    marginTop: 6,
  },

  line: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    height: 50,
  },
  lineTitle: {
    ...mainStyle.montText,
    flex: 1,
  },
  lineValue: {
    ...mainStyle.montBold,
    flex: 1,
    textAlign: 'right',
  },
  selected: {
    backgroundColor: mainStyle.themeColor,
  },
  quantity: {

    height: 300,

    paddingVertical: 20,
    justifyContent: 'center',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    //borderBottomColor: '#ddd',
    //borderBottomWidth: 1,
    marginBottom: 20,
  },

  subtitle: {
    ...mainStyle.montBold,
    textAlign: 'center',
    fontSize: 13,
    marginVertical: 12,
  },
  quantityBtns: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  delivery: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  cards: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  confirm: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  counter: {
    width: 80,
    ...mainStyle.montBold,
    textAlign: 'center',
    fontSize: 22,
  },
  btn: {
    ...mainStyle.circle(42),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressContainer: {

    maxWidth: 240,

    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 22,

    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 12,
  },
  addressTxt: {
    textAlign: 'center',
    marginRight: 8,
  },
  modeContainer: {

    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 22,

    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 12,
  },
  modeCheck: {
    width: 14,
    marginRight: 12,
  },
  modeTxt: {
    ...mainStyle.montText,
    color: '#000',
  },
  conditions: {

    ...mainStyle.montLight,
    fontSize: 12,
    color: mainStyle.lightColor,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
    paddingHorizontal: 20,
    marginVertical: 20,
  }
});

export default PaymentModal