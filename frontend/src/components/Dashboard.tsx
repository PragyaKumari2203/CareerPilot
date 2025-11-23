// import { DashboardLayout } from "./DashboardLayout";
// import { Card } from "./ui/card";
// import { Button } from "./ui/button";
// import { Progress } from "./ui/progress";
// import { Badge } from "./ui/badge";
// import {
//   FileText,
//   TrendingUp,
//   Briefcase,
//   Target,
//   ArrowRight,
//   CheckCircle2,
//   Clock,
//   AlertCircle,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import type { User, Page } from "../App";

// type DashboardProps = {
//   user: User;
//   onNavigate: (page: Page) => void;
// };

// // Add this interface
// interface Application {
//   _id: string;
//   jobTitle: string;
//   company: string;
//   status: 'pending' | 'interview' | 'rejected' | 'accepted';
//   appliedDate: string;
//   location: string;
//   notes?: string;
//   jobUrl?: string;
// }

// export function Dashboard({
//   user,
//   onNavigate,
// }: DashboardProps) {
//   const profileCompletion = calculateProfileCompletion(user);
//   const [stats, setStats] = useState({
//     applications: 0,
//     interviews: 0,
//     skills: 0
//   });

//   // Add this state for recent applications
//   const [recentApplications, setRecentApplications] = useState<Application[]>([]);
//   const [loadingApplications, setLoadingApplications] = useState(true);

//   useEffect(() => {
//     async function getStats() {
//       try {
//         const res = await fetch(`http://localhost:5001/api/stats?userId=${user.authUserId}`);
//         const data = await res.json();
//         setStats(data);
//       } catch (e) {
//         console.error("Error fetching dashboard stats", e);
//       }
//     }
//     getStats();
//   }, [user.authUserId]);

//   // Add this new useEffect for fetching recent applications
//   useEffect(() => {
//     async function fetchRecentApplications() {
//       try {
//         const userId = (user as any)._id;
//         const response = await fetch(`http://localhost:5001/api/applications?userId=${userId}`, {
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           // Get only the 5 most recent applications
//           const sortedApplications = data
//             .sort((a: Application, b: Application) => 
//               new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
//             )
//             .slice(0, 3);
//           setRecentApplications(sortedApplications);
//         }
//       } catch (error) {
//         console.error('Error fetching applications:', error);
//       } finally {
//         setLoadingApplications(false);
//       }
//     }

//     fetchRecentApplications();
//   }, []);

//   const quickActions = [
//     {
//       label: "Build Resume",
//       icon: FileText,
//       page: "resume-builder" as Page,
//       description: "Create a professional resume",
//     },
//     {
//       label: "Analyze Resume",
//       icon: Target,
//       page: "resume-analyzer" as Page,
//       description: "Get AI-powered insights",
//     },
//     {
//       label: "Explore Careers",
//       icon: TrendingUp,
//       page: "career-paths" as Page,
//       description: "Discover career paths",
//     },
//     {
//       label: "Browse Jobs",
//       icon: Briefcase,
//       page: "jobs" as Page,
//       description: "Find opportunities",
//     },
//   ];

//   return (
//     <DashboardLayout
//       currentPage="dashboard"
//       onNavigate={onNavigate}
//       userName={user.name}
//     >
//       <div className="p-8">
//         <div className="mb-8">
//           <h1 className="mb-2">Welcome back, {user.name}!</h1>
//           <p className="text-muted-foreground">
//             Here's your career journey overview
//           </p>
//         </div>

//         {/* Profile Completion */}
//         <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
//           <div className="flex items-start justify-between mb-4">
//             <div>
//               <h3 className="mb-1">Complete Your Profile</h3>
//               <p className="text-sm text-muted-foreground">
//                 {profileCompletion}% complete - Add more details
//                 to unlock better recommendations
//               </p>
//             </div>
//             <Button onClick={() => onNavigate("profile")}>
//               Update Profile
//               <ArrowRight className="size-4 ml-2" />
//             </Button>
//           </div>
//           <Progress value={profileCompletion} className="h-2" />
//         </Card>

//         {/* Stats Grid */}
//         <div className="grid md:grid-cols-3 gap-6 mb-8">
//           <Card className="p-6">
//             <div className="flex items-center justify-between mb-2">
//               <p className="text-sm text-muted-foreground">
//                 Applications
//               </p>
//               <Briefcase className="size-4 text-muted-foreground" />
//             </div>
//             <div className="text-3xl mb-1">{stats.applications}</div>
//             <p className="text-xs text-muted-foreground">
//               Updated live
//             </p>
//           </Card>

//           <Card className="p-6">
//             <div className="flex items-center justify-between mb-2">
//               <p className="text-sm text-muted-foreground">
//                 Interviews
//               </p>
//               <Clock className="size-4 text-muted-foreground" />
//             </div>
//             <div className="text-3xl mb-1">{stats.interviews}</div>
//             <p className="text-xs text-muted-foreground">
//               Counted from applications
//             </p>
//           </Card>

