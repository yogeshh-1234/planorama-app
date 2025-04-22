import react, {memo, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import HeaderCompo from '../../components/HeaderCompo';
import {BGline} from '../../assets/SVG/VectorSVG';
import SelectDropdown from 'react-native-select-dropdown';
import {DownSVG} from '../../assets/SVG/IconsSVG';
const {width, height} = Dimensions.get('screen');
export default function () {
  const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;
  const options = [
    {title: 'Wedding', id: 1},
    {title: 'Birthday', id: 2},
    {title: 'Business Party', id: 3},
    {title: 'Get together', id: 4},
  ];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  console.log('option', selectedOption);

  const DropdownCompo = memo(() => {
    return (
      <SelectDropdown
        // disabled
        data={options}
        defaultValue={selectedOption}
        onSelect={(selectedItem, index) => {
          console.log(selectedItem, index);
          setSelectedOption(selectedItem);
        }}
        renderButton={(selectedItem, isOpened) => {
          return (
            <View
              style={{
                backgroundColor: '#C5B1C380',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 12,
                paddingVertical: 15,
                borderRadius: 8,
                gap: 4,
              }}>
              <Text variant={'DetailBold'} style={{color: '#fff', flex: 1}}>
                {(selectedItem && selectedItem.title) || 'All'}
              </Text>
              <DownSVG width={12} height={12} />
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View
              style={{
                backgroundColor: '#C5B1C3',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderBottomWidth: 0.5,
                borderColor: '#75486F380',
                ...(isSelected && {backgroundColor: '#75486F'}),
              }}>
              <Text
                variant={'DetailBold'}
                style={{color: isSelected ? '#fff' : '#000'}}>
                {item.title}
              </Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={{
          backgroundColor: '#C5B1C3',
          borderRadius: 5,
        }}
      />
    );
  });

  const Templates = () => {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          width: width * 0.43,
          paddingVertical: 5,
          marginBottom: 5,
          borderRadius: 10,
        }}>
        <Text>hekskjdbsdjbidbi</Text>
      </View>
    );
  };

  return (
    <View
      style={{
        backgroundColor: '#3A2537',
        flex: 1,
        paddingTop: StatusBar.currentHeight,
      }}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent
        barStyle={'light-content'}
      />
      <HeaderCompo />
      <BGline
        width={'100%'}
        height={height * 0.1}
        style={{
          position: 'absolute',
          top: Top_Height + height * 0.025,
          left: 0,
          right: 0,
        }}
      />
      <Text style={styles.heading}>Send Message via WhatsApp</Text>

      <View style={styles.selection_view}>
        <Text style={{color: '#fff', fontSize: 20, paddingVertical: 10}}>
          Choose Category
        </Text>
        <DropdownCompo />
      </View>
      <ScrollView
        contentContainerStyle={{
          // paddingBottom: invitedEvent ? 250 : 100,
          //   paddingTop: 25,
          paddingHorizontal: width * 0.05,
        }}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={loading}
        //     // onRefresh={mainFn}
        //     title="Pull to refresh"
        //     colors={['#F2F2F2']}
        //     progressBackgroundColor={'#0E0E0E'}
        //     titleColor="grey"
        //   />
        // }
      >
        <View style={{paddingVertical: 20}}>
          <Text style={{color: '#fff', fontSize: 20, paddingVertical: 2}}>
            Choose Template
          </Text>
          <Text style={{color: '#fff', fontSize: 18, paddingVertical: 2}}>
            Select template from the below list to proceed further
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'space-between',
          }}>
          <Templates />
          <Templates />
          <Templates />
        </View>
      </ScrollView>

      {/* {loading && <LoadingCompo text={'Getting event details'} />} */}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 600,
    marginTop: 45,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  selection_view: {paddingHorizontal: 25, marginTop: 20},
});
