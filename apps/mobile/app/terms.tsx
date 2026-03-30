import { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AppHeader } from '@/components/navigation/AppHeader';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { OrnamentDivider } from '@/components/ui/OrnamentDivider';
import { useColors } from '@/lib/theme/ThemeProvider';
import { typography } from '@/lib/theme/typography';

export default function TermsScreen() {
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
      <SectionLabel text="Terms of Service" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.updated}>Last Updated: March 2026</Text>
        <OrnamentDivider />

        <Text style={styles.body}>
          Welcome to CFB Social, operated by Donkey Ideas ("we", "our", or "us"). By using our
          application, you agree to these Terms of Service.
        </Text>

        <Text style={styles.heading}>1. Eligibility</Text>
        <Text style={styles.body}>
          You must be at least 13 years old to use CFB Social. By creating an account, you
          represent that you meet this age requirement.
        </Text>

        <Text style={styles.heading}>2. Account Registration</Text>
        <Text style={styles.body}>
          You are responsible for maintaining the security of your account credentials. You agree to
          provide accurate information during registration and to keep your information current.
        </Text>

        <Text style={styles.heading}>3. User Content</Text>
        <Text style={styles.body}>
          You retain ownership of content you post on CFB Social. By posting content, you grant us a
          non-exclusive, worldwide, royalty-free license to use, display, and distribute your content
          within the platform.
        </Text>

        <Text style={styles.heading}>4. Community Guidelines</Text>
        <Text style={styles.body}>You agree not to:</Text>
        <Text style={styles.bullet}>- Post content that is illegal, threatening, or harassing</Text>
        <Text style={styles.bullet}>- Impersonate other users or public figures</Text>
        <Text style={styles.bullet}>- Spam, manipulate votes, or abuse the platform</Text>
        <Text style={styles.bullet}>- Share personal information of others without consent</Text>
        <Text style={styles.bullet}>- Circumvent moderation or security measures</Text>
        <Text style={styles.bullet}>- Use automated tools to access the service</Text>

        <Text style={styles.heading}>5. Content Moderation</Text>
        <Text style={styles.body}>
          We use both automated systems and human review to moderate content. We reserve the right to
          remove content, suspend accounts, or take other action against violations of these terms or
          our community guidelines.
        </Text>

        <Text style={styles.heading}>6. Gamification and Dynasty System</Text>
        <Text style={styles.body}>
          CFB Social includes gamification features like the Dynasty tier system, prediction markets,
          and rivalry challenges. These features are for entertainment purposes only and hold no
          monetary value. We reserve the right to modify or reset these systems.
        </Text>

        <Text style={styles.heading}>7. Intellectual Property</Text>
        <Text style={styles.body}>
          CFB Social, its design, features, and content (excluding user-generated content) are owned
          by Donkey Ideas. School names, logos, and mascots are property of their respective
          institutions.
        </Text>

        <Text style={styles.heading}>8. Third-Party Services</Text>
        <Text style={styles.body}>
          CFB Social integrates with third-party services (ESPN for scores, Google for
          authentication). We are not responsible for the availability or content of these services.
        </Text>

        <Text style={styles.heading}>9. Disclaimer of Warranties</Text>
        <Text style={styles.body}>
          CFB Social is provided "as is" without warranties of any kind. We do not guarantee
          uninterrupted service, accuracy of game data, or preservation of user content.
        </Text>

        <Text style={styles.heading}>10. Limitation of Liability</Text>
        <Text style={styles.body}>
          To the maximum extent permitted by law, Donkey Ideas shall not be liable for any indirect,
          incidental, special, or consequential damages arising from your use of CFB Social.
        </Text>

        <Text style={styles.heading}>11. Termination</Text>
        <Text style={styles.body}>
          We may suspend or terminate your account for violations of these terms. You may delete your
          account at any time through the Settings page.
        </Text>

        <Text style={styles.heading}>12. Governing Law</Text>
        <Text style={styles.body}>
          These terms are governed by the laws of the United States. Any disputes shall be resolved
          in the courts of the state where Donkey Ideas is registered.
        </Text>

        <Text style={styles.heading}>13. Changes to Terms</Text>
        <Text style={styles.body}>
          We may update these Terms of Service. Continued use of CFB Social after changes constitutes
          acceptance of the new terms.
        </Text>

        <Text style={styles.heading}>14. Contact</Text>
        <Text style={styles.body}>
          For questions about these Terms of Service, contact us at:
        </Text>
        <Text style={styles.contact}>info@donkeyideas.com</Text>
      </ScrollView>
    </View>
  );
}
