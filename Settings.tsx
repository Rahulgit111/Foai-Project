import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Lock, Database, Trash2, Bell, Palette,
  LogOut, AlertCircle, ChevronRight, Shield,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';

export function Settings() {
  const { signOut, deleteAccount } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showDeleteHistory, setShowDeleteHistory] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('light');

  const handleDeleteHistory = async () => {
    const { error } = await supabase.from('assessments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) {
      showToast('Could not delete history. Please try again.', 'error');
      return;
    }
    showToast('Assessment history deleted.', 'success');
    setShowDeleteHistory(false);
  };

  const handleDeleteAccount = async () => {
    const { error } = await deleteAccount();
    if (error) {
      showToast('Could not delete account. Please try again.', 'error');
      return;
    }
    showToast('Account deleted successfully.', 'success');
    navigate('/');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-sage-800 mb-1">Settings</h1>
        <p className="text-sage-500 text-sm">Manage your account, privacy, and preferences</p>
      </div>

      {/* Account */}
      <div className="card mb-6">
        <h2 className="font-semibold text-sage-800 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-sage-500" /> Account
        </h2>
        <div className="space-y-2">
          <button onClick={() => navigate('/profile')} className="w-full flex items-center justify-between p-3 bg-sage-50/50 rounded-xl hover:bg-sage-100 transition-colors">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-sage-500" />
              <span className="text-sm text-sage-700">Edit Profile</span>
            </div>
            <ChevronRight className="w-4 h-4 text-sage-400" />
          </button>
          <button onClick={() => showToast('Password change is not available in this demo.', 'info')} className="w-full flex items-center justify-between p-3 bg-sage-50/50 rounded-xl hover:bg-sage-100 transition-colors">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-sage-500" />
              <span className="text-sm text-sage-700">Change Password</span>
            </div>
            <ChevronRight className="w-4 h-4 text-sage-400" />
          </button>
        </div>
      </div>

      {/* Privacy */}
      <div className="card mb-6">
        <h2 className="font-semibold text-sage-800 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-sage-500" /> Privacy
        </h2>
        <div className="space-y-3">
          <div className="p-3 bg-sage-50/50 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-4 h-4 text-sage-500" />
              <span className="text-sm font-medium text-sage-700">Data Storage</span>
            </div>
            <p className="text-xs text-sage-400">Your assessment data is stored securely with row-level security. Only you can access your records. No camera or biometric data is ever collected.</p>
          </div>
          <button onClick={() => setShowDeleteHistory(true)} className="w-full flex items-center justify-between p-3 bg-red-50/50 rounded-xl hover:bg-red-50 transition-colors">
            <div className="flex items-center gap-3">
              <Trash2 className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600">Delete Assessment History</span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-300" />
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="card mb-6">
        <h2 className="font-semibold text-sage-800 mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-sage-500" /> Preferences
        </h2>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-sage-50/50 rounded-xl cursor-pointer">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-sage-500" />
              <span className="text-sm text-sage-700">Notifications</span>
            </div>
            <button onClick={() => setNotifications(!notifications)}
              className={`w-11 h-6 rounded-full transition-colors relative ${notifications ? 'bg-sage-600' : 'bg-sage-200'}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${notifications ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </label>
          <div className="flex items-center justify-between p-3 bg-sage-50/50 rounded-xl">
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-sage-500" />
              <span className="text-sm text-sage-700">Theme</span>
            </div>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="text-sm bg-white border border-sage-200 rounded-lg px-3 py-1.5 text-sage-700">
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="card">
        <h2 className="font-semibold text-sage-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-sage-500" /> Account Actions
        </h2>
        <div className="space-y-2">
          <button onClick={handleSignOut} className="w-full flex items-center justify-between p-3 bg-sage-50/50 rounded-xl hover:bg-sage-100 transition-colors">
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4 text-sage-500" />
              <span className="text-sm text-sage-700">Logout</span>
            </div>
            <ChevronRight className="w-4 h-4 text-sage-400" />
          </button>
          <button onClick={() => setShowDeleteAccount(true)} className="w-full flex items-center justify-between p-3 bg-red-50/50 rounded-xl hover:bg-red-50 transition-colors">
            <div className="flex items-center gap-3">
              <Trash2 className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600">Delete Account</span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-300" />
          </button>
        </div>
      </div>

      {/* Delete History Modal */}
      <Modal open={showDeleteHistory} onClose={() => setShowDeleteHistory(false)} title="Delete Assessment History"
        actions={<>
          <button onClick={() => setShowDeleteHistory(false)} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleDeleteHistory} className="btn-primary text-sm !bg-red-500 hover:!bg-red-600">Delete All</button>
        </>}>
        This will permanently delete all your assessment records. This action cannot be undone.
      </Modal>

      {/* Delete Account Modal */}
      <Modal open={showDeleteAccount} onClose={() => setShowDeleteAccount(false)} title="Delete Account"
        actions={<>
          <button onClick={() => setShowDeleteAccount(false)} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleDeleteAccount} className="btn-primary text-sm !bg-red-500 hover:!bg-red-600">Delete Account</button>
        </>}>
        This will permanently delete your account, all assessments, and questionnaire responses. This action cannot be undone.
      </Modal>
    </div>
  );
}
