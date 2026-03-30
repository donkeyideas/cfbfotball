import { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AppHeader } from '@/components/navigation/AppHeader';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { OrnamentDivider } from '@/components/ui/OrnamentDivider';
import { useColors } from '@/lib/theme/ThemeProvider';
import { typography } from '@/lib/theme/typography';

export default function PrivacyScreen() {
  const colors = useColors();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.paper,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
    },
    updated: {
      fontFamily: typography.mono,
      fontSize: 11,
      color: colors.textMuted,
      textAlign: 'center',
      marginBottom: 8,
    },
    heading: {
      fontFamily: typography.serifBold,
      fontSize: 18,
      color: colors.ink,
      marginTop: 20,
      marginBottom: 6,
    },
    body: {
      fontFamily: typography.sans,
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 8,
    },
    bullet: {
      fontFamily: typography.sans,
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 22,
      paddingLeft: 12,
      marginBottom: 4,
    },
    contact: {
      fontFamily: typography.mono,
      fontSize: 13,
      color: colors.ink,
      marginTop: 4,
    },
  }), [colors]);

  return (
    <View style={styles.container}>
      <AppHeader />
      <SectionLabel text="Privacy Policy" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.updated}>Last Updated: March 2026</Text>
        <OrnamentDivider />

        <Text style={styles.body}>
          Donkey Ideas ("we", "our", or "us") operates CFB Social. This Privacy Policy explains how
          we collect, use, and protect your information when you use our mobile application and
          website.
        </Text>

        <Text style={styles.heading}>1. Information We Collect</Text>
        <Text style={styles.body}>We collect information you provide directly:</Text>
        <Text style={styles.bullet}>- Email address and password when you create an account</Text>
        <Text style={styles.bullet}>- Display name, avatar, and school affiliation</Text>
        <Text style={styles.bullet}>- Posts, comments, votes, and other content you create</Text>
        <Text style={styles.bullet}>- Predictions, challenges, and game participation data</Text>
        <Text style={styles.body}>We automatically collect:</Text>
        <Text style={styles.bullet}>- Device information (type, OS, unique identifiers)</Text>
        <Text style={styles.bullet}>- Usage data (pages viewed, features used, timestamps)</Text>
        <Text style={styles.bullet}>- Push notification tokens (if you enable notifications)</Text>

        <Text style={styles.heading}>2. How We Use Your Information</Text>
        <Text style={styles.bullet}>- To provide and maintain CFB Social services</Text>
        <Text style={styles.bullet}>- To personalize your feed and recommendations</Text>
        <Text style={styles.bullet}>- To process your Dynasty tier and gamification progress</Text>
        <Text style={styles.bullet}>- To send notifications about activity on your content</Text>
        <Text style={styles.bullet}>- To moderate content and enforce community guidelines</Text>
        <Text style={styles.bullet}>- To improve our services and develop new features</Text>

        <Text style={styles.heading}>3. Information Sharing</Text>
        <Text style={styles.body}>
          We do not sell your personal information. We may share information with:
        </Text>
        <Text style={styles.bullet}>- Other users (your public profile, posts, and activity)</Text>
        <Text style={styles.bullet}>- Service providers who help us operate (hosting, analytics)</Text>
        <Text style={styles.bullet}>- Law enforcement when required by law</Text>

        <Text style={styles.heading}>4. Data Storage and Security</Text>
        <Text style={styles.body}>
          Your data is stored securely using Supabase infrastructure with encryption at rest and in
          transit. We implement industry-standard security measures to protect your information, but
          no method of transmission over the Internet is 100% secure.
        </Text>

        <Text style={styles.heading}>5. Your Rights</Text>
        <Text style={styles.body}>You have the right to:</Text>
        <Text style={styles.bullet}>- Access your personal data</Text>
        <Text style={styles.bullet}>- Correct inaccurate data</Text>
        <Text style={styles.bullet}>- Delete your account and associated data</Text>
        <Text style={styles.bullet}>- Export your data</Text>
        <Text style={styles.bullet}>- Opt out of non-essential communications</Text>

        <Text style={styles.heading}>6. Account Deletion</Text>
        <Text style={styles.body}>
          You can delete your account at any time through the Settings page or Delete Account page.
          When you delete your account, we remove your profile information and personal data. Some
          anonymized content may remain for the integrity of community discussions.
        </Text>

        <Text style={styles.heading}>7. Children's Privacy</Text>
        <Text style={styles.body}>
          CFB Social is not intended for children under 13. We do not knowingly collect personal
          information from children under 13. If we learn we have collected such information, we
          will delete it promptly.
        </Text>

        <Text style={styles.heading}>8. Third-Party Services</Text>
        <Text style={styles.body}>
          We use third-party services including Supabase (database and authentication), Google
          (OAuth login), ESPN (public game data), and Expo (push notifications). These services have
          their own privacy policies.
        </Text>

        <Text style={styles.heading}>9. Changes to This Policy</Text>
        <Text style={styles.body}>
          We may update this Privacy Policy from time to time. We will notify you of significant
          changes through the app or by email.
        </Text>

        <Text style={styles.heading}>10. Contact</Text>
        <Text style={styles.body}>
          If you have questions about this Privacy Policy, contact us at:
        </Text>
        <Text style={styles.contact}>info@donkeyideas.com</Text>
      </ScrollView>
    </View>
  );
}
