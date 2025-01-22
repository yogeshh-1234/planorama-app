import React from 'react';
import {QuesSVG, ThumbsUpSVG} from '../assets/SVG/IconsSVG';
import {View} from 'react-native';
export default ({
  icon,
  size,
  fill = '#C5B1C3',
}: {
  icon: string;
  size: number;
  fill?: string;
}) => {
  switch (icon) {
    case 'Y':
      return <ThumbsUpSVG width={size} height={size} fill={fill} />;
    case 'M':
      return <QuesSVG width={size} height={size} fill={fill} />;
    case 'N':
      return (
        <ThumbsUpSVG
          width={size}
          height={size}
          fill={fill}
          style={{
            transform: [{rotate: '180deg'}],
          }}
        />
      );
    default:
      return (
       <></>
      );
  }
};
