import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useColors } from '@/lib/theme/ThemeProvider';
import { useSchoolTheme } from '@/lib/theme/SchoolThemeProvider';
import { typography } from '@/lib/theme/typography';
import { AppHeader } from '@/components/navigation/AppHeader';

interface FeatureItem {
  title: string;
  description: string;
  route: string;
  variant: 'classic' | 'rivalry' | 'prediction' | 'aging' | 'receipt' | 'pressbox' | 'penalty' | 'standard';
}

const FEATURES: FeatureItem[] = [
  {
    title: 'The Feed',
    description: 'Main timeline of takes, receipts, and reports from the press box.',
    route: '/(tabs)/feed',
    variant: 'classic',
  },
  {
    title: 'Rivalry Ring',
    description: 'Head-to-head challenges between fans. Prove your take is king.',
    route: '/(tabs)/rivalry',
    variant: 'rivalry',
  },
  {
    title: 'Predictions',
    description: 'File predictions on games and outcomes. Receipts or busts await.',
    route: '/predictions',
    variant: 'prediction',
  },
  {
    title: 'Aging Takes',
    description: 'Lock in a take and let time be the judge. Receipt or bust.',
    route: '/(tabs)/feed',
    variant: 'aging',
  },
  {
    title: 'Receipts',
    description: 'Pull the receipts on old takes. The newsprint never forgets.',
    route: '/receipts',
    variant: 'receipt',
  },
  {
    title: 'Portal Wire',
    description: 'Track transfer portal entries, claims, and committed players.',
    route: '/(tabs)/portal',
    variant: 'pressbox',
  },
  {
    title: 'Moderation',
    description: 'Community-flagged takes go under review. Appeal or accept the call.',
    route: '/(tabs)/feed',
    variant: 'penalty',
  },
  {
    title: 'Dynasty Mode',
    description: 'Level up your dynasty tier by earning XP through posts and predictions.',
    route: '/dynasty',
    variant: 'standard',
  },
  {
    title: 'Hall of Fame',
    description: 'Top contributors ranked by XP, correct predictions, and community votes.',
    route: '/hall-of-fame',
    variant: 'standard',
  },
  {
    title: "Coach's Call",
    description: 'Community polls and hot-seat debates on coaches and programs.',
    route: '/coaches-call',
    variant: 'standard',
  },
  {
    title: 'Recruiting Desk',
    description: 'Scouting reports and recruiting intel from around the country.',
    route: '/recruiting',
    variant: 'standard',
  },
  {
    title: 'The Vault',
    description: 'Historic moments, legendary takes, and today-in-CFB-history.',
    route: '/vault',
    variant: 'standard',
  },
];

