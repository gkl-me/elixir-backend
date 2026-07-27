declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        role: string;
      };
      requestId?: string;
      workspaceMember?: {
        workspaceMemberId: string;
        workspaceRoleId: string;
        permissions: string[];
      };
    }
  }
}

export {};
