import {MD3Type} from 'react-native-paper/lib/typescript/types';
export type CustomVariantProp =
  | 'Heading'
  | 'TitleOne'
  | 'TitleTwo'
  | 'SubTitleOne'
  | 'SubTitleTwo'
  | 'BodyBold'
  | 'BodyRegular'
  | 'DetailBold'
  | 'DetailRegular'

// PoppinsLight 300
// PoppinsRegular 400
// PoppinsMedium  500
// PoppinsSemiBold  600
// PoppinsBold  700

const scaleNum = 1;
const adjustNum = 0;
const fontResize = (fontSize: number) => {
  return (fontSize + adjustNum) * scaleNum;
};
const fontConfig: Record<string, MD3Type> = {
  default: {
    fontFamily: 'PoppinsMedium',
    fontWeight: '500',
    letterSpacing: 0,
    fontSize: fontResize(14),
    lineHeight: fontResize(18.2),
  },

  Heading: {
    fontFamily: 'PoppinsBold',
    fontWeight: '700',
    letterSpacing: 0,
    fontSize: fontResize(32),
    lineHeight: fontResize(48),
  },
  TitleOne: {
    fontFamily: 'PoppinsBold',
    fontWeight: '700',
    letterSpacing: 0,
    fontSize: fontResize(25),
    lineHeight: fontResize(37.5),
  },

  TitleTwo: {
    fontFamily: 'PoppinsBold',
    fontWeight: '700',
    letterSpacing: 0,
    fontSize: fontResize(20),
    lineHeight: fontResize(30),
  },

  SubTitleOne: {
    fontFamily: 'PoppinsSemiBold',
    fontWeight: '600',
    letterSpacing: 0,
    fontSize: fontResize(18),
    lineHeight: fontResize(27),
  },

  SubTitleTwo: {
    fontFamily: 'PoppinsSemiBold',
    fontWeight: '600',
    letterSpacing: 0,
    fontSize: fontResize(16),
    lineHeight: fontResize(24),
  },

  BodyBold: {
    fontFamily: 'PoppinsBold',
    fontWeight: '700',
    letterSpacing: 0,
    fontSize: fontResize(14),
    lineHeight: fontResize(21),
  },

  BodyRegular: {
    fontFamily: 'PoppinsMedium',
    fontWeight: '500',
    letterSpacing: 0,
    fontSize: fontResize(14),
    lineHeight: fontResize(18.2),
  },

  DetailBold: {
    fontFamily: 'PoppinsRegular',
    fontWeight: '400',
    letterSpacing: 0,
    fontSize: fontResize(14),
    lineHeight: fontResize(21),
  },
  DetailRegular: {
    fontFamily: 'PoppinsLight',
    fontWeight: '300',
    letterSpacing: 0,
    fontSize: fontResize(12),
    lineHeight: fontResize(18),
  },
};

export default fontConfig;
