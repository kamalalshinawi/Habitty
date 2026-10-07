import React from 'react';
import { ImageStyle, StyleProp } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type IconProps = {
  color: string;
  size: number;
  style?: StyleProp<ImageStyle>;
};

export function HomeIcon({ color, size }: IconProps) {
  return <FontAwesome name="home" size={size} color={color} />;
}

export function TodoIcon({ color, size }: IconProps) {
  return <FontAwesome name="check-square-o" size={size} color={color} />;
}

export function CalendarIcon({ color, size }: IconProps) {
  return <FontAwesome name="calendar" size={size} color={color} />;
}

export function ProfileIcon({ color, size }: IconProps) {
  return <FontAwesome name="user" size={size} color={color} />;
}