import { supabase } from './supabase';

interface TeamMember {
  id: string;
  user_id: string;
  project_id: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  permissions: {
    canEdit: boolean;
    canPublish: boolean;
    canInvite: boolean;
    canDelete: boolean;
  };
  status: 'pending' | 'active' | 'inactive';
  invited_at: string;
  joined_at?: string;
}

interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  position?: { start: number; end: number };
  resolved: boolean;
  created_at: string;
  replies: Comment[];
}

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  assignee_id?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  due_date?: string;
  dependencies: string[];
}

export class CollaborationService {
  static async inviteTeamMember(projectId: string, email: string, role: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (!existingUser) {
      // Send invitation email (implement email service)
      console.log(`Sending invitation to ${email} for project ${projectId}`);
    }

    const permissions = this.getRolePermissions(role);

    const { error } = await supabase
      .from('team_members')
      .insert({
        project_id: projectId,
        user_id: existingUser?.id || null,
        invited_by: user.user.id,
        role,
        permissions,
        status: existingUser ? 'active' : 'pending'
      });

    if (error) throw error;
  }

  static async getTeamMembers(projectId: string): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from('team_members')
      .select(`
        *,
        profiles:user_id (
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('project_id', projectId);

    if (error) throw error;
    return data || [];
  }

  static async updateMemberRole(memberId: string, role: string): Promise<void> {
    const permissions = this.getRolePermissions(role);

    const { error } = await supabase
      .from('team_members')
      .update({ role, permissions })
      .eq('id', memberId);

    if (error) throw error;
  }

  static async addComment(articleId: string, content: string, position?: { start: number; end: number }): Promise<Comment> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('article_comments')
      .insert({
        article_id: articleId,
        user_id: user.user.id,
        content,
        position,
        resolved: false
      })
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async getComments(articleId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('article_comments')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        ),
        replies:article_comments!parent_id (
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        )
      `)
      .eq('article_id', articleId)
      .is('parent_id', null)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async resolveComment(commentId: string): Promise<void> {
    const { error } = await supabase
      .from('article_comments')
      .update({ resolved: true })
      .eq('id', commentId);

    if (error) throw error;
  }

  static async createWorkflow(projectId: string, steps: Omit<WorkflowStep, 'id'>[]): Promise<void> {
    const { error } = await supabase
      .from('project_workflows')
      .insert(
        steps.map(step => ({
          ...step,
          project_id: projectId
        }))
      );

    if (error) throw error;
  }

  static async updateWorkflowStep(stepId: string, updates: Partial<WorkflowStep>): Promise<void> {
    const { error } = await supabase
      .from('project_workflows')
      .update(updates)
      .eq('id', stepId);

    if (error) throw error;
  }

  private static getRolePermissions(role: string) {
    const permissions = {
      owner: { canEdit: true, canPublish: true, canInvite: true, canDelete: true },
      admin: { canEdit: true, canPublish: true, canInvite: true, canDelete: false },
      editor: { canEdit: true, canPublish: false, canInvite: false, canDelete: false },
      viewer: { canEdit: false, canPublish: false, canInvite: false, canDelete: false }
    };

    return permissions[role as keyof typeof permissions] || permissions.viewer;
  }

  static async getActivityFeed(projectId: string): Promise<any[]> {
    // Get recent activities for the project
    const { data, error } = await supabase
      .from('project_activities')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  }
}