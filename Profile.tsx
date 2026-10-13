import { useState } from 'react';
import { User, Mail, GraduationCap, Calendar, Check, Edit2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/Toast';

export function Profile() {
  const { profile, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name || '',
    age: profile?.age?.toString() || '',
    college: profile?.college || '',
    course: profile?.course || '',
    year: profile?.year || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({
      name: form.name,
      age: form.age ? parseInt(form.age) : null,
      college: form.college,
      course: form.course,
      year: form.year,
    });
    setSaving(false);
    if (error) {
      showToast('Could not update profile. Please try again.', 'error');
    } else {
      showToast('Profile updated successfully.', 'success');
      setEditing(false);
    }
  };

  const fields = [
    { icon: User, label: 'Full Name', value: profile?.name, key: 'name' },
    { icon: Mail, label: 'Email', value: profile?.email, key: 'email', readonly: true },
    { icon: Calendar, label: 'Age', value: profile?.age?.toString(), key: 'age' },
    { icon: GraduationCap, label: 'College', value: profile?.college, key: 'college' },
    { icon: GraduationCap, label: 'Course', value: profile?.course, key: 'course' },
    { icon: GraduationCap, label: 'Year', value: profile?.year, key: 'year' },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-sage-800 mb-1">Profile</h1>
        <p className="text-sage-500 text-sm">View and update your personal information</p>
      </div>

      <div className="card animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sage-100 flex items-center justify-center">
              <User className="w-8 h-8 text-sage-600" />
            </div>
            <div>
              <h2 className="font-semibold text-sage-800">{profile?.name}</h2>
              <p className="text-sm text-sage-500">{profile?.email}</p>
            </div>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-ghost text-sm flex items-center gap-2">
              <Edit2 className="w-4 h-4" /> Edit
            </button>
          )}
        </div>

        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="label-text">{field.label}</label>
              {editing && !field.readonly ? (
                field.key === 'year' ? (
                  <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="input-field">
                    <option value="">Select year</option>
                    {['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Postgraduate'].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                ) : (
                  <input type={field.key === 'age' ? 'number' : 'text'} value={(form as Record<string, string>)[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value } as typeof form)}
                    className="input-field" disabled={field.readonly} />
                )
              ) : (
                <div className="flex items-center gap-3 p-3 bg-sage-50/50 rounded-xl">
                  <field.icon className="w-4 h-4 text-sage-400" />
                  <span className="text-sage-700">{field.value || 'Not set'}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {editing && (
          <div className="flex gap-3 mt-6">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm">
              <Check className="w-4 h-4" /> {saving ? 'Saving...' : 'Update Profile'}
            </button>
            <button onClick={() => setEditing(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
