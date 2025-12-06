import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Certificate {
  id: string;
  opportunity_title: string;
  organization_name: string;
  issue_date: string;
  hours_completed: number;
}

export default function Certificates() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCertificates();
    }
  }, [user]);

  const loadCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('volunteer_id', user?.id)
        .order('issue_date', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error loading certificates:', error);
      toast.error("Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = (cert: Certificate) => {
    // Generate simple text certificate
    const content = `
CERTIFICATE OF VOLUNTEER SERVICE

This certifies that

${user?.user_metadata?.first_name} ${user?.user_metadata?.last_name}

Has successfully completed volunteer service

Activity: ${cert.opportunity_title}
Organization: ${cert.organization_name}
Hours Completed: ${cert.hours_completed}
Date: ${new Date(cert.issue_date).toLocaleDateString()}

Thank you for your dedication and service to the community!
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${cert.opportunity_title.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success("Certificate downloaded");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="flex items-center gap-3 mb-8">
          <Award className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">My Certificates</h1>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading certificates...</div>
          </div>
        ) : certificates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No certificates yet</h3>
              <p className="text-muted-foreground">
                Complete volunteer activities to earn certificates
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                  <div className="flex items-start justify-between">
                    <Award className="w-10 h-10 text-primary" />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => downloadCertificate(cert)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardTitle className="mt-4">{cert.opportunity_title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Organization:</span>
                      <p className="font-medium">{cert.organization_name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Hours Completed:</span>
                      <p className="font-medium">{cert.hours_completed} hours</p>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(cert.issue_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}