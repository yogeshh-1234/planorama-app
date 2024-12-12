import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('screen');

export const colors = {
  primary: '#D9A404',
  primaryTwo: '#000000',
  background: '#0E0E0E',
};
export const Spacing = {
  horizontal: width * 0.03,
};


export const fonts = [
  {
    id: '1',
    name: 'PoppinsRegular',
    lable: 'Poppins',
  },
  {
    id: '2',
    name: 'Arial',
    lable: 'Arial',
  },
  {
    id: '3',
    name: 'PlayfairDisplayRegular',
    lable: 'Playfair Display',
  },
  {
    id: '4',
    name: 'LobsterRegular',
    lable: 'Lobster',
  },
];
