import React, { useRef } from 'react';

import PropTypes from 'prop-types';

import { FlatList, Text, StyleSheet, View } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient';

const ListItem = React.memo(({ label, style, textStyle }) => (
	<View style={style}>
		<Text style={textStyle}>{label}</Text>
	</View>
));

/**
 *
 * @param {Object} props
 *
 * @param {Array} props.items
 * @param {Function} props.onChange
 * @param {Number} [props.initialSelectedIndex]
 * @param {Number} [props.width]
 * @param {Number} [props.height]
 * @param {String} [props.backgroundColor]
 * @param {String} [props.fontColor]
 */
const SwipePicker = ({ items, onChange, initialSelectedIndex = null, width, height, backgroundColor,
	fontColor }) => {
	let itemHeight = 40;
	let listHeight = 200;

	if (height) {
		listHeight = height;
		itemHeight = listHeight / 5;
	}

	const styles = StyleSheet.create({
		list: {
			height: listHeight,
			width: width,
			backgroundColor: backgroundColor,
		},
		listItem: {
			height: itemHeight,
			alignItems: 'center',
			justifyContent: 'center',
		},
		listItemText: {
			color: fontColor,
			fontSize: itemHeight / 1.5
		},
		pickerGradient: {
			position: 'absolute',
			height: 2 * itemHeight,
			width: '100%'
		},
		topGradient: {
			top: 0,
		},
		bottomGradient: {
			bottom: 0
		}
	});

	const flatList = useRef(null);

	let extendedItems = [
		{
			value: -11,
			label: ''
		},
		{
			value: -12,
			label: ''
		},
		...items,
		{
			value: -21,
			label: ''
		},
		{
			value: -22,
			label: ''
		}];

	return (
		<View style={styles.list} >
			<FlatList
				showsVerticalScrollIndicator={false}
				onMomentumScrollEnd={(event) => {
					const index = Math.round(event.nativeEvent.contentOffset.y / itemHeight);
					if (index >= 0 && index < items.length) {
						onChange({ index, item: items[index] });
					}
				}}
				initialScrollIndex={initialSelectedIndex}
				ref={flatList}
				data={extendedItems.map(item => ({
					key: item.value.toString(),
					...item
				}))}
				renderItem={item => (
					<ListItem
						label={item.item.label}
						style={styles.listItem}
						textStyle={styles.listItemText} />
				)}
				getItemLayout={(_, index) => ({ length: itemHeight, offset: index * itemHeight, index })}
				snapToInterval={itemHeight}
				ListEmptyComponent={() => <Text>No Items</Text>}
			/>
			<LinearGradient
				colors={[
					backgroundColor,
					`${backgroundColor}80`,
				]}
				style={[styles.pickerGradient, styles.topGradient]}
				pointerEvents="none"
			/>
			<LinearGradient
				colors={[
					`${backgroundColor}80`,
					backgroundColor,
				]}
				style={[styles.pickerGradient, styles.bottomGradient]}
				pointerEvents="none"
			/>
		</View>
	)
}

SwipePicker.propTypes = {
	items: PropTypes.arrayOf(PropTypes.shape({
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		label: PropTypes.string
	})),
	onChange: PropTypes.func,
	initialSelectedIndex: PropTypes.number,
	height: PropTypes.number,
	width: PropTypes.number,
	backgroundColor: PropTypes.string,
	fontColor: PropTypes.string,
}

export default SwipePicker;