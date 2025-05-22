import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

interface CardViewProps {
  children: React.ReactNode;
  style?: object;
}

const CardView: React.FC<CardViewProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default CardView;