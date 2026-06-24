import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Label } from '@/react-app/components/ui/label';
import { Switch } from '@/react-app/components/ui/switch';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import api from '@/react-app/lib/api';

interface Setting {
  key: string;
  value: any;
  description: string;
}

export default function SystemSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings');
    }
    setLoading(false);
  };

  const handleUpdate = async (key: string, value: any) => {
    setSaving(true);
    try {
      await api.post('/settings', { key, value });
      fetchSettings();
    } catch (error) {
      alert('Failed to update setting');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-center">Loading settings...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold flex items-center gap-3">
        <SettingsIcon className="w-10 h-10" />
        System Settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-gray-500">Disable the frontend for regular users</p>
              </div>
              <Switch 
                checked={settings.find(s => s.key === 'maintenance_mode')?.value === true}
                onCheckedChange={(checked) => handleUpdate('maintenance_mode', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Registration Open</Label>
                <p className="text-sm text-gray-500">Allow new alumni to register</p>
              </div>
              <Switch 
                checked={settings.find(s => s.key === 'registration_open')?.value !== false}
                onCheckedChange={(checked) => handleUpdate('registration_open', checked)}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label>System Name</Label>
              <div className="flex gap-2">
                <Input 
                  defaultValue={settings.find(s => s.key === 'system_name')?.value || 'AlumniConnect'} 
                  id="system_name"
                />
                <Button 
                  size="sm" 
                  onClick={() => {
                    const val = (document.getElementById('system_name') as HTMLInputElement).value;
                    handleUpdate('system_name', val);
                  }}
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input 
                defaultValue={settings.find(s => s.key === 'contact_email')?.value || 'admin@alumni.com'} 
                type="email"
              />
            </div>
            <Button variant="outline" className="w-full">
              Update Email Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
