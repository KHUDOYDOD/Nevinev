import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Loader2, Plus, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function ContentPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('siteContent');
  const [contentKey, setContentKey] = useState('');
  const [contentValues, setContentValues] = useState({
    valueRu: '',
    valueEn: '',
    valueTj: '',
    valueKz: '',
    valueUz: '',
  });
  const [hasChanges, setHasChanges] = useState<Record<string, boolean>>({});

  // Fetch all content
  const { data: contentItems, isLoading } = useQuery({
    queryKey: ['/api/admin/content'],
  });

  // Create content mutation
  const createContentMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/admin/content', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/content'] });
      setCreateDialogOpen(false);
      setContentKey('');
      setContentValues({
        valueRu: '',
        valueEn: '',
        valueTj: '',
        valueKz: '',
        valueUz: '',
      });
      toast({
        title: t('common.success'),
        description: t('admin.contentCreated'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('admin.createFailed'),
        variant: 'destructive',
      });
    },
  });

  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest('PATCH', `/api/admin/content/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/content'] });
      setHasChanges({ ...hasChanges, [variables.id]: false });
      toast({
        title: t('common.success'),
        description: t('admin.contentUpdated'),
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

  // Handle create content
  const handleCreateContent = () => {
    // Validate fields
    if (!contentKey || !contentValues.valueRu) {
      toast({
        title: t('common.error'),
        description: t('admin.keyAndRuValueRequired'),
        variant: 'destructive',
      });
      return;
    }

    createContentMutation.mutate({
      key: contentKey,
      ...contentValues,
    });
  };

  // Handle update content
  const handleUpdateContent = (contentItem: any) => {
    updateContentMutation.mutate({
      id: contentItem.id,
      data: contentItem,
    });
  };

  // Filter content items based on active tab
  const filteredContentItems = contentItems?.filter((item: any) => {
    if (activeTab === 'siteContent') {
      return !item.key.startsWith('email.') && !item.key.startsWith('notification.');
    } else if (activeTab === 'emailTemplates') {
      return item.key.startsWith('email.');
    } else if (activeTab === 'notifications') {
      return item.key.startsWith('notification.');
    }
    return true;
  });

  // Group content items by key prefix
  const groupedContentItems = filteredContentItems?.reduce((acc: any, item: any) => {
    const prefix = item.key.split('.')[0];
    if (!acc[prefix]) {
      acc[prefix] = [];
    }
    acc[prefix].push(item);
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.content')}</h1>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('admin.createContent')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.createContent')}</DialogTitle>
              <DialogDescription>
                {t('admin.createContentDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="contentKey">{t('admin.contentKey')}</Label>
                <Input
                  id="contentKey"
                  value={contentKey}
                  onChange={(e) => setContentKey(e.target.value)}
                  placeholder="hero.title"
                />
                <p className="text-sm text-gray-500">{t('admin.contentKeyDescription')}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valueRu">{t('admin.valueRu')} *</Label>
                <Textarea
                  id="valueRu"
                  value={contentValues.valueRu}
                  onChange={(e) => setContentValues({ ...contentValues, valueRu: e.target.value })}
                  placeholder="Русский текст"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valueEn">{t('admin.valueEn')}</Label>
                <Textarea
                  id="valueEn"
                  value={contentValues.valueEn}
                  onChange={(e) => setContentValues({ ...contentValues, valueEn: e.target.value })}
                  placeholder="English text"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valueTj">{t('admin.valueTj')}</Label>
                  <Input
                    id="valueTj"
                    value={contentValues.valueTj}
                    onChange={(e) => setContentValues({ ...contentValues, valueTj: e.target.value })}
                    placeholder="Тоҷикӣ"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="valueKz">{t('admin.valueKz')}</Label>
                  <Input
                    id="valueKz"
                    value={contentValues.valueKz}
                    onChange={(e) => setContentValues({ ...contentValues, valueKz: e.target.value })}
                    placeholder="Қазақша"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="valueUz">{t('admin.valueUz')}</Label>
                  <Input
                    id="valueUz"
                    value={contentValues.valueUz}
                    onChange={(e) => setContentValues({ ...contentValues, valueUz: e.target.value })}
                    placeholder="O'zbekcha"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button 
                onClick={handleCreateContent}
                disabled={createContentMutation.isPending}
              >
                {createContentMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('common.loading')}
                  </>
                ) : (
                  t('admin.createContent')
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="siteContent">{t('admin.siteContent')}</TabsTrigger>
          <TabsTrigger value="emailTemplates">{t('admin.emailTemplates')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('admin.notifications')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="siteContent">
          {renderContentGroup(groupedContentItems, 'siteContent')}
        </TabsContent>
        
        <TabsContent value="emailTemplates">
          {renderContentGroup(groupedContentItems, 'emailTemplates')}
        </TabsContent>
        
        <TabsContent value="notifications">
          {renderContentGroup(groupedContentItems, 'notifications')}
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );

  function renderContentGroup(groupedItems: any, tabKey: string) {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      );
    }

    if (!groupedItems || Object.keys(groupedItems).length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>{t('admin.noContentFound')}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setCreateDialogOpen(true)}
          >
            {t('admin.createFirstContent')}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([prefix, items]: [string, any]) => (
          <Card key={prefix}>
            <CardHeader>
              <CardTitle className="capitalize">{prefix}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {items.map((item: any) => (
                  <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">{item.key}</h3>
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled={!hasChanges[item.id] || updateContentMutation.isPending}
                        onClick={() => handleUpdateContent(item)}
                      >
                        {updateContentMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-1" />
                            {t('common.save')}
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${item.id}-ru`}>{t('admin.valueRu')}</Label>
                        <Textarea
                          id={`${item.id}-ru`}
                          defaultValue={item.valueRu}
                          rows={2}
                          onChange={(e) => {
                            item.valueRu = e.target.value;
                            setHasChanges({ ...hasChanges, [item.id]: true });
                          }}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`${item.id}-en`}>{t('admin.valueEn')}</Label>
                        <Textarea
                          id={`${item.id}-en`}
                          defaultValue={item.valueEn}
                          rows={2}
                          onChange={(e) => {
                            item.valueEn = e.target.value;
                            setHasChanges({ ...hasChanges, [item.id]: true });
                          }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`${item.id}-tj`}>{t('admin.valueTj')}</Label>
                          <Input
                            id={`${item.id}-tj`}
                            defaultValue={item.valueTj}
                            onChange={(e) => {
                              item.valueTj = e.target.value;
                              setHasChanges({ ...hasChanges, [item.id]: true });
                            }}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`${item.id}-kz`}>{t('admin.valueKz')}</Label>
                          <Input
                            id={`${item.id}-kz`}
                            defaultValue={item.valueKz}
                            onChange={(e) => {
                              item.valueKz = e.target.value;
                              setHasChanges({ ...hasChanges, [item.id]: true });
                            }}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`${item.id}-uz`}>{t('admin.valueUz')}</Label>
                          <Input
                            id={`${item.id}-uz`}
                            defaultValue={item.valueUz}
                            onChange={(e) => {
                              item.valueUz = e.target.value;
                              setHasChanges({ ...hasChanges, [item.id]: true });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
}