export default function FeaturesScreen() {
  const colors = useColors();
  const { dark } = useSchoolTheme();
  const router = useRouter();

  const styles = useMemo(() => {
    const crimson = '#8b1a1a';
    const gold = '#c9a84c';
    const warmWhite = colors.surfaceRaised;
    const inkFaded = colors.textSecondary;

    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.paper,
      },
      scrollContent: {
        padding: 16,
        paddingBottom: 60,
      },
      sectionTitle: {
        fontFamily: typography.serifBold,
        fontSize: 16,
        color: colors.textPrimary,
        textTransform: 'uppercase',
        letterSpacing: 2,
        borderBottomWidth: 2,
        borderBottomColor: colors.textPrimary,
        paddingBottom: 6,
        marginBottom: 16,
      },
      // --- Classic (Feed) ---
      cardClassic: {
        backgroundColor: warmWhite,
        borderRadius: 3,
        borderLeftWidth: 4,
        borderLeftColor: crimson,
        padding: 12,
        marginBottom: 12,
        // ticket perforation effect
        borderTopWidth: 1,
        borderTopColor: colors.border,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        borderRightWidth: 1,
        borderRightColor: colors.border,
      },
      // --- Rivalry ---
      cardRivalry: {
        backgroundColor: warmWhite,
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
      },
      rivalryHeader: {
        backgroundColor: crimson,
        paddingVertical: 6,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      rivalryLabel: {
        fontFamily: typography.mono,
        fontSize: 10,
        color: gold,
        textTransform: 'uppercase',
        letterSpacing: 1,
      },
      rivalryTitle: {
        fontFamily: typography.serifBold,
        fontSize: 14,
        color: '#f4efe4',
      },
      cardBody: {
        padding: 10,
      },
      // --- Prediction ---
      cardPrediction: {
        backgroundColor: warmWhite,
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 12,
        borderWidth: 2,
        borderColor: gold,
      },
      predictionHeader: {
        backgroundColor: colors.surface,
        paddingVertical: 6,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: gold,
      },
      predictionLabel: {
        fontFamily: typography.serifBold,
        fontSize: 13,
        color: gold,
        textTransform: 'uppercase',
        letterSpacing: 1,
      },
      predictionTag: {
        fontFamily: typography.mono,
        fontSize: 10,
        color: '#f4efe4',
        backgroundColor: gold,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 2,
        overflow: 'hidden',
        textTransform: 'uppercase',
      },
      // --- Aging ---
      cardAging: {
        backgroundColor: warmWhite,
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
      },
      agingHeader: {
        backgroundColor: colors.surface,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
      agingLabel: {
        fontFamily: typography.serifBold,
        fontSize: 13,
        color: crimson,
        textTransform: 'uppercase',
        letterSpacing: 1,
      },
      agingQuote: {
        borderLeftWidth: 3,
        borderLeftColor: crimson,
        paddingLeft: 8,
        fontStyle: 'italic',
      },
      // --- Receipt ---
      cardReceipt: {
        backgroundColor: colors.surfaceRaised,
        borderRadius: 2,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        borderLeftWidth: 3,
        borderLeftColor: colors.success,
      },
      receiptStamp: {
        fontFamily: typography.mono,
        fontSize: 10,
        color: '#f4efe4',
        backgroundColor: '#4a7c59',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 2,
        overflow: 'hidden',
        alignSelf: 'flex-start',
        marginTop: 6,
        textTransform: 'uppercase',
        letterSpacing: 1,
      },
      // --- Pressbox (Portal) ---
      cardPressbox: {
        backgroundColor: warmWhite,
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
      },
      pressboxHeader: {
        backgroundColor: '#2a1f14',
        paddingVertical: 6,
        paddingHorizontal: 12,
      },
      pressboxTitle: {
        fontFamily: typography.mono,
        fontSize: 11,
        color: '#f4efe4',
        textTransform: 'uppercase',
        letterSpacing: 2,
      },
      // --- Penalty (Moderation) ---
      cardPenalty: {
        backgroundColor: colors.surfaceRaised,
        borderRadius: 3,
        borderLeftWidth: 4,
        borderLeftColor: crimson,
        padding: 12,
        marginBottom: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        borderRightWidth: 1,
        borderRightColor: colors.border,
      },
      penaltyTitle: {
        fontFamily: typography.serifBold,
        fontSize: 13,
        color: crimson,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
      },
      // --- Standard ---
      cardStandard: {
        backgroundColor: warmWhite,
        borderRadius: 3,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        borderLeftWidth: 3,
        borderLeftColor: gold,
      },
      // --- Shared ---
      cardName: {
        fontFamily: typography.serifBold,
        fontSize: 14,
        color: colors.textPrimary,
        marginBottom: 3,
      },
      cardDesc: {
        fontFamily: typography.sans,
        fontSize: 13,
        color: inkFaded,
        lineHeight: 18,
      },
      tapHint: {
        fontFamily: typography.mono,
        fontSize: 10,
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 8,
      },
    });
  }, [colors]);

  function handleNav(route: string) {
    router.push(route as never);
  }

  function renderCard(feature: FeatureItem) {
    switch (feature.variant) {
      case 'classic':
        return (
          <Pressable key={feature.title} style={styles.cardClassic} onPress={() => handleNav(feature.route)}>
            <Text style={styles.cardName}>{feature.title}</Text>
            <Text style={styles.cardDesc}>{feature.description}</Text>
            <Text style={styles.tapHint}>Tap to open</Text>
          </Pressable>
        );

      case 'rivalry':
        return (
          <Pressable key={feature.title} style={styles.cardRivalry} onPress={() => handleNav(feature.route)}>
            <View style={styles.rivalryHeader}>
              <Text style={styles.rivalryLabel}>Feature</Text>
              <Text style={styles.rivalryTitle}>{feature.title}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardDesc}>{feature.description}</Text>
              <Text style={styles.tapHint}>Tap to open</Text>
            </View>
          </Pressable>
        );

      case 'prediction':
        return (
          <Pressable key={feature.title} style={styles.cardPrediction} onPress={() => handleNav(feature.route)}>
            <View style={styles.predictionHeader}>
              <Text style={styles.predictionLabel}>{feature.title}</Text>
              <Text style={styles.predictionTag}>Poll</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardDesc}>{feature.description}</Text>
              <Text style={styles.tapHint}>Tap to open</Text>
            </View>
          </Pressable>
        );

      case 'aging':
        return (
          <Pressable key={feature.title} style={styles.cardAging} onPress={() => handleNav(feature.route)}>
            <View style={styles.agingHeader}>
              <Text style={styles.agingLabel}>{feature.title}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={[styles.cardDesc, styles.agingQuote]}>{feature.description}</Text>
              <Text style={styles.tapHint}>Tap to open</Text>
            </View>
          </Pressable>
        );

      case 'receipt':
        return (
          <Pressable key={feature.title} style={styles.cardReceipt} onPress={() => handleNav(feature.route)}>
            <Text style={styles.cardName}>{feature.title}</Text>
            <Text style={styles.cardDesc}>{feature.description}</Text>
            <Text style={styles.receiptStamp}>CONFIRMED</Text>
          </Pressable>
        );

      case 'pressbox':
        return (
          <Pressable key={feature.title} style={styles.cardPressbox} onPress={() => handleNav(feature.route)}>
            <View style={styles.pressboxHeader}>
              <Text style={styles.pressboxTitle}>{feature.title}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardDesc}>{feature.description}</Text>
              <Text style={styles.tapHint}>Tap to open</Text>
            </View>
          </Pressable>
        );

      case 'penalty':
        return (
          <Pressable key={feature.title} style={styles.cardPenalty} onPress={() => handleNav(feature.route)}>
            <Text style={styles.penaltyTitle}>{feature.title}</Text>
            <Text style={styles.cardDesc}>{feature.description}</Text>
            <Text style={styles.tapHint}>Tap to open</Text>
          </Pressable>
        );

      case 'standard':
      default:
        return (
          <Pressable key={feature.title} style={styles.cardStandard} onPress={() => handleNav(feature.route)}>
            <Text style={styles.cardName}>{feature.title}</Text>
            <Text style={styles.cardDesc}>{feature.description}</Text>
            <Text style={styles.tapHint}>Tap to open</Text>
          </Pressable>
        );
    }
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Features</Text>
        {FEATURES.map(renderCard)}
      </ScrollView>
    </View>
  );
}
