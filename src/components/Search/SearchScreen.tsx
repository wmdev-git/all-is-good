import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, Keyboard, Text, ScrollView, View, TextInput, ImageBackground, TouchableOpacity, FlatList, Dimensions } from 'react-native';

import { HeaderBar, TitledInput, MyText, ListEmpty, SmallButton, FadeInView, BottomButton, AssetImage, VeilView } from '../Reusable'
import { Fire, Modal } from '../../services'

import { Actions } from 'react-native-router-flux'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import Icon from '@expo/vector-icons/FontAwesome'

import ProItem from '../Pros/ProItem'
import CategoryItem from './CategoryItem'
import FiltersModal from './FiltersModal'
import SearchBar from './SearchBar'

import { mainStyle } from '../../styles'

import { searchByName, saveFilters } from '../../actions/filters.action'

interface Props {}
const SearchScreen: React.FC<Props> = (props) => {
  const [query, setQuery] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [pros, setPros] = React.useState([])

  const lang = useSelector(state => state.langReducer.lang)
  const searchable = useSelector(state => state.filtersReducer.searchable)
  const categories = useSelector(state => state.filtersReducer.categories)
  const position = useSelector(state => state.authReducer.position)
  const loadingCategories = useSelector(state => state.filtersReducer.loadingCategories)
  const dispatch = useDispatch()

  const refresh = async () => {
    const filtered = searchable.filter((item) => {
      const nameMatches = item.name && item.name.toLowerCase().includes(query.toLowerCase())
      let typeMatches = false
      for (const cat of (item.categories || [])) {
        if (cat.name.toLowerCase().includes(query.toLowerCase())) {
          typeMatches = true
          break
        }
      }
      return nameMatches || typeMatches
    })
    setPros(filtered)
  }

  React.useEffect(() => {
    refresh()
  }, [query])

  const showFilters = () => {
    Keyboard.dismiss()
    Modal.show('filters', {
      content: () => <FiltersModal />,
    })
  }

  return (
    <View style={styles.container}>
      <HeaderBar
        logo
        />
      <SearchBar
        query={query}
        onChange={setQuery}
        onFilters={showFilters}
        onClear={() => setQuery('')}
        />
      <FadeInView style={styles.content}>
        { !position ? (
          <ScrollView contentContainerStyle={{paddingBottom: 20}}>
            <ListEmpty
              text={lang.HOME_NO_POS_TITLE}
              subtext={lang.HOME_NO_POS_MESSAGE}
              wrapperStyle={{marginTop: 40}}
              imageSize={120}
              image={require('../../images/nocategories.png')}
              btnTxt={lang.HOME_NO_POS_BTN}
              onPressBtn={showFilters}
              />
          </ScrollView>
        ) : query !== '' ? (
          <FlatList
            data={pros}
            contentContainerStyle={{paddingBottom: 20, paddingTop: 50,}}
            renderItem={({ item }) =>
              <ProItem
                pro={item}
                onPress={() => Actions.pro({ pro: item })}
                />
            }
            ListEmptyComponent={() => (
              <ListEmpty
                text={loading ? lang.GLOBAL_LOADING : lang.GLOBAL_NO_RESULT}
                image={require('../../images/noresult.png')}
                btnTxt={lang.HOME_SEARCH_AGAIN}
                onPressBtn={() => setQuery('')}
                />
            )}
            keyExtractor={(item, index) => index.toString()}
            />
        ) : loadingCategories ? (
          <MyText style={{color: '#fff'}}>{lang.GLOBAL_LOADING}</MyText>
        ) : (
          <FlatList
            data={categories}
            numColumns={2}
            contentContainerStyle={{paddingBottom: 20, paddingTop: 50 }}
            renderItem={(item: any) => 
              <CategoryItem
                index={item.index}
                category={item.item}
                onPress={() => setQuery(item.item.name)}
                />
            }
            ListEmptyComponent={() => (
              <ListEmpty
                text={lang.HOME_EMPTY_TITLE}
                subtext={lang.HOME_EMPTY_MESSAGE}
                wrapperStyle={{marginTop: 0}}
                imageSize={120}
                image={require('../../images/nocategories.png')}
                btnTxt={lang.HOME_EMPTY_BTN}
                onPressBtn={showFilters}
                />
            )}
            keyExtractor={(item, index) => index.toString()}
            />
        )}
      </FadeInView>
    </View>
  )
}

const searchBarHeight = 40
const searchBarMargin = 20
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainStyle.themeColor,
  },
  content: {
    flex: 1,
  },
});

export default SearchScreen