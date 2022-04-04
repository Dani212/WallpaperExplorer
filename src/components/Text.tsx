import { useTheme } from '@react-navigation/native';
import { textSizes } from 'consts';
import React, { FC } from 'react';

import { Text as DefaultText, TextProps } from 'react-native';
import { styles } from 'styles';
import { pColor } from 'utils';

interface Props extends TextProps {
	// style: TextStyle;
	btnColor?: boolean;
	textSize?: keyof typeof textSizes; // 'small' | 'normal' | 'large' | 'xl' | 'xxl' | 'xxxl' | undefined;
}

export const Text: FC<Props> = ({
	style,
	textSize,
	btnColor,
	...otherProps
}) => {
	const { dark } = useTheme();

	return (
		<DefaultText
			style={[
				styles.text,
				{
					color: btnColor ? pColor(true).text : pColor(dark).text,
					fontSize: textSizes[textSize === undefined ? 'normal' : textSize],
				},
				style,
			]}
			{...otherProps}
		/>
	);
};
