import {customText} from 'react-native-paper';
import {CustomVariantProp} from '../config/fonts';
import { withAnimated } from './AnimatedPaperComponent';

const Text = customText<CustomVariantProp>();
// export default Text
export default withAnimated(Text);
