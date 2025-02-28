import React, { memo, useCallback, useState } from 'react';
import { KeyboardAvoidingView, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Text from '../../../components/Text';
import CustomCheckBox from '../../../components/CheckBox';
import TextInput from '../../../components/TextInput';
import { debounce } from 'lodash';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GOOGLE_API_KEY = 'AIzaSyDL0XFNG-SKq4UYxjcfj-d6lhP0UbgMjAg';
const GapOne = 16;
const GapTwo = 12;
export default memo(
    ({
        locationData,
        updateLocation,
    }: {
        locationData: { location: string; isOnline: boolean };
        updateLocation: (val: string, isOn: boolean) => void;
    }) => {
        const [value, setValue] = useState(locationData.location);
        const [online, setOnline] = useState(locationData.isOnline);
        return (
            <Animated.View
                style={{
                    gap: GapTwo,
                }}
                entering={FadeIn.delay(700)}
                exiting={FadeOut}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                    <Text variant={'BodyRegular'} style={[styles.color_W]}>
                        {online ? 'Link URL' : 'Location'}
                    </Text>
                    <Pressable
                        onPress={() => {
                            setOnline(pre => {
                                updateLocation(value, !pre);
                                return !pre;
                            });
                        }}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                        }}>
                        <CustomCheckBox
                            checked={online}
                            height={20}
                            width={20}
                            checkMarkColor={'#fff'}
                            checkedBorderColor={'#fff'}
                            unCheckedBorderColor={'#fff'}
                            checkedBackgroundColor={'#fff'}
                            unCheckedBackgroundColor={'#fff'}
                            duration={300}
                        />
                        <Text variant={'BodyRegular'} style={styles.color_W}>
                            Online
                        </Text>
                    </Pressable>
                </View>
                {online ? (
                    <TextInput
                        value={value}
                        onChangeText={text => {
                            setValue(text);
                            updateLocation(text, online);
                        }}
                        textInputProps={{
                            placeholder: 'Add Web URL link',
                            placeholderTextColor: '#ffffff80',
                            keyboardType: 'url',
                            dataDetectorTypes: 'link',
                            textContentType: 'URL',
                        }}
                        textInputStyle={{
                            fontSize: 14,
                            lineHeight: 21,
                            color: '#fff',
                        }}
                        iconName="loc"
                    />
                ) : (
                    <LocationCompo
                        onChange={text => {
                            setValue(text);
                            updateLocation(text, online);
                        }}
                    />
                )}
            </Animated.View>
        );
    },
);

const LocationCompo = memo(({ onChange }: { onChange: (text: string) => void }) => {
    return (
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            <GooglePlacesAutocomplete
                placeholder="Search for a location"
                onPress={(data) =>
                    onChange(data.description)
                }
                query={{
                    key: GOOGLE_API_KEY,
                    language: 'en',
                }}
                styles={{
                    container: {
                        flex: 1,
                    },
                    textInputContainer: {
                        flexDirection: 'row',
                    },
                    textInput: {
                        backgroundColor: '#C5B1C33D',
                        height: 44,
                        borderRadius: 5,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        fontSize: 16,
                        flex: 1,
                    },
                    poweredContainer: {
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        borderBottomRightRadius: 5,
                        borderBottomLeftRadius: 5,
                        borderColor: '#C5B1C3',
                        borderTopWidth: 0.5,
                        backgroundColor: '#C5B1C33D',
                    },
                    powered: {},
                    listView: {},
                    row: {
                        backgroundColor: '#C5B1C33D',
                        padding: 13,
                        height: 44,
                        flexDirection: 'row',
                    },
                    separator: {
                        height: 0.5,
                        backgroundColor: '#c8c7cc',
                    },
                    description: {
                        color: '#ffffff',
                    },
                    loader: {
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        height: 20,
                    },
                }}
            />
        </KeyboardAvoidingView>
    );
});

const styles = StyleSheet.create({
    color_W: {
        color: '#fff',
    },
});
