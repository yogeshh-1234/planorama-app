import React, {memo, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
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
import {storage} from '../../functions/storage';
import {useMutation} from '@tanstack/react-query';
import {postData} from '../../api';
import Urls from '../../api/urls';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {MainStackNavigation, RootStackParamList} from '../../navigation';
const {width, height} = Dimensions.get('screen');

interface Template {
  id: number;
  title: string;
  category: string;
  preview: string;
  content: string;
}

interface Category {
  id: number;
  title: string;
  key: string;
}

export default function () {
  const navigation = useNavigation<MainStackNavigation>();
  const {params} = useRoute<
    RouteProp<RootStackParamList, 'WhatsappTemplateScreen'>
  >();

  const Top_Height = StatusBar.currentHeight ? StatusBar.currentHeight : 0;
  const [categories, setCategories] = useState<Category[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [selectedOption, setSelectedOption] = useState<Category | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (selectedOption) {
      const filtered = templates.filter(
        t => t.category === selectedOption.title,
      );
      setFilteredTemplates(filtered);
    } else {
      setFilteredTemplates(templates);
    }
  }, [selectedOption, templates]);

  const fetchTemplates = () => {
    const token = storage.getString('user.token');
    const id = storage.getString('user.id');
    if (token && id) {
      const formData = {
        mode: 'GET_TEMPLATES',
        token,
        id,
      };
      setLoading(true);
      mutation.mutate(formData);
    }
  };

  const mutation = useMutation({
    mutationFn: (formData: any) => postData<any, any>(Urls.WHATSAPP, formData),
    onSuccess: ({data, StatusCode}) => {
      if (StatusCode === 200) {
        setTemplates(data.templates || []);
        setFilteredTemplates(data.templates || []);
        setCategories(data.categories || []);
        if (data.categories && data.categories.length > 0) {
          setSelectedOption(data.categories[0]);
        }
      }
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);

    // Show confirmation alert
    Alert.alert(
      'Use This Template?',
      `"${template.title}"\n\n${template.preview}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Use Template',
          onPress: () => {
            // Navigate to SendMsgScreen with the selected template
            navigation.navigate('SendMsgScreen', {
              guestList: params.guestList,
              eventID: params.eventID,
              eventName: params.eventName,
              eventPic: params.eventPic,
              selectedTemplate: template,
            });
          },
        },
      ],
    );
  };

  const DropdownCompo = memo(() => {
    if (categories.length === 0) return null;

    return (
      <SelectDropdown
        data={categories}
        defaultValue={selectedOption}
        onSelect={selectedItem => {
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
              <Text style={{color: '#fff', flex: 1, fontSize: 14}}>
                {(selectedItem && selectedItem.title) || 'All Categories'}
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
                style={{
                  color: isSelected ? '#fff' : '#000',
                  fontSize: 14,
                  fontWeight: '600',
                }}>
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

  const TemplateCard = ({template}: {template: Template}) => {
    const isSelected = selectedTemplate?.id === template.id;

    return (
      <Pressable
        style={({pressed}) => ({
          backgroundColor: isSelected ? '#75486F' : '#C5B1C380',
          width: width * 0.43,
          padding: 12,
          marginBottom: 10,
          borderRadius: 10,
          minHeight: 120,
          borderWidth: isSelected ? 2 : 0,
          borderColor: '#F9BC52',
          opacity: pressed ? 0.7 : 1,
          transform: pressed ? [{scale: 0.98}] : [{scale: 1}],
        })}
        onPress={() => handleTemplateSelect(template)}>
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 8,
          }}>
          {template.title}
        </Text>
        <Text
          style={{
            color: '#EDEDED',
            fontSize: 12,
            marginBottom: 8,
          }}
          numberOfLines={3}>
          {template.preview}
        </Text>
        <View
          style={{
            backgroundColor: isSelected ? '#F9BC52' : '#75486F',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
            alignSelf: 'flex-start',
          }}>
          <Text
            style={{
              color: isSelected ? '#000' : '#fff',
              fontSize: 10,
              fontWeight: '600',
            }}>
            {template.category}
          </Text>
        </View>
      </Pressable>
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
          paddingHorizontal: width * 0.05,
        }}>
        <View style={{paddingVertical: 20}}>
          <Text style={{color: '#fff', fontSize: 20, paddingVertical: 2}}>
            Choose Template
          </Text>
          <Text style={{color: '#EDEDED', fontSize: 14, paddingVertical: 2}}>
            Select template from the below list to proceed further
          </Text>
        </View>

        {loading ? (
          <View style={{paddingVertical: 40, alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={{color: '#fff', marginTop: 10}}>
              Loading templates...
            </Text>
          </View>
        ) : filteredTemplates.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 10,
              justifyContent: 'space-between',
            }}>
            {filteredTemplates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </View>
        ) : (
          <View style={{paddingVertical: 40, alignItems: 'center'}}>
            <Text style={{color: '#fff', fontSize: 16}}>
              No templates available for this category
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '600',
    marginTop: 45,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  selection_view: {paddingHorizontal: 25, marginTop: 20},
});
