import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  Edit3,
  Eye,
  Trash2,
  Crown,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { CollaborationService } from '../../lib/collaboration';
import { toast } from 'react-hot-toast';

interface TeamManagementProps {
  projectId: string;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({ projectId }) => {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', role: 'editor' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamMembers();
  }, [projectId]);

  const loadTeamMembers = async () => {
    try {
      const members = await CollaborationService.getTeamMembers(projectId);
      setTeamMembers(members);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    try {
      await CollaborationService.inviteTeamMember(projectId, inviteData.email, inviteData.role);
      toast.success('Invitation sent successfully!');
      setShowInviteModal(false);
      setInviteData({ email: '', role: 'editor' });
      loadTeamMembers();
    } catch (error) {
      toast.error('Failed to send invitation');
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      await CollaborationService.updateMemberRole(memberId, newRole);
      toast.success('Role updated successfully!');
      loadTeamMembers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return Crown;
      case 'admin': return Shield;
      case 'editor': return Edit3;
      case 'viewer': return Eye;
      default: return Users;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'text-yellow-400';
      case 'admin': return 'text-red-400';
      case 'editor': return 'text-neon-blue';
      case 'viewer': return 'text-dark-400';
      default: return 'text-dark-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Team Management</h2>
          <p className="text-dark-300">Manage your project collaborators and permissions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowInviteModal(true)}
          className="bg-gradient-to-r from-neon-blue to-neon-purple text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-neon-blue/30 transition-all duration-200 flex items-center space-x-2"
        >
          <UserPlus className="w-5 h-5" />
          <span>Invite Member</span>
        </motion.button>
      </div>

      {/* Team Members List */}
      <div className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6">
        <div className="space-y-4">
          {teamMembers.map((member) => {
            const RoleIcon = getRoleIcon(member.role);
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-dark-900/50 rounded-xl border border-dark-700/30"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl flex items-center justify-center">
                    {member.profiles?.avatar_url ? (
                      <img
                        src={member.profiles.avatar_url}
                        alt={member.profiles.full_name}
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold">
                        {member.profiles?.full_name?.charAt(0) || member.profiles?.email?.charAt(0) || '?'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">
                      {member.profiles?.full_name || member.profiles?.email || 'Unknown User'}
                    </h3>
                    <p className="text-dark-400 text-sm">{member.profiles?.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <RoleIcon className={`w-4 h-4 ${getRoleColor(member.role)}`} />
                      <span className={`text-sm capitalize ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                      {member.status === 'pending' && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-yellow-400" />
                          <span className="text-yellow-400 text-xs">Pending</span>
                        </div>
                      )}
                      {member.status === 'active' && (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-neon-green" />
                          <span className="text-neon-green text-xs">Active</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {member.role !== 'owner' && (
                    <>
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        className="bg-dark-800/50 border border-dark-700/50 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 focus:outline-none"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Permissions Overview */}
      <div className="bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { role: 'Owner', permissions: ['Full Access', 'Delete Project', 'Manage Team', 'Publish Content'], color: 'yellow' },
            { role: 'Admin', permissions: ['Manage Team', 'Publish Content', 'Edit Content', 'View Analytics'], color: 'red' },
            { role: 'Editor', permissions: ['Edit Content', 'Create Content', 'View Analytics', 'Comment'], color: 'blue' },
            { role: 'Viewer', permissions: ['View Content', 'Comment', 'Export Content'], color: 'gray' }
          ].map((roleInfo) => (
            <div key={roleInfo.role} className="p-4 bg-dark-900/50 rounded-xl border border-dark-700/30">
              <div className="flex items-center space-x-2 mb-3">
                <div className={`w-3 h-3 rounded-full bg-${roleInfo.color}-400`}></div>
                <h4 className="text-white font-medium">{roleInfo.role}</h4>
              </div>
              <ul className="space-y-1">
                {roleInfo.permissions.map((permission) => (
                  <li key={permission} className="text-dark-300 text-sm flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-neon-green" />
                    <span>{permission}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-800 border border-dark-700/50 rounded-2xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-xl font-bold text-white mb-4">Invite Team Member</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  placeholder="colleague@company.com"
                  className="w-full bg-dark-900/50 border border-dark-700/50 rounded-xl px-4 py-3 text-white placeholder-dark-400 focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Role
                </label>
                <select
                  value={inviteData.role}
                  onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                  className="w-full bg-dark-900/50 border border-dark-700/50 rounded-xl px-4 py-3 text-white focus:border-neon-blue/50 focus:ring-2 focus:ring-neon-blue/20 focus:outline-none"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowInviteModal(false)}
                className="flex-1 bg-dark-700 text-white py-3 rounded-xl font-medium hover:bg-dark-600 transition-colors duration-200"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleInvite}
                className="flex-1 bg-gradient-to-r from-neon-blue to-neon-purple text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-neon-blue/30 transition-all duration-200"
              >
                Send Invite
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};