//           <Card className="p-6">
//             <div className="flex items-center justify-between mb-2">
//               <p className="text-sm text-muted-foreground">
//                 Skills Added
//               </p>
//               <Target className="size-4 text-muted-foreground" />
//             </div>
//             <div className="text-3xl mb-1">
//               {stats.skills}
//             </div>

//             <p className="text-xs text-muted-foreground">
//               Keep growing
//             </p>
//           </Card>
//         </div>

//        <div className="grid lg:grid-cols-2 gap-8">
//           {/* Quick Actions */}
//           <div className="flex flex-col">
//             <h3 className="mb-4">Quick Actions</h3>
//             <div className="grid gap-4 flex-1">
//               {quickActions.map((action) => {
//                 const Icon = action.icon;
//                 return (
//                   <Card
//                     key={action.page}
//                     className="p-4 hover:shadow-md transition-shadow cursor-pointer"
//                     onClick={() => onNavigate(action.page)}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center">
//                         <Icon className="size-6 text-primary" />
//                       </div>
//                       <div className="flex-1">
//                         <h4 className="mb-1">{action.label}</h4>
//                         <p className="text-sm text-muted-foreground">
//                           {action.description}
//                         </p>
//                       </div>
//                       <ArrowRight className="size-5 text-muted-foreground" />
//                     </div>
//                   </Card>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Recent Activity - UPDATED SECTION */}
//           <div className="flex flex-col">
//             <div className="flex items-center justify-between mb-4">
//               <h3>Recent Applications</h3>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => onNavigate("applications")}
//               >
//                 View All
//               </Button>
//             </div>
//             <div className="space-y-3 flex-1">
//               {loadingApplications ? (
//                 <p className="text-sm text-muted-foreground">Loading...</p>
//               ) : recentApplications.length === 0 ? (
//                 <Card className="p-4">
//                   <p className="text-sm text-muted-foreground text-center">
//                     No applications yet. Start tracking your job applications!
//                   </p>
//                 </Card>
//               ) : (
//                 recentApplications.map((app) => (
//                   <Card key={app._id} className="p-4">
//                     <div className="flex items-start justify-between mb-2">
//                       <div>
//                         <h4 className="mb-1">{app.jobTitle}</h4>
//                         <p className="text-sm text-muted-foreground">
//                           {app.company}
//                         </p>
//                       </div>
//                       <Badge
//                         variant={
//                           app.status === "interview"
//                             ? "default"
//                             : app.status === "pending"
//                               ? "secondary"
//                               : app.status === "rejected"
//                                 ? "destructive"
//                                 : "default"
//                         }
//                       >
//                         {app.status === "interview" && (
//                           <CheckCircle2 className="size-3 mr-1" />
//                         )}
//                         {app.status === "pending" && (
//                           <Clock className="size-3 mr-1" />
//                         )}
//                         {app.status === "rejected" && (
//                           <AlertCircle className="size-3 mr-1" />
//                         )}
//                         {app.status === "accepted" && (
//                           <CheckCircle2 className="size-3 mr-1" />
//                         )}
//                         {app.status}
//                       </Badge>
//                     </div>
//                     <p className="text-xs text-muted-foreground">
//                       {new Date(app.appliedDate).toLocaleDateString()}
//                     </p>
//                   </Card>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

// function calculateProfileCompletion(user: User): number {
//   let completion = 0;

//   // Basic info
//   if (user.name) completion += 15;
//   if (user.email) completion += 15;

//   // Skills
//   const techSkillsCount = user.technicalSkills?.length || 0;
//   const softSkillsCount = user.softSkills?.length || 0;
//   const toolsCount = user.toolsAndTechnologies?.length || 0;
//   if (techSkillsCount + softSkillsCount + toolsCount > 0)
//     completion += 15;

//   // Education
//   if ((user.education?.length || 0) > 0) completion += 15;

//   // Interests
//   if ((user.interests?.length || 0) > 0) completion += 10;

//   // Languages
//   if ((user.languages?.length || 0) > 0) completion += 10;

//   // Important Links
//   if (user.github) completion += 15; // mandatory
//   if (user.linkedin || user.portfolio) completion += 5; // optional

//   return completion > 100 ? 100 : completion;
// }












































import { DashboardLayout } from "./DashboardLayout";
import { Card } from "./ui/card";
import {Button} from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  FileText,
  TrendingUp,
  Briefcase,
  Target,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { User, Page } from "../App";

type DashboardProps = {
  user: User;
  onNavigate: (page: Page) => void;
};

interface Application {
  _id: string;
  jobTitle: string;
  company: string;
  status: 'pending' | 'interview' | 'rejected' | 'accepted';
  appliedDate: string;
  location?: string;
  notes?: string;
  jobUrl?: string;
}

