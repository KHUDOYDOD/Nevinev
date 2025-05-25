import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AvatarPlaceholder } from '@/components/ui/avatar-placeholder';
import { Loader2, Edit, Trash, Ban, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function UsersPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    balance: '',
    role: '',
  });

  // Fetch all users
  const { data: users, isLoading } = useQuery({
    queryKey: ['/api/admin/users'],
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (data: { userId: number; balance?: number; role?: string }) => {
      return await apiRequest('PATCH', `/api/admin/users/${data.userId}`, {
        balance: data.balance,
        role: data.role,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setEditDialogOpen(false);
      toast({
        title: t('common.success'),
        description: t('admin.userUpdated'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('admin.updateFailed'),
        variant: 'destructive',
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      return await apiRequest('DELETE', `/api/admin/users/${userId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setDeleteDialogOpen(false);
      toast({
        title: t('common.success'),
        description: t('admin.userDeleted'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('admin.deleteFailed'),
        variant: 'destructive',
      });
    },
  });

  // Handle edit user click
  const handleEditUser = (user: any) => {
    setCurrentUser(user);
    setEditForm({
      balance: user.balance.toString(),
      role: user.role,
    });
    setEditDialogOpen(true);
  };

  // Handle delete user click
  const handleDeleteUser = (user: any) => {
    setCurrentUser(user);
    setDeleteDialogOpen(true);
  };

  // Handle update user submit
  const handleUpdateUser = () => {
    if (!currentUser) return;

    const balance = parseFloat(editForm.balance);
    if (isNaN(balance)) {
      toast({
        title: t('common.error'),
        description: t('admin.invalidBalance'),
        variant: 'destructive',
      });
      return;
    }

    updateUserMutation.mutate({
      userId: currentUser.id,
      balance,
      role: editForm.role,
    });
  };

  // Handle delete user submit
  const handleConfirmDelete = () => {
    if (!currentUser) return;
    deleteUserMutation.mutate(currentUser.id);
  };

  // Filter users based on search query
  const filteredUsers = users?.filter((user: any) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.fullName && user.fullName.toLowerCase().includes(query))
    );
  });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.users')}</h1>
        <div className="w-64">
          <Input
            placeholder={t('admin.searchUsers')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.usersList')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filteredUsers?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">{t('common.id')}</th>
                    <th className="text-left p-4 font-medium">{t('common.user')}</th>
                    <th className="text-left p-4 font-medium">{t('dashboard.balance')}</th>
                    <th className="text-left p-4 font-medium">{t('common.role')}</th>
                    <th className="text-left p-4 font-medium">{t('dashboard.joinDate')}</th>
                    <th className="text-left p-4 font-medium">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user: any) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-4">{user.id}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <AvatarPlaceholder name={user.fullName || user.username} className="mr-3" />
                          <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            {user.fullName && (
                              <div className="text-sm text-gray-500">{user.fullName}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium">{formatCurrency(user.balance)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{formatDate(user.createdAt)}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>{t('admin.noUsersFound')}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.editUser')}</DialogTitle>
            <DialogDescription>
              {t('admin.editUserDescription')}
            </DialogDescription>
          </DialogHeader>
          
          {currentUser && (
            <div className="space-y-4 py-4">
              <div className="flex items-center mb-4">
                <AvatarPlaceholder name={currentUser.fullName || currentUser.username} className="mr-3" />
                <div>
                  <div className="font-medium">{currentUser.username}</div>
                  <div className="text-sm text-gray-500">{currentUser.email}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="balance">{t('dashboard.balance')}</Label>
                <Input
                  id="balance"
                  type="number"
                  value={editForm.balance}
                  onChange={(e) => setEditForm({ ...editForm, balance: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">{t('common.role')}</Label>
                <Select
                  value={editForm.role}
                  onValueChange={(value) => setEditForm({ ...editForm, role: value })}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder={t('admin.selectRole')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">{t('admin.roleUser')}</SelectItem>
                    <SelectItem value="admin">{t('admin.roleAdmin')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={handleUpdateUser}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('common.save')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.deleteUser')}</DialogTitle>
            <DialogDescription>
              {t('admin.deleteUserConfirmation')}
            </DialogDescription>
          </DialogHeader>
          
          {currentUser && (
            <div className="py-4">
              <p className="mb-2">{t('admin.deleteUserWarning')}</p>
              <div className="flex items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <AvatarPlaceholder name={currentUser.fullName || currentUser.username} className="mr-3" />
                <div>
                  <div className="font-medium">{currentUser.username}</div>
                  <div className="text-sm text-gray-500">{currentUser.email}</div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  {t('admin.deleteUser')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
