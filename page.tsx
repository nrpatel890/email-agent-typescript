'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Send,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  Calendar,
  Check,
  X,
  MoreHorizontal,
} from 'lucide-react';

// Mock data types
interface EmailDraft {
  id: string;
  leadId: string;
  leadName: string;
  subject: string;
  preview: string;
  content: string;
  status: 'draft' | 'pending' | 'sent' | 'failed';
  createdAt: Date;
  scheduledFor?: Date;
  lastModified: Date;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

// Mock data
const mockEmailDrafts: EmailDraft[] = [
  {
    id: '1',
    leadId: 'lead-001',
    leadName: 'Sarah Johnson',
    subject: 'Your Grand Oaks Apartment Application Status',
    preview: 'Hi Sarah, Thank you for your interest in Grand Oaks Apartments...',
    content: `Hi Sarah,

Thank you for your interest in Grand Oaks Apartments! I wanted to follow up on our conversation about your apartment search.

Based on our chat, I understand you're looking for:
- 2-bedroom apartment
- Move-in date: March 2024
- Pet-friendly (1 cat)
- Amenities: Pool access, W/D connections

I'm excited to let you know that we have several units that match your criteria perfectly! Our 2-bedroom Rosewood floor plan would be ideal for you and your furry friend.

Would you like to schedule a tour this week? I have availability on:
- Thursday 2-4 PM
- Friday 10 AM-12 PM
- Saturday 9 AM-5 PM

Best regards,
Ava Martinez
Leasing Specialist
Grand Oaks Apartments`,
    status: 'draft',
    createdAt: new Date('2024-01-15T10:30:00'),
    lastModified: new Date('2024-01-15T14:22:00'),
    priority: 'high',
    tags: ['follow-up', 'qualified-lead', 'tour-request'],
  },
  {
    id: '2',
    leadId: 'lead-002',
    leadName: 'Michael Chen',
    subject: 'Special Move-in Incentive - Limited Time!',
    preview: 'Hi Michael, I have exciting news about a special offer...',
    content: `Hi Michael,

I have exciting news! Based on your interest in our 1-bedroom units, I wanted to share a limited-time incentive that just became available.

For qualified applicants moving in before February 28th, we're offering:
- $500 off first month's rent
- Waived application fee ($50 value)
- Complimentary cable & internet for 3 months

This is a fantastic opportunity to save on your move-in costs. The Grand floor plan you expressed interest in is available with a March 1st move-in date.

Would you like to schedule a quick call to discuss next steps? I can hold this incentive for you for 48 hours.

Best regards,
Ava Martinez`,
    status: 'pending',
    createdAt: new Date('2024-01-14T09:15:00'),
    scheduledFor: new Date('2024-01-16T10:00:00'),
    lastModified: new Date('2024-01-14T16:45:00'),
    priority: 'medium',
    tags: ['incentive', 'time-sensitive', 'qualified-lead'],
  },
  {
    id: '3',
    leadId: 'lead-003',
    leadName: 'Emma Rodriguez',
    subject: 'Thank you for visiting Grand Oaks!',
    preview: 'Hi Emma, It was wonderful meeting you during your tour...',
    content: `Hi Emma,

It was wonderful meeting you during your tour yesterday! I hope you enjoyed seeing the Kirkpatrick 2-bedroom floor plan.

I wanted to follow up with the information we discussed:
- Monthly rent: $1,850
- Available move-in: February 15th
- Pet fee: $300 (one-time) + $25/month
- Utilities included: Water, sewer, trash

I also wanted to mention that we just received approval for a resident referral program. If you decide to move forward and refer a friend who also leases with us, you'll both receive a $200 credit!

Please let me know if you have any questions or if you'd like to start the application process.

Best regards,
Ava Martinez`,
    status: 'sent',
    createdAt: new Date('2024-01-13T11:20:00'),
    lastModified: new Date('2024-01-13T11:20:00'),
    priority: 'low',
    tags: ['tour-followup', 'application-ready'],
  },
];

const EmailPage: React.FC = () => {
  const [emailDrafts, setEmailDrafts] = useState<EmailDraft[]>(mockEmailDrafts);
  const [selectedEmail, setSelectedEmail] = useState<EmailDraft | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'preview' | 'edit'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Filter emails based on search and status
  const filteredEmails = emailDrafts.filter((email) => {
    const matchesSearch =
      email.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || email.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'sent':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleSendEmail = async (emailId: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setEmailDrafts((prev) =>
      prev.map((email) => (email.id === emailId ? { ...email, status: 'sent' as const } : email)),
    );
    setIsLoading(false);

    if (selectedEmail?.id === emailId) {
      setSelectedEmail((prev) => (prev ? { ...prev, status: 'sent' as const } : null));
    }
  };

  const handleDeleteEmail = (emailId: string) => {
    setEmailDrafts((prev) => prev.filter((email) => email.id !== emailId));
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(null);
      setViewMode('list');
    }
  };

  const refreshDrafts = async () => {
    setIsLoading(true);
    // Simulate API call to refresh drafts
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Mail className="w-7 h-7 text-blue-600" />
              Email Management
            </h1>
            <p className="text-gray-600 mt-1">
              Review and send AI-generated email drafts based on lead conversations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={refreshDrafts}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Draft
            </motion.button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Email List Sidebar */}
        <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {filteredEmails.map((email) => (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedEmail?.id === email.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => {
                    setSelectedEmail(email);
                    setViewMode('preview');
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 truncate">{email.leadName}</span>
                        <span
                          className={`w-2 h-2 rounded-full ${getPriorityColor(email.priority)}`}
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-800 truncate mb-1">
                        {email.subject}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-2">{email.preview}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(email.status)}`}
                        >
                          {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {email.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Email Preview/Edit Area */}
        <div className="flex-1 bg-gray-50">
          {selectedEmail ? (
            <div className="h-full flex flex-col">
              {/* Email Header */}
              <div className="bg-white border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-500" />
                      <span className="font-medium text-gray-900">{selectedEmail.leadName}</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedEmail.status)}`}
                    >
                      {selectedEmail.status.charAt(0).toUpperCase() + selectedEmail.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedEmail.status === 'draft' && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setViewMode('edit')}
                          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSendEmail(selectedEmail.id)}
                          disabled={isLoading}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                          {isLoading ? 'Sending...' : 'Send Email'}
                        </motion.button>
                      </>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDeleteEmail(selectedEmail.id)}
                      className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </motion.button>
                  </div>
                </div>

                <div className="mt-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedEmail.subject}
                  </h2>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Created: {selectedEmail.createdAt.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Modified: {selectedEmail.lastModified.toLocaleDateString()}
                    </div>
                    {selectedEmail.scheduledFor && (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Scheduled: {selectedEmail.scheduledFor.toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {selectedEmail.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedEmail.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="prose max-w-none">
                    {selectedEmail.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-800 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Email Selected</h3>
                <p className="text-gray-600">Select an email from the list to preview or edit it</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailPage;
