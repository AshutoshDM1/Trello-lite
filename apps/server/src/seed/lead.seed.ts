import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { default: db } = await import('../utils/db.js');
const { lead } = await import('../db/schema.js');
const { user } = await import('../db/auth-schema.js');

const MOCK_LEADS = [
  {
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@acmecorp.io',
    phone: '+1 (555) 234-5678',
    company: 'Acme Corporation',
    source: 'website',
    status: 'new' as const,
    notes: 'Interested in enterprise Lead CRM plan for sales team of 25.',
  },
  {
    name: 'Michael Chen',
    email: 'm.chen@nexusventures.tech',
    phone: '+1 (555) 876-5432',
    company: 'Nexus Ventures',
    source: 'referral',
    status: 'contacted' as const,
    notes: 'Referred by Dave. Had initial discovery call on Tuesday.',
  },
  {
    name: 'Elena Rostova',
    email: 'elena@cloudscale.app',
    phone: '+1 (555) 345-6789',
    company: 'CloudScale Technologies',
    source: 'linkedin',
    status: 'qualified' as const,
    notes: 'Budget approved for Q3 rollout. Requesting custom API integrations.',
  },
  {
    name: 'Marcus Vance',
    email: 'marcus@vancecapital.com',
    phone: '+1 (555) 987-6543',
    company: 'Vance Capital Partners',
    source: 'cold_outreach',
    status: 'proposal_sent' as const,
    notes: 'Sent tailored proposal for annual tier. Awaiting contract review.',
  },
  {
    name: 'Amara Okafor',
    email: 'a.okafor@horizonlogistics.org',
    phone: '+1 (555) 456-7890',
    company: 'Horizon Logistics',
    source: 'website',
    status: 'won' as const,
    notes: 'Closed 2-year contract! Onboarding meeting scheduled.',
  },
  {
    name: 'David Miller',
    email: 'david.m@solaris-energy.de',
    phone: '+49 30 12345678',
    company: 'Solaris Energy Solutions',
    source: 'social_media',
    status: 'lost' as const,
    notes: 'Chose competitor due to existing legacy software integration needs.',
  },
  {
    name: 'Chloe Dubois',
    email: 'chloe@atelierdesign.fr',
    phone: '+33 1 42 68 55 00',
    company: 'Atelier Design Studio',
    source: 'website',
    status: 'new' as const,
    notes: 'Submitted form via landing page. Looking for team collaboration tools.',
  },
  {
    name: 'Robert Sterling',
    email: 'rsterling@apexsystems.net',
    phone: '+1 (555) 678-9012',
    company: 'Apex Systems Group',
    source: 'referral',
    status: 'contacted' as const,
    notes: 'Left voicemail. Scheduled follow-up email demo for Thursday.',
  },
  {
    name: 'Sophia Patel',
    email: 'sophia@innovatelabs.io',
    phone: '+1 (555) 789-0123',
    company: 'Innovate Labs',
    source: 'linkedin',
    status: 'qualified' as const,
    notes: 'High priority lead. Fast-growing startup needing custom roles.',
  },
  {
    name: 'James O’Connor',
    email: 'j.oconnor@pinnaclemed.com',
    phone: '+1 (555) 890-1234',
    company: 'Pinnacle Medical Group',
    source: 'cold_outreach',
    status: 'proposal_sent' as const,
    notes: 'Proposal under security compliance review by their legal team.',
  },
  {
    name: 'Aisha Al-Mansoor',
    email: 'aisha@crescentglobal.ae',
    phone: '+971 4 321 9876',
    company: 'Crescent Global Holdings',
    source: 'website',
    status: 'won' as const,
    notes: 'Signed multi-seat subscription. Account assigned to senior AM.',
  },
  {
    name: 'Liam Thorne',
    email: 'liam.t@quantumdata.co.uk',
    phone: '+44 20 7946 0912',
    company: 'Quantum Data Analytics',
    source: 'referral',
    status: 'new' as const,
    notes: 'Inquired about custom analytics export & audit logs features.',
  },
];

async function seedLeads() {
  console.log('🌱 Seeding mock leads into database...');

  try {
    // Fetch existing users to optionally assign leads to real users
    const existingUsers = await db.select({ id: user.id }).from(user);
    const userIds = existingUsers.map((u) => u.id);

    const leadEntries = MOCK_LEADS.map((mockItem, index) => {
      const assignedTo =
        userIds.length > 0 && index % 2 === 0 ? userIds[index % userIds.length] : null;

      return {
        id: `lead_seed_${crypto.randomUUID()}`,
        name: mockItem.name,
        email: mockItem.email,
        phone: mockItem.phone,
        company: mockItem.company,
        source: mockItem.source,
        status: mockItem.status,
        notes: mockItem.notes,
        assignedTo: assignedTo,
      };
    });

    const inserted = await db.insert(lead).values(leadEntries).returning();

    console.log(`✅ Successfully seeded ${inserted.length} mock leads!`);
  } catch (error) {
    console.error('❌ Error seeding leads:', error);
  }
}

seedLeads().then(() => process.exit(0));
