export type TransportType = 'air' | 'sea';

export interface Carrier {
  id: string;
  name: string;
  type: TransportType;
  origin: string;
  destination: string;
  price: number;
  currency: string;
  durationText: number;
  departureDate: string;
  logoInitial: string;
}

export interface AdminTransport {
  id: string;
  company: string;
  transportType: 'AIR' | 'SEA';
  source: string;
  destination: string;
  price: number;
  duration: string;
  departureDate: string;
  bookingUrl: string;
}

export const mockCarriers: Carrier[] = [
{
  id: '1',
  name: 'CMA CGM',
  type: 'sea',
  origin: 'Shanghai',
  destination: 'Rotterdam',
  price: 1950,
  currency: 'USD',
  durationText: 22,
  departureDate: '2026-04-01',
  logoInitial: 'C'
},
{
  id: '2',
  name: 'MSC Cargo',
  type: 'sea',
  origin: 'Shanghai',
  destination: 'Rotterdam',
  price: 2100,
  currency: 'USD',
  durationText: 21,
  departureDate: '2026-04-01',
  logoInitial: 'M'
},
{
  id: '3',
  name: 'Hapag-Lloyd',
  type: 'sea',
  origin: 'Shanghai',
  destination: 'Rotterdam',
  price: 2250,
  currency: 'USD',
  durationText: 19,
  departureDate: '2026-04-01',
  logoInitial: 'H'
},
{
  id: '4',
  name: 'Maersk Line',
  type: 'sea',
  origin: 'Shanghai',
  destination: 'Rotterdam',
  price: 2400,
  currency: 'USD',
  durationText: 18,
  departureDate: '2026-04-01',
  logoInitial: 'M'
},
{
  id: '5',
  name: 'FedEx Freight',
  type: 'air',
  origin: 'Shanghai',
  destination: 'Rotterdam',
  price: 7800,
  currency: 'USD',
  durationText: 3,
  departureDate: '2026-04-01',
  logoInitial: 'F'
},
{
  id: '6',
  name: 'Emirates SkyCargo',
  type: 'air',
  origin: 'Shanghai',
  destination: 'Rotterdam',
  price: 8100,
  currency: 'USD',
  durationText: 2.5,
  departureDate: '2026-03-28',
  logoInitial: 'E'
},
{
  id: '7',
  name: 'DHL Express',
  type: 'air',
  origin: 'Shanghai',
  destination: 'Rotterdam',
  price: 8500,
  currency: 'USD',
  durationText: 2,
  departureDate: '2026-04-01',
  logoInitial: 'D'
},
{
  id: '8',
  name: 'UPS Air Cargo',
  type: 'air',
  origin: 'Shanghai',
  destination: 'Rotterdam',
  price: 9200,
  currency: 'USD',
  durationText: 1.5,
  departureDate: '2026-04-01',
  logoInitial: 'U'
}];

export const mockAdminTransports: AdminTransport[] = [
{
  id: 'at1',
  company: 'CMA CGM',
  transportType: 'SEA',
  source: 'Shanghai',
  destination: 'Rotterdam',
  price: 1950,
  duration: '22 days',
  departureDate: '2026-04-18',
  bookingUrl: 'https://www.cma-cgm.com'
},
{
  id: 'at2',
  company: 'MSC Cargo',
  transportType: 'SEA',
  source: 'Singapore',
  destination: 'Hamburg',
  price: 2300,
  duration: '19 days',
  departureDate: '2026-04-21',
  bookingUrl: 'https://www.msc.com'
},
{
  id: 'at3',
  company: 'Emirates SkyCargo',
  transportType: 'AIR',
  source: 'Dubai',
  destination: 'Frankfurt',
  price: 8200,
  duration: '2 days',
  departureDate: '2026-04-12',
  bookingUrl: 'https://www.skycargo.com'
},
{
  id: 'at4',
  company: 'DHL Express',
  transportType: 'AIR',
  source: 'Hong Kong',
  destination: 'Los Angeles',
  price: 9100,
  duration: '1.5 days',
  departureDate: '2026-04-10',
  bookingUrl: 'https://www.dhl.com'
}];


export interface SearchHistoryEntry {
  id: string;
  origin: string;
  destination: string;
  date: string;
  transportType: 'All transport' | 'air' | 'sea';
  time: string;
  searchDate: string;
}

