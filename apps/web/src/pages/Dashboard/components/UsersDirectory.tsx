import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateUserRoleMutation, USER_ROLES, type UserInfo } from '@/hooks/useUsers';

interface UsersDirectoryProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  usersList?: UserInfo[];
  isUsersLoading: boolean;
  isUsersError: boolean;
  currentUserRole?: string;
  getInitials: (name?: string | null) => string;
}

export function UsersDirectory({
  searchQuery,
  setSearchQuery,
  usersList,
  isUsersLoading,
  isUsersError,
  currentUserRole,
  getInitials,
}: UsersDirectoryProps) {
  const updateRoleMutation = useUpdateUserRoleMutation();
  const isAdmin = currentUserRole === 'admin';

  const filteredUsers = (usersList || []).filter((u: UserInfo) => {
    const q = searchQuery.toLowerCase();
    const userRole = u.role || 'member';
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.id?.toLowerCase().includes(q) ||
      userRole.toLowerCase().includes(q)
    );
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    updateRoleMutation.mutate({ userId, role: newRole });
  };

  return (
    <div className=" space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Users Directory
            {isAdmin && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted border border-border text-foreground font-medium">
                Admin Mode
              </span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage user roles and team members in your workspace.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search name, email, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 border-input bg-background"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {isUsersLoading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground font-mono">Loading users directory...</p>
          </div>
        ) : isUsersError ? (
          <div className="p-8 text-center text-xs text-destructive">
            Failed to load users directory. Please check backend connection.
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No users found matching &quot;{searchQuery}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">User ID</th>
                  <th className="px-5 py-3">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((u: UserInfo) => {
                  const rawRole = (u.role || 'member').toLowerCase();
                  const role = USER_ROLES.includes(rawRole as any) ? rawRole : 'member';
                  const isUpdatingThisUser =
                    updateRoleMutation.isPending && updateRoleMutation.variables?.userId === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-5 py-3.5 flex items-center gap-3">
                        {u.image ? (
                          <img
                            src={u.image}
                            alt={u.name}
                            className="size-8 rounded-full object-cover border border-border"
                          />
                        ) : (
                          <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold border border-border shrink-0">
                            {getInitials(u.name)}
                          </div>
                        )}
                        <span className="font-medium text-foreground truncate max-w-40">
                          {u.name || 'User'}
                        </span>
                      </td>

                      {/* Role Cell */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {isAdmin ? (
                            <Select
                              value={role}
                              onValueChange={(newRole) => handleRoleChange(u.id, newRole)}
                              disabled={isUpdatingThisUser}
                            >
                              <SelectTrigger className="h-8 w-28 text-xs font-medium border-border capitalize">
                                <SelectValue>{role}</SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {USER_ROLES.map((r) => (
                                  <SelectItem key={r} value={r} className="text-xs capitalize">
                                    {r}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium capitalize bg-muted border border-border text-foreground">
                              {role}
                            </span>
                          )}
                          {isUpdatingThisUser && (
                            <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">
                        {u.email}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs max-w-30 truncate">
                        {u.id}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground text-xs whitespace-nowrap">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
