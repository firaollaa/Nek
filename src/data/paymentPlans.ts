import { PaymentPlan } from '../types';

export const PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: 'plan_weekly',
    tier: 'spark_gold',
    title: 'Weekly Pass',
    priceETB: 99,
    durationLabel: 'per week',
    features: [
      'Unlimited daily campus swipes',
      'Rewind up to 5 accidental passes',
      'See up to 5 profiles who liked you',
      'Set custom campus radius filter',
    ],
  },
  {
    id: 'plan_monthly',
    tier: 'spark_gold',
    title: 'Monthly Pass',
    priceETB: 249,
    durationLabel: 'per month',
    popular: true,
    features: [
      'Unlimited daily matches & swipes',
      'Full "See Who Liked You" reveal',
      'Advanced ASTU School & Major filters',
      'Filter by GPA / Dean’s List status',
      '1 Free ASTU Campus Boost per week',
      '5 Super Likes per week',
      'Unlimited Rewinds',
    ],
  },
  {
    id: 'plan_semester',
    tier: 'spark_platinum',
    title: 'Full Semester VIP',
    priceETB: 599,
    durationLabel: '4 months (one academic semester)',
    features: [
      'All Spark Gold perks included',
      'Exclusive Gold Campus Badge on profile',
      'Priority delivery of study partner invites',
      'Direct intro message before matching (1/wk)',
      'Unlimited Super Likes & Rewinds',
      'Campus Incognito & Ghost Mode',
      'Highest visibility in ASTU dorms & cafes',
    ],
  },
];
