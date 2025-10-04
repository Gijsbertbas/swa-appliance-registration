import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: "Welkom bij de SWA HuishoudApparatuur Tracker!",
      verificationEmailBody: (createCode) => `Gebruik deze code om je account te bevestigen: ${createCode()}`,
      userInvitation: {
        emailSubject: "Welkom bij HAT (SWA)!",
        emailBody: (user, code) =>
          `Welkom bij de HuishoudApparatuur Tracker van SlimWonen App.\n 
       Nu kun je inloggen met je gebruikersnaam ${user()} en tijdelijk wachtwoord ${code()}`,
      },
    },
  },
userPool: {
    policies: {
      passwordPolicy: {
        minimumLength: 6,
        requireLowercase: false,
        requireUppercase: false,
        requireNumbers: false,
        requireSymbols: false,
        temporaryPasswordValidityDays: 7,
      },
    },
  },
});
