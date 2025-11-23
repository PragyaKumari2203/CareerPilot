import { useState, ReactNode } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { X, Plus, Upload, User2 } from 'lucide-react';
import { toast } from 'sonner';
import type { User, Page } from '../App';

type ProfilePageProps = {
  user: User;
  onUpdateUser: (user: User) => void;
  onNavigate: (page: Page) => void;
};

export function ProfilePage({ user, onUpdateUser, onNavigate }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [location, setLocation] = useState(user.location || '');
  const [linkedin, setLinkedin] = useState(user.linkedin || '');
  const [github, setGithub] = useState(user.github || '');
  const [portfolio, setPortfolio] = useState(user.portfolio || '');
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(user.profileImageUrl);

  const [technicalSkills, setTechnicalSkills] = useState<string[]>(user.technicalSkills || []);
  const [softSkills, setSoftSkills] = useState<string[]>(user.softSkills || []);
  const [toolsAndTechnologies, setToolsAndTechnologies] = useState<string[]>(user.toolsAndTechnologies || []);

  const [newSkill, setNewSkill] = useState('');
  const [skillCategory, setSkillCategory] = useState<'technical' | 'soft' | 'tools'>('technical');

  const [education, setEducation] = useState(
    user.education?.length
      ? user.education
      : [{ degree: '', institution: '', year: '', grade: '' }]
  );

  const [languages, setLanguages] = useState<string[]>(user.languages || []);
  const [newLanguage, setNewLanguage] = useState('');

  const [interests, setInterests] = useState<string[]>(user.interests || []);
  const [newInterest, setNewInterest] = useState('');

  // Handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileImageUrl(url);
      toast.success('Photo updated!');
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const skill = newSkill.trim();
    if (skillCategory === 'technical') setTechnicalSkills(prev => [...prev, skill]);
    if (skillCategory === 'soft') setSoftSkills(prev => [...prev, skill]);
    if (skillCategory === 'tools') setToolsAndTechnologies(prev => [...prev, skill]);
    setNewSkill('');
  };

  const removeSkill = (category: 'technical' | 'soft' | 'tools', skill: string) => {
    if (category === 'technical') setTechnicalSkills(prev => prev.filter(s => s !== skill));
    if (category === 'soft') setSoftSkills(prev => prev.filter(s => s !== skill));
    if (category === 'tools') setToolsAndTechnologies(prev => prev.filter(s => s !== skill));
  };

  const addEducation = () => setEducation(prev => [...prev, { degree: '', institution: '', year: '', grade: '' }]);
  const updateEducation = (i: number, field: keyof typeof education[0], value: string) => {
    setEducation(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  };
  const removeEducation = (i: number) => setEducation(prev => prev.filter((_, idx) => idx !== i));

  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages(prev => [...prev, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests(prev => [...prev, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleSave = async () => {
    if (!github.trim()) {
      toast.error('GitHub link is mandatory.');
      return;
    }

    const updatedUser: User = {
      ...user,
      name, email, phone, location, linkedin, github, portfolio,
      profileImageUrl, technicalSkills, softSkills, toolsAndTechnologies,
      education, languages, interests
    };

    try {
      const res = await fetch("http://localhost:5001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) throw new Error("Save failed");
      const savedUser = await res.json();
      onUpdateUser(savedUser);
      toast.success("Profile saved successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to save profile");
    }
  };

  // ================== VIEW MODE ==================
  if (!isEditing) {
    return (
      <DashboardLayout currentPage="profile" onNavigate={onNavigate} userName={user.name}>
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-primary/10 shadow-xl">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <User2 className="w-16 h-16 text-primary/60" />
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold mt-6">{name || 'Your Name'}</h1>
            <p className="text-muted-foreground mt-2">{email || 'your.email@example.com'}</p>
            <Button className="mt-6" size="lg" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard title="Basic Details">
              <InfoItem label="Phone" value={phone} />
              <InfoItem label="Location" value={location} />
            </InfoCard>

            <InfoCard title="Important Links">
              <LinkItem href={linkedin} label="LinkedIn" />
              <LinkItem href={github} label="GitHub" />
              <LinkItem href={portfolio} label="Portfolio" />
            </InfoCard>
          </div>

          <Card className="p-6 mt-6">
            <h3 className="text-xl font-semibold mb-5">Skills</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              <SkillDisplay title="Technical Skills" skills={technicalSkills} />
              <SkillDisplay title="Soft Skills" skills={softSkills} />
              <SkillDisplay title="Tools & Technologies" skills={toolsAndTechnologies} />
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Education</h3>
              {education.map((edu, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <p className="font-medium">{edu.degree || 'Degree'}</p>
                  <p className="text-sm text-muted-foreground">
                    {edu.institution} • {edu.year} {edu.grade && `• ${edu.grade}`}
                  </p>
                </div>
              ))}
            </Card>

            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Languages</h3>
                <TagRow items={languages} />
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Career Interests</h3>
                <TagRow items={interests} />
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ================== EDIT MODE ==================
  return (
    <DashboardLayout currentPage="profile" onNavigate={onNavigate} userName={user.name}>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave} size="lg">Save Changes</Button>
          </div>
        </div>

        {/* Profile Photo */}
        <Card className="p-8 text-center">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-8 ring-primary/10 shadow-2xl bg-gradient-to-br from-primary/5 to-accent/5">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User2 className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>
          <label className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl cursor-pointer hover:bg-primary/90 transition">
            <Upload className="w-5 h-5" />
            Change Photo
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6 space-y-5">
            <h3 className="text-xl font-semibold">Basic Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <LabeledInput label="Full Name" value={name} onChange={setName} />
              <LabeledInput label="Email" value={email} onChange={setEmail} />
              <LabeledInput label="Phone" value={phone} onChange={setPhone} />
              <LabeledInput label="Location" value={location} onChange={setLocation} />
            </div>
          </Card>

          <Card className="p-6 space-y-5">
            <h3 className="text-xl font-semibold">Professional Links</h3>
            <LabeledInput label="LinkedIn (optional)" value={linkedin} onChange={setLinkedin} />
            <LabeledInput
              label="GitHub (required)"
              value={github}
              onChange={setGithub}
              className={github ? '' : 'border-red-500'}
            />
            <LabeledInput label="Portfolio (optional)" value={portfolio} onChange={setPortfolio} />
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-5">Skills</h3>
          <div className="flex flex-wrap gap-3 mb-6">
            <select
              value={skillCategory}
              onChange={(e) => setSkillCategory(e.target.value as any)}
              className="px-4 py-2 border rounded-lg text-sm"
            >
              <option value="technical">Technical</option>
              <option value="soft">Soft Skills</option>
              <option value="tools">Tools</option>
            </select>
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Type a skill and press Enter"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button onClick={addSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
            <EditableSkillList title="Technical Skills" skills={technicalSkills} onRemove={(s) => removeSkill('technical', s)} />
            <EditableSkillList title="Soft Skills" skills={softSkills} onRemove={(s) => removeSkill('soft', s)} />
            <EditableSkillList title="Tools & Technologies" skills={toolsAndTechnologies} onRemove={(s) => removeSkill('tools', s)} />
          </div>
        </Card>

        {/* EDUCATION - FIXED SECTION */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-semibold">Education</h3>
            <Button variant="outline" onClick={addEducation}>
              <Plus className="w-4 h-4 mr-2" /> Add Education
            </Button>
          </div>

          {education.map((edu, i) => (
            <div key={i} className="p-5 border rounded-xl mb-4 bg-muted/30">
              {education.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="float-right -mt-2 -mr-2"
                  onClick={() => removeEducation(i)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                <LabeledInput label="Degree" value={edu.degree} onChange={(v) => updateEducation(i, 'degree', v)} />
                <LabeledInput label="Institution" value={edu.institution} onChange={(v) => updateEducation(i, 'institution', v)} />
                <LabeledInput label="Year" value={edu.year} onChange={(v) => updateEducation(i, 'year', v)} />
                <LabeledInput label="Grade/GPA (optional)" value={edu.grade || ''} onChange={(v) => updateEducation(i, 'grade', v)} />
              </div>
            </div>
          ))}
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Languages</h3>
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="e.g. English, Spanish..."
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
              />
              <Button onClick={addLanguage}>Add</Button>
            </div>
            <TagRow items={languages} onRemove={(item) => setLanguages(prev => prev.filter(l => l !== item))} />
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Career Interests</h3>
            <div className="flex gap-3 mb-4">
              <Input
                placeholder="e.g. Web Development, AI..."
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
              />
              <Button onClick={addInterest}>Add</Button>
            </div>
            <TagRow items={interests} onRemove={(item) => setInterests(prev => prev.filter(i => i !== item))} />
          </Card>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button variant="outline" size="lg" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button size="lg" onClick={handleSave}>
            Save All Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

const LabeledInput = ({ label, value, onChange, className = '' }: { label: string; value: string; onChange: (v: string) => void; className?: string }) => (
  <div className={className}>
    <Label className="text-sm font-medium">{label}</Label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5" />
  </div>
);

const EditableSkillList = ({ title, skills, onRemove }: { title: string; skills: string[]; onRemove: (s: string) => void }) => (
  <div>
    <h4 className="font-medium text-lg mb-3">{title}</h4>
    {skills.length === 0 ? (
      <p className="text-sm text-muted-foreground italic">No skills added</p>
    ) : (
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <Badge key={skill} variant="secondary" className="px-4 py-2 text-sm">
            {skill}
            <button onClick={() => onRemove(skill)} className="ml-3 hover:text-destructive">
              <X className="w-3.5 h-3.5" />
            </button>
          </Badge>
        ))}
      </div>
    )}
  </div>
);

const TagRow = ({ items, onRemove }: { items: string[]; onRemove?: (item: string) => void }) => {
  if (items.length === 0) return <p className="text-sm text-muted-foreground">None added</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(item => (
        <Badge key={item} variant="outline" className="px-4 py-2">
          {item}
          {onRemove && (
            <button onClick={() => onRemove(item)} className="ml-3 hover:text-red-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </Badge>
      ))}
    </div>
  );
};

const InfoCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <Card className="p-6">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <div className="space-y-3">{children}</div>
  </Card>
);

const InfoItem = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <span className="text-sm text-muted-foreground">{label}:</span>
    <p className="font-medium">{value || '—'}</p>
  </div>
);

const LinkItem = ({ href, label }: { href?: string; label: string }) => {
  if (!href) return <InfoItem label={label} value="Not provided" />;
  return (
    <div>
      <span className="text-sm text-muted-foreground">{label}:</span>
      <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline block">
        {href}
      </a>
    </div>
  );
};

const SkillDisplay = ({ title, skills }: { title: string; skills: string[] }) => (
  <div>
    <h4 className="font-medium mb-3">{title}</h4>
    {skills.length === 0 ? (
      <p className="text-sm text-muted-foreground">None listed</p>
    ) : (
      <div className="flex flex-wrap gap-2">
        {skills.map(s => (
          <Badge key={s} variant="secondary" className="px-3 py-1">
            {s}
          </Badge>
        ))}
      </div>
    )}
  </div>
);










































