export function Dashboard({ user, onNavigate }: DashboardProps) {
  const profileCompletion = calculateProfileCompletion(user);
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    skills: 0
  });

  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(true);

  useEffect(() => {
    async function getStats() {
      try {
        const res = await fetch(`http://localhost:5001/api/stats?userId=${user.authUserId}`);
        const data = await res.json();
        setStats(data);
      } catch (e) {
        console.error("Error fetching dashboard stats", e);
      }
    }
    getStats();
  }, [user.authUserId]);

  useEffect(() => {
    async function fetchRecentApplications() {
      try {
        const userId = (user as any)._id;
        const response = await fetch(`http://localhost:5001/api/applications?userId=${userId}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data: Application[] = await response.json();
          const sorted = data
            .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
            .slice(0, 5); // Show up to 5 on larger screens
          setRecentApplications(sorted);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoadingApplications(false);
      }
    }

    if (user?.authUserId) fetchRecentApplications();
  }, [user]);

  const quickActions = [
    { label: "Build Resume", icon: FileText, page: "resume-builder" as Page, description: "Create a professional resume" },
    { label: "Analyze Resume", icon: Target, page: "resume-analyzer" as Page, description: "Get AI-powered insights" },
    { label: "Explore Careers", icon: TrendingUp, page: "career-paths" as Page, description: "Discover career paths" },
    { label: "Browse Jobs", icon: Briefcase, page: "jobs" as Page, description: "Find opportunities" },
  ];

  return (
    <DashboardLayout currentPage="dashboard" onNavigate={onNavigate} userName={user.name}>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Here's your career journey at a glance</p>
        </div>

        {/* Profile Completion Card */}
        <Card className="p-5 sm:p-6 mb-8 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h3 className="text-lg font-semibold mb-1">Complete Your Profile</h3>
              <p className="text-sm text-muted-foreground">
                {profileCompletion}% complete — Add details for better AI recommendations
              </p>
            </div>
            <Button size="sm" onClick={() => onNavigate("profile")}>
              Update Profile
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
          <Progress value={profileCompletion} className="h-3" />
        </Card>

        {/* Stats Grid - Responsive 1→2→3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap- gap-5 mb-8">
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Total Applications</p>
              <Briefcase className="size-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.applications}</div>
            <p className="text-xs text-muted-foreground mt-1">Live updated</p>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Interviews</p>
              <Clock className="size-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.interviews}</div>
            <p className="text-xs text-muted-foreground mt-1">From tracked applications</p>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Skills Added</p>
              <Target className="size-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.skills}</div>
            <p className="text-xs text-muted-foreground mt-1">Keep growing!</p>
          </Card>
        </div>

        {/* Main Content: Quick Actions + Recent Applications */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Quick Actions</h3>
            <div className="grid gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Card
                    key={action.page}
                    className="p-4 sm:p-5 hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer group"
                    onClick={() => onNavigate(action.page)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Icon className="size-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{action.label}</h4>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                      <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Recent Applications</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("applications")}
                className="text-primary hover:text-primary/80"
              >
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {loadingApplications ? (
                <div className="text-center py-8 text-muted-foreground">Loading applications...</div>
              ) : recentApplications.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="mx-auto size-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="size-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    No applications yet.<br />Start applying and track your progress here!
                  </p>
                </Card>
              ) : (
                recentApplications.map((app) => (
                  <Card key={app._id} className="p-5 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{app.jobTitle}</h4>
                        <p className="text-sm text-muted-foreground truncate">{app.company}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Applied {new Date(app.appliedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      <Badge
                        variant={
                          app.status === "accepted" || app.status === "interview"
                            ? "default"
                            : app.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                        className="flex items-center gap-1 whitespace-nowrap"
                      >
                        {app.status === "interview" && <CheckCircle2 className="size-3" />}
                        {app.status === "pending" && <Clock className="size-3" />}
                        {app.status === "rejected" && <AlertCircle className="size-3" />}
                        {app.status === "accepted" && <CheckCircle2 className="size-3" />}
                        <span className="capitalize">{app.status}</span>
                      </Badge>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Profile completion logic (unchanged)
function calculateProfileCompletion(user: User): number {
  let completion = 0;

  if (user.name) completion += 15;
  if (user.email) completion += 15;

  const techSkillsCount = user.technicalSkills?.length || 0;
  const softSkillsCount = user.softSkills?.length || 0;
  const toolsCount = user.toolsAndTechnologies?.length || 0;
  if (techSkillsCount + softSkillsCount + toolsCount > 0) completion += 15;

  if ((user.education?.length || 0) > 0) completion += 15;
  if ((user.interests?.length || 0) > 0) completion += 10;
  if ((user.languages?.length || 0) > 0) completion += 10;

  if (user.github) completion += 15;
  if (user.linkedin || user.portfolio) completion += 5;

  return Math.min(completion, 100);
}