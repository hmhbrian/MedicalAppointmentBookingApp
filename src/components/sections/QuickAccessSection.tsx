import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../constants/colors';

interface QuickAccessButton {
  title: string;
  icon: string;
  onPress: () => void;
}

interface QuickAccessSectionProps {
  buttons: QuickAccessButton[];
}

const QuickAccessSection: React.FC<QuickAccessSectionProps> = ({ buttons }) => {
  return (
    <View style={styles.quickAccessGrid}>
      {buttons.map((button, index) => (
        <TouchableOpacity key={index} style={styles.quickAccessCard} onPress={button.onPress}>
          <Icon name={button.icon} size={30} color={colors.primary} />
          <Text style={styles.quickAccessText}>{button.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAccessCard: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickAccessText: {
    marginTop: 8,
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
});

export default QuickAccessSection;