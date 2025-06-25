// components/GameCard.tsx
import React, { useState, useEffect } from 'react';
import {
  Text,
  Image,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useTheme } from '../lib/theme';
import type { Game } from '../lib/gamesApi';

type GameCardProps = {
  game: Game;
  onPress: (e: GestureResponderEvent) => void;
};

export default function GameCard({ game, onPress }: GameCardProps) {
  const { tokens } = useTheme();
  const styles = StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: tokens.color.neutral['0'].value,
      borderRadius: tokens.radius.md.value,
      padding: tokens.spacing['3'].value,
      alignItems: 'center',
      margin: tokens.spacing['2'].value,
    },
    logo: {
      width: 96,
      height: 96,
      marginBottom: tokens.spacing['2'].value,
    },
    jackpot: {
      fontSize: tokens.typography.fontSizes.sm.value,
      fontWeight: '600',
      color: tokens.color.neutral['600'].value,
    },
  });

  const { width, height } = styles.logo;
  const [svgXml, setSvgXml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!game.logoUrl) {
      setSvgXml(null);
      setError(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    fetch(game.logoUrl, { headers: { Accept: 'image/svg+xml' } })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then(raw => {
        if (!mounted) return;

        let xml = raw
          // strip XML prolog
          .replace(/<\?xml[^>]*\?>\s*/g, '')
          // strip xmlns attributes
          .replace(/\s+xmlns(:\w+)?="[^"]*"/g, '')
          // strip comments
          .replace(/<!--[\s\S]*?-->/g, '')
          // strip <style>, <metadata>, <title>, <desc>, and <defs> sections
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
          .replace(/<(title|desc)>[\s\S]*?<\/(?:title|desc)>/gi, '')
          .replace(/<defs[\s\S]*?<\/defs>/gi, '')
          // remove any width/height on <svg>
          .replace(
            /<svg\b([^>]*)\b(width|height)="[^"]*"([^>]*)>/g,
            '<svg$1$3>'
          );

        // inject viewBox + width/height
        if (!/<svg[^>]*viewBox=/.test(xml)) {
          xml = xml.replace(
            /<svg([^>]*)>/,
            `<svg$1 viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet">`
          );
        } else {
          xml = xml.replace(
            /<svg([^>]*viewBox="[^"]*"[^>]*)>/,
            `<svg$1 width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet">`
          );
        }

        setSvgXml(xml);
      })
      .catch(err => {
        console.error('[GameCard] SVG load error for', game.id, err);
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [game.logoUrl, width, height]);

  return (
    <Pressable
      style={styles.card as StyleProp<ViewStyle>}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open ${game.name} options`}
    >
      {loading ? (
        <ActivityIndicator style={styles.logo} />
      ) : svgXml && !error ? (
        <SvgXml xml={svgXml} width={width} height={height} />
      ) : (
        <Image
          source={require('../assets/placeholder.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      )}
      <Text style={styles.jackpot}>{game.jackpot}</Text>
    </Pressable>
  );
}
