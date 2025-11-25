export interface Bill {
  id: string;
  title: string;
  status: 'overdue' | 'pending' | 'paid';
  amount: string;
  dueDate: string;
  type: 'room' | 'utility';
}

export interface User {
  name: string;
  room: string;
  building: string;
  roommate: string;
  avatarUrl: string;
}

export interface MenuItem {
  icon: string;
  title: string;
  subtitle: string;
}

export interface NotificationItem {
  id: string;
  type: 'power' | 'document' | 'cleaning' | 'bug';
  title: string;
  content: string;
  time: string;
  isRead: boolean;
}