export const mockSearchHistory: SearchHistoryEntry[] = [
{
  id: 'h1',
  origin: 'Shanghai',
  destination: 'Rotterdam',
  date: '4/1/2026',
  transportType: 'All transport',
  time: '06:30 PM',
  searchDate: 'March 22, 2026'
},
{
  id: 'h2',
  origin: 'Mumbai',
  destination: 'Hamburg',
  date: '4/10/2026',
  transportType: 'sea',
  time: '01:15 PM',
  searchDate: 'March 21, 2026'
},
{
  id: 'h3',
  origin: 'Los Angeles',
  destination: 'Tokyo',
  date: '3/28/2026',
  transportType: 'air',
  time: '08:45 PM',
  searchDate: 'March 20, 2026'
}];


export type UserRole = 'user' | 'staff' | 'admin';

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdBy: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface ChatParticipant {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface ChatConversation {
  id: string;
  participants: ChatParticipant[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  status: 'active' | 'closed';
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'busy' | 'offline';
  activeTickets: number;
  activeChats: number;
  avatar?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  plan: 'free' | 'premium';
  startDate: string;
  expiryDate: string | null;
  status: 'active' | 'expired' | 'cancelled';
}

export const mockTickets: Ticket[] = [
{
  id: 't1',
  subject: 'Delay in shipment tracking',
  description:
  'My shipment from Shanghai to Rotterdam has not updated in 3 days.',
  status: 'open',
  priority: 'high',
  createdBy: '1',
  assignedTo: null,
  createdAt: '2026-04-03T10:00:00Z',
  updatedAt: '2026-04-03T10:00:00Z',
  messages: [
  {
    id: 'tm1',
    senderId: '1',
    senderName: 'hibahmohammed.k',
    senderRole: 'user',
    content:
    'My shipment from Shanghai to Rotterdam has not updated in 3 days. Can someone check?',
    createdAt: '2026-04-03T10:00:00Z'
  }]

},
{
  id: 't2',
  subject: 'Invoice discrepancy',
  description: 'The final invoice amount differs from the quoted price.',
  status: 'in-progress',
  priority: 'medium',
  createdBy: 'u2',
  assignedTo: 's1',
  createdAt: '2026-04-02T14:30:00Z',
  updatedAt: '2026-04-02T15:00:00Z',
  messages: [
  {
    id: 'tm2',
    senderId: 'u2',
    senderName: 'John Doe',
    senderRole: 'user',
    content: 'The final invoice amount differs from the quoted price.',
    createdAt: '2026-04-02T14:30:00Z'
  },
  {
    id: 'tm3',
    senderId: 's1',
    senderName: 'Alice Support',
    senderRole: 'staff',
    content:
    'I am looking into this right now. Could you provide the invoice number?',
    createdAt: '2026-04-02T15:00:00Z'
  }]

},
{
  id: 't3',
  subject: 'How to upgrade to premium?',
  description:
  'I want to upgrade my account but the payment page is giving an error.',
  status: 'resolved',
  priority: 'low',
  createdBy: 'u3',
  assignedTo: 's2',
  createdAt: '2026-04-01T09:15:00Z',
  updatedAt: '2026-04-01T11:20:00Z',
  messages: []
},
{
  id: 't4',
  subject: 'Customs clearance documents',
  description: 'What documents do I need for customs clearance in Tokyo?',
  status: 'closed',
  priority: 'medium',
  createdBy: '1',
  assignedTo: 's1',
  createdAt: '2026-03-28T16:45:00Z',
  updatedAt: '2026-03-29T10:00:00Z',
  messages: []
},
{
  id: 't5',
  subject: 'Damaged goods upon arrival',
  description:
  'Several items were damaged during transit. Need to file a claim.',
  status: 'open',
  priority: 'urgent',
  createdBy: 'u4',
  assignedTo: null,
  createdAt: '2026-04-03T11:30:00Z',
  updatedAt: '2026-04-03T11:30:00Z',
  messages: []
}];


export const mockConversations: ChatConversation[] = [
{
  id: 'c1',
  participants: [
  { id: '1', name: 'hibahmohammed.k', role: 'user' },
  { id: 's1', name: 'Alice Support', role: 'staff' }],

  lastMessage: 'Let me check the status for you.',
  lastMessageAt: '2026-04-03T12:05:00Z',
  unreadCount: 1,
  status: 'active'
},
{
  id: 'c2',
  participants: [
  { id: 'u2', name: 'John Doe', role: 'user' },
  { id: 's2', name: 'Bob Support', role: 'staff' }],

  lastMessage: 'Thank you for your help!',
  lastMessageAt: '2026-04-03T11:30:00Z',
  unreadCount: 0,
  status: 'closed'
},
{
  id: 'c3',
  participants: [
  { id: 'u3', name: 'Jane Smith', role: 'user' },
  { id: 's1', name: 'Alice Support', role: 'staff' }],

  lastMessage: 'Can you provide the tracking number?',
  lastMessageAt: '2026-04-03T12:15:00Z',
  unreadCount: 2,
  status: 'active'
},
{
  id: 'c4',
  participants: [{ id: 'u4', name: 'Mike Johnson', role: 'user' }],
  lastMessage: 'I need help with a booking.',
  lastMessageAt: '2026-04-03T12:20:00Z',
  unreadCount: 1,
  status: 'active'
}];


export const mockChatMessages: Record<string, ChatMessage[]> = {
  c1: [
  {
    id: 'cm1',
    conversationId: 'c1',
    senderId: '1',
    senderName: 'hibahmohammed.k',
    content: 'Hi, I have a question about my recent booking.',
    createdAt: '2026-04-03T12:00:00Z',
    read: true
  },
  {
    id: 'cm2',
    conversationId: 'c1',
    senderId: 's1',
    senderName: 'Alice Support',
    content:
    'Hello! I would be happy to help. What is your booking reference?',
    createdAt: '2026-04-03T12:01:00Z',
    read: true
  },
  {
    id: 'cm3',
    conversationId: 'c1',
    senderId: '1',
    senderName: 'hibahmohammed.k',
    content: 'It is REF-12345.',
    createdAt: '2026-04-03T12:04:00Z',
    read: true
  },
  {
    id: 'cm4',
    conversationId: 'c1',
    senderId: 's1',
    senderName: 'Alice Support',
    content: 'Let me check the status for you.',
    createdAt: '2026-04-03T12:05:00Z',
    read: false
  }]

};

export const mockStaffMembers: StaffMember[] = [
{
  id: 's1',
  name: 'Alice Support',
  email: 'alice@freightcompare.com',
  status: 'online',
  activeTickets: 12,
  activeChats: 3
},
{
  id: 's2',
  name: 'Bob Support',
  email: 'bob@freightcompare.com',
  status: 'busy',
  activeTickets: 8,
  activeChats: 5
},
{
  id: 's3',
  name: 'Charlie Support',
  email: 'charlie@freightcompare.com',
  status: 'offline',
  activeTickets: 0,
  activeChats: 0
}];


export const mockSubscriptions: Subscription[] = [
{
  id: 'sub1',
  userId: '1',
  userName: 'hibahmohammed.k',
  plan: 'free',
  startDate: '2026-01-01T00:00:00Z',
  expiryDate: null,
  status: 'active'
},
{
  id: 'sub2',
  userId: 'u2',
  userName: 'John Doe',
  plan: 'premium',
  startDate: '2026-03-15T00:00:00Z',
  expiryDate: '2027-03-15T00:00:00Z',
  status: 'active'
},
{
  id: 'sub3',
  userId: 'u3',
  userName: 'Jane Smith',
  plan: 'premium',
  startDate: '2025-02-10T00:00:00Z',
  expiryDate: '2026-02-10T00:00:00Z',
  status: 'expired'
}];

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isPremium: boolean;
  isBlocked: boolean;
}

export const mockAdminUsers : AdminUser[] = [
{
  id: '1',
  name: 'hibahmohammed.k',
  email: 'hibah@example.com',
  role: 'user',
  isPremium: false,
  isBlocked: false
},
{
  id: 'u2',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  isPremium: true,
  isBlocked: false
},
{
  id: 'u3',
  name: 'Jane Smith',
  email: 'jane@example.com',
  role: 'user',
  isPremium: false,
  isBlocked: false
},
{
  id: 'u4',
  name: 'Mike Johnson',
  email: 'mike@example.com',
  role: 'user',
  isPremium: false,
  isBlocked: false
},
{
  id: 's1',
  name: 'Alice Support',
  email: 'alice@freightcompare.com',
  role: 'staff',
  isPremium: false,
  isBlocked: false
},
{
  id: 's2',
  name: 'Bob Support',
  email: 'bob@freightcompare.com',
  role: 'staff',
  isPremium: false,
  isBlocked: false
},
{
  id: 's3',
  name: 'Charlie Support',
  email: 'charlie@freightcompare.com',
  role: 'staff',
  isPremium: false,
  isBlocked: false
},
{
  id: 'a1',
  name: 'Admin User',
  email: 'admin@freightcompare.com',
  role: 'admin',
  isPremium: true,
  isBlocked: false
}];
