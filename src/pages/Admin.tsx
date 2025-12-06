import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Users, ClipboardCheck, Award, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface UserRole {
  user_id: string;
  role: string;
}

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  user_type: string;
  verification_status: 'pending' | 'verified' | 'rejected';
}

interface Application {
  id: string;
  opportunity_id: string;
  status: string;
  attended: boolean | null;
  attendance_marked: boolean;
  applied_at: string;
  volunteer: {
    id: string;
    first_name: string | null;
    last_name: string | null;
  };
}

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error || !data) {
        toast.error("Access denied: Admin privileges required");
        navigate('/');
        return;
      }

      setIsAdmin(true);
      loadData();
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/');
    }
  };

  const loadData = async () => {
    try {
      const [profilesRes, applicationsRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase
          .from('volunteer_applications')
          .select('*')
          .order('applied_at', { ascending: false })
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (applicationsRes.error) throw applicationsRes.error;

      // Fetch volunteer profiles separately
      const volunteerIds = [...new Set(applicationsRes.data?.map(app => app.volunteer_id) || [])];
      const { data: volunteerProfiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', volunteerIds);

      const applicationsWithVolunteers = applicationsRes.data?.map((app: any) => ({
        ...app,
        volunteer: volunteerProfiles?.find(v => v.id === app.volunteer_id) || { id: app.volunteer_id, first_name: null, last_name: null }
      })) || [];

      setProfiles((profilesRes.data || []) as Profile[]);
      setApplications(applicationsWithVolunteers as Application[]);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const updateVerificationStatus = async (userId: string, status: 'pending' | 'verified' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ verification_status: status })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success(`User ${status === 'verified' ? 'verified' : 'rejected'} successfully`);
      loadData();
    } catch (error) {
      console.error('Error updating verification:', error);
      toast.error("Failed to update verification status");
    }
  };

  const markAttendance = async (applicationId: string, attended: boolean) => {
    try {
      const { error } = await supabase
        .from('volunteer_applications')
        .update({ attended, attendance_marked: true })
        .eq('id', applicationId);

      if (error) throw error;
      
      toast.success(`Attendance marked as ${attended ? 'present' : 'absent'}`);
      loadData();
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error("Failed to mark attendance");
    }
  };

  const issueCertificate = async (application: Application) => {
    if (!application.attended) {
      toast.error("Cannot issue certificate: volunteer did not attend");
      return;
    }

    try {
      const { error } = await supabase
        .from('certificates')
        .insert({
          volunteer_id: application.volunteer.id,
          application_id: application.id,
          opportunity_title: application.opportunity_id,
          organization_name: "Organization Name",
          hours_completed: 4
        });

      if (error) throw error;
      
      toast.success("Certificate issued successfully");
      loadData();
    } catch (error) {
      console.error('Error issuing certificate:', error);
      toast.error("Failed to issue certificate");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Admin Panel</h1>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="applications">
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="certificates">
              <Award className="w-4 h-4 mr-2" />
              Certificates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>
                          {profile.first_name} {profile.last_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{profile.user_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              profile.verification_status === 'verified'
                                ? 'default'
                                : profile.verification_status === 'rejected'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {profile.verification_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {profile.verification_status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateVerificationStatus(profile.id, 'verified')}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Verify
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateVerificationStatus(profile.id, 'rejected')}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Volunteer</TableHead>
                      <TableHead>Opportunity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          {app.volunteer?.first_name} {app.volunteer?.last_name}
                        </TableCell>
                        <TableCell>{app.opportunity_id}</TableCell>
                        <TableCell>
                          <Badge>{app.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {app.attendance_marked ? (
                            <Badge variant={app.attended ? 'default' : 'destructive'}>
                              {app.attended ? 'Present' : 'Absent'}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Not marked</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {!app.attendance_marked && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => markAttendance(app.id, true)}
                                >
                                  Present
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => markAttendance(app.id, false)}
                                >
                                  Absent
                                </Button>
                              </>
                            )}
                            {app.attended && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => issueCertificate(app)}
                              >
                                <Award className="w-4 h-4 mr-1" />
                                Issue Certificate
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <CardTitle>Certificate Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Certificates can be issued from the Applications tab after marking attendance as present.